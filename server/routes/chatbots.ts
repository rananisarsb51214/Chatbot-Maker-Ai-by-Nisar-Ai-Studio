import { Router, Request, Response } from 'express';
import { db, Chatbot } from '../db.js';
import { getAuthUser } from './auth.js';

export const chatbotsRouter = Router();

// GET /api/chatbots
chatbotsRouter.get('/', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Admins see all or user bots; regular users see their own
  const bots = user.role === 'admin' ? db.getChatbots() : db.getChatbots(user.id);
  return res.json({ chatbots: bots });
});

// GET /api/public/chatbots/:id (Public view for embed & hosted page)
chatbotsRouter.get('/public/:id', (req: Request, res: Response) => {
  const bot = db.getChatbotById(req.params.id);
  if (!bot) {
    return res.status(404).json({ error: 'Chatbot not found' });
  }

  // Return public safe configuration
  const publicConfig = {
    id: bot.id,
    name: bot.name,
    description: bot.description,
    avatarUrl: bot.avatarUrl,
    welcomeMessage: bot.welcomeMessage,
    placeholderText: bot.placeholderText,
    suggestedQuestions: bot.suggestedQuestions,
    theme: bot.theme,
    status: bot.status,
    isPublic: bot.isPublic
  };

  return res.json({ chatbot: publicConfig });
});

// GET /api/chatbots/:id
chatbotsRouter.get('/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const bot = db.getChatbotById(req.params.id);
  if (!bot) {
    return res.status(404).json({ error: 'Chatbot not found' });
  }

  // Allow if owner or admin or public
  if (bot.userId !== user?.id && user?.role !== 'admin' && !bot.isPublic) {
    return res.status(403).json({ error: 'Access denied to private chatbot' });
  }

  return res.json({ chatbot: bot });
});

