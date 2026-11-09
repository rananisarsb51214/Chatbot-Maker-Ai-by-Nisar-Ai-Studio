import { Router, Request, Response } from 'express';
import { db, Conversation, Message } from '../db.js';
import { retrieveContext } from '../rag.js';
import { generateChatbotResponse } from '../ai.js';
import { getAuthUser } from './auth.js';

export const chatRouter = Router();

// In-memory rate limiting map for public chats: IP -> { count, windowStart }
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 40; // generous per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  entry.count++;
  return true;
}

// POST /api/chat (Playground / Authorized API Chat)
chatRouter.post('/', async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { chatbotId, message, conversationId, history } = req.body;

  if (!chatbotId || !message || typeof message !== 'string') {
    return res.status(400).json({ error: 'chatbotId and message are required.' });
  }

  const bot = db.getChatbotById(chatbotId);
  if (!bot) {
    return res.status(404).json({ error: 'Chatbot not found.' });
  }

  // Access check: owner, admin, or public
  if (!bot.isPublic && bot.userId !== user?.id && user?.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Chatbot is private.' });
  }

  try {
    // 1. Manage Conversation Session
    let activeConvId = conversationId;
    if (!activeConvId) {
      activeConvId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newConv: Conversation = {
        id: activeConvId,
        chatbotId: bot.id,
        userId: user?.id,
        visitorSessionId: `sess_${Date.now()}`,
        title: message.slice(0, 40) + (message.length > 40 ? '...' : ''),
        isPublic: bot.isPublic,
        messageCount: 0,
        totalTokens: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.createConversation(newConv);
    }

    // 2. Save User Message
    const userMsg: Message = {
      id: `msg_u_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      conversationId: activeConvId,
      chatbotId: bot.id,
      role: 'user',
      content: message.trim(),
      createdAt: new Date().toISOString()
    };
    db.addMessage(userMsg);

    // 3. RAG Retrieval
    const retrievedChunks = retrieveContext(bot.id, message, 3);
    const citations = retrievedChunks.map(r => ({
      sourceId: r.chunk.sourceId,
      sourceName: r.sourceName,
      snippet: r.chunk.content.slice(0, 150) + '...'
    }));

    // 4. Generate AI Completion
    const priorHistory = (history && Array.isArray(history)) ? history : db.getMessages(activeConvId).map(m => ({
      role: m.role,
      content: m.content
    }));

    const completion = await generateChatbotResponse(bot, priorHistory, message, retrievedChunks);

    // 5. Save Assistant Message
    const assistantMsg: Message = {
      id: `msg_a_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      conversationId: activeConvId,
      chatbotId: bot.id,
      role: 'assistant',
      content: completion.text,
      citations: citations.length > 0 ? citations : undefined,
      tokens: completion.totalTokens,
      latencyMs: completion.latencyMs,
      feedback: 'none',
      createdAt: new Date().toISOString()
    };
    db.addMessage(assistantMsg);

    // 6. Record Telemetry & Usage
    db.recordUsage({
      id: `usg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: bot.userId,
      chatbotId: bot.id,
      model: completion.model,
      promptTokens: completion.promptTokens,
      completionTokens: completion.completionTokens,
      totalTokens: completion.totalTokens,
      estimatedCostUsd: completion.estimatedCostUsd,
      timestamp: new Date().toISOString()
    });

    return res.json({
      message: assistantMsg,
      conversationId: activeConvId,
      model: completion.model,
      latencyMs: completion.latencyMs,
      tokens: completion.totalTokens,
      isMockFallback: completion.isMockFallback
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: err.message || 'An error occurred while generating the chatbot response.' });
  }
});

// POST /api/public/chat/:id (Embed & Hosted widget chat)
chatRouter.post('/public/:id', async (req: Request, res: Response) => {
  const clientIp = req.ip || 'anonymous';
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute before sending another message.' });
  }

  const bot = db.getChatbotById(req.params.id);
  if (!bot) {
    return res.status(404).json({ error: 'Chatbot not found.' });
  }

  if (!bot.isPublic && bot.status !== 'published') {
    return res.status(403).json({ error: 'This chatbot is currently offline or unpublished.' });
  }

  const { message, conversationId, visitorSessionId } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    let activeConvId = conversationId;
    if (!activeConvId) {
      activeConvId = `conv_pub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newConv: Conversation = {
        id: activeConvId,
        chatbotId: bot.id,
        visitorSessionId: visitorSessionId || `vis_${Date.now()}`,
        title: message.slice(0, 40),
        isPublic: true,
        messageCount: 0,
        totalTokens: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.createConversation(newConv);
    }

    const userMsg: Message = {
      id: `msg_u_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      conversationId: activeConvId,
      chatbotId: bot.id,
      role: 'user',
      content: message.trim(),
      createdAt: new Date().toISOString()
    };
    db.addMessage(userMsg);

    // RAG search
    const retrievedChunks = retrieveContext(bot.id, message, 3);
    const citations = retrievedChunks.map(r => ({
      sourceId: r.chunk.sourceId,
      sourceName: r.sourceName,
      snippet: r.chunk.content.slice(0, 150) + '...'
    }));

    const history = db.getMessages(activeConvId).map(m => ({
      role: m.role,
      content: m.content
    }));

    const completion = await generateChatbotResponse(bot, history, message, retrievedChunks);

    const assistantMsg: Message = {
      id: `msg_a_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      conversationId: activeConvId,
      chatbotId: bot.id,
      role: 'assistant',
      content: completion.text,
      citations: citations.length > 0 ? citations : undefined,
      tokens: completion.totalTokens,
      latencyMs: completion.latencyMs,
      feedback: 'none',
      createdAt: new Date().toISOString()
    };
    db.addMessage(assistantMsg);

    db.recordUsage({
      id: `usg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: bot.userId,
      chatbotId: bot.id,
      model: completion.model,
      promptTokens: completion.promptTokens,
      completionTokens: completion.completionTokens,
      totalTokens: completion.totalTokens,
      estimatedCostUsd: completion.estimatedCostUsd,
      timestamp: new Date().toISOString()
    });

    return res.json({
      message: assistantMsg,
      conversationId: activeConvId,
      latencyMs: completion.latencyMs
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Chat service error' });
  }
});

// GET /api/chatbots/:id/conversations
chatRouter.get('/:id/conversations', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const bot = db.getChatbotById(req.params.id);
  if (!bot) return res.status(404).json({ error: 'Chatbot not found' });

  if (bot.userId !== user?.id && user?.role !== 'admin' && !bot.isPublic) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const convs = db.getConversations(bot.id);
  return res.json({ conversations: convs });
});

// GET /api/conversations/:id/messages
chatRouter.get('/conversations/:id/messages', (req: Request, res: Response) => {
  const messages = db.getMessages(req.params.id);
  return res.json({ messages });
});

// DELETE /api/conversations/:id
chatRouter.delete('/conversations/:id', (req: Request, res: Response) => {
  db.deleteConversation(req.params.id);
  return res.json({ success: true });
});

// POST /api/messages/:id/feedback
chatRouter.post('/messages/:id/feedback', (req: Request, res: Response) => {
  const { feedback } = req.body;
  if (!feedback || !['like', 'dislike', 'none'].includes(feedback)) {
    return res.status(400).json({ error: 'Valid feedback (like, dislike, none) is required.' });
  }

  const ok = db.updateMessageFeedback(req.params.id, feedback);
  if (!ok) return res.status(404).json({ error: 'Message not found' });

  return res.json({ success: true, feedback });
});