// POST /api/chatbots
chatbotsRouter.post('/', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const {
    name,
    description,
    avatarUrl,
    welcomeMessage,
    placeholderText,
    systemInstruction,
    personality,
    language,
    responseLength,
    temperature,
    suggestedQuestions,
    theme,
    aiProvider,
    aiModel,
    maxTokens,
    isPublic
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Chatbot name is required' });
  }

  const id = `bot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const defaultTheme = {
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    userBubbleColor: '#3b82f6',
    botBubbleColor: '#f3f4f6',
    borderRadius: '16px',
    position: 'bottom-right' as const,
    fontFamily: 'Inter, sans-serif'
  };

  const newBot: Chatbot = {
    id,
    userId: user.id,
    name: name.trim(),
    description: description || '',
    avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    welcomeMessage: welcomeMessage || `Hello! I am ${name}. How can I assist you today?`,
    placeholderText: placeholderText || 'Ask a question...',
    systemInstruction: systemInstruction || 'You are an intelligent, helpful, and courteous assistant.',
    personality: personality || 'friendly',
    language: language || 'English',
    responseLength: responseLength || 'balanced',
    temperature: temperature ?? 0.7,
    suggestedQuestions: suggestedQuestions || ['What can you help me with?', 'How does this work?'],
    theme: { ...defaultTheme, ...(theme || {}) },
    aiProvider: aiProvider || 'gemini',
    aiModel: aiModel || 'gemini-3.8-flash',
    maxTokens: maxTokens || 1024,
    status: 'draft',
    isPublic: Boolean(isPublic),
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.createChatbot(newBot);

  db.logAudit({
    userId: user.id,
    userEmail: user.email,
    action: 'CHATBOT_CREATED',
    targetResource: newBot.id,
    details: `Created new chatbot: ${newBot.name}`,
    ipAddress: req.ip
  });

  return res.status(201).json({ chatbot: newBot });
});

// PATCH /api/chatbots/:id
chatbotsRouter.patch('/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const bot = db.getChatbotById(req.params.id);
  if (!bot) return res.status(404).json({ error: 'Chatbot not found' });

  if (bot.userId !== user.id && user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: You do not own this chatbot.' });
  }

  const { changeSummary, ...updates } = req.body;
  const updatedBot = db.updateChatbot(bot.id, updates, changeSummary || 'Updated chatbot configuration');

  db.logAudit({
    userId: user.id,
    userEmail: user.email,
    action: 'CHATBOT_UPDATED',
    targetResource: bot.id,
    details: `Updated chatbot ${bot.name} to version ${updatedBot?.version}`,
    ipAddress: req.ip
  });

  return res.json({ chatbot: updatedBot });
});

// DELETE /api/chatbots/:id
chatbotsRouter.delete('/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const bot = db.getChatbotById(req.params.id);
  if (!bot) return res.status(404).json({ error: 'Chatbot not found' });

  if (bot.userId !== user.id && user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: You do not own this chatbot.' });
  }

  db.deleteChatbot(bot.id);

  db.logAudit({
    userId: user.id,
    userEmail: user.email,
    action: 'CHATBOT_DELETED',
    targetResource: bot.id,
    details: `Deleted chatbot ${bot.name}`,
    ipAddress: req.ip
  });

  return res.json({ success: true, message: 'Chatbot deleted successfully.' });
});

// POST /api/chatbots/:id/duplicate
chatbotsRouter.post('/:id/duplicate', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const original = db.getChatbotById(req.params.id);
  if (!original) return res.status(404).json({ error: 'Chatbot not found' });

  if (original.userId !== user.id && user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const newId = `bot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const cloned: Chatbot = {
    ...original,
    id: newId,
    name: `${original.name} (Copy)`,
    userId: user.id,
    version: 1,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.createChatbot(cloned);

  // Copy knowledge sources as well
  const originalSources = db.getKnowledgeSources(original.id);
  for (const src of originalSources) {
    const newSrcId = `ks_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const clonedSource = {
      ...src,
      id: newSrcId,
      chatbotId: newId,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const origChunks = db.getKnowledgeChunks(original.id).filter(c => c.sourceId === src.id);
    const clonedChunks = origChunks.map((c, i) => ({
      ...c,
      id: `chk_${newSrcId}_${i}`,
      sourceId: newSrcId,
      chatbotId: newId
    }));
    db.addKnowledgeSource(clonedSource, clonedChunks);
  }

  return res.status(201).json({ chatbot: cloned });
});

// POST /api/chatbots/:id/publish
chatbotsRouter.post('/:id/publish', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const bot = db.getChatbotById(req.params.id);
  if (!bot) return res.status(404).json({ error: 'Chatbot not found' });

  if (bot.userId !== user.id && user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { isPublic, status } = req.body;
  const updated = db.updateChatbot(bot.id, {
    isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
    status: status || 'published'
  }, 'Published chatbot to live status');

  return res.json({ chatbot: updated });
});

// GET /api/chatbots/:id/versions
chatbotsRouter.get('/:id/versions', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const bot = db.getChatbotById(req.params.id);
  if (!bot) return res.status(404).json({ error: 'Chatbot not found' });

  if (bot.userId !== user.id && user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const versions = db.getVersions(bot.id);
  return res.json({ versions });
});

// POST /api/chatbots/:id/rollback
chatbotsRouter.post('/:id/rollback', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const bot = db.getChatbotById(req.params.id);
  if (!bot) return res.status(404).json({ error: 'Chatbot not found' });

  if (bot.userId !== user.id && user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { versionNumber } = req.body;
  if (!versionNumber || typeof versionNumber !== 'number') {
    return res.status(400).json({ error: 'versionNumber integer is required' });
  }

  const rolledBack = db.rollbackToVersion(bot.id, versionNumber);
  if (!rolledBack) {
    return res.status(404).json({ error: `Version ${versionNumber} not found.` });
  }

  db.logAudit({
    userId: user.id,
    userEmail: user.email,
    action: 'CHATBOT_ROLLBACK',
    targetResource: bot.id,
    details: `Rolled back ${bot.name} to version ${versionNumber}`,
    ipAddress: req.ip
  });

  return res.json({ chatbot: rolledBack, message: `Successfully rolled back to version ${versionNumber}` });
});
