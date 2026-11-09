import { Router, Request, Response } from 'express';
import { db, KnowledgeSource } from '../db.js';
import { chunkDocument, fetchUrlContent, isSafePublicUrl } from '../rag.js';
import { getAuthUser } from './auth.js';

export const knowledgeRouter = Router();

// GET /api/chatbots/:id/knowledge
knowledgeRouter.get('/:id/knowledge', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const bot = db.getChatbotById(req.params.id);
  if (!bot) return res.status(404).json({ error: 'Chatbot not found' });

  if (bot.userId !== user?.id && user?.role !== 'admin' && !bot.isPublic) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const sources = db.getKnowledgeSources(bot.id);
  const totalChunks = db.getKnowledgeChunks(bot.id).length;

  return res.json({ sources, totalChunks });
});

// POST /api/knowledge/fetch-url (SSRF-protected webpage text extraction)
knowledgeRouter.post('/fetch-url', async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'A valid URL is required.' });
  }

  const safeCheck = isSafePublicUrl(url);
  if (!safeCheck.safe) {
    return res.status(400).json({
      error: `Security Restriction: ${safeCheck.reason || 'This URL is not permitted for ingestion.'}`
    });
  }

  try {
    const extractedText = await fetchUrlContent(url);
    if (!extractedText || extractedText.length < 30) {
      return res.status(400).json({ error: 'Could not extract sufficient text from the provided webpage.' });
    }

    return res.json({
      url,
      extractedLength: extractedText.length,
      sampleText: extractedText.slice(0, 500) + '...',
      content: extractedText
    });
  } catch (err: any) {
    return res.status(500).json({ error: `Failed to fetch URL: ${err.message}` });
  }
});

// POST /api/chatbots/:id/knowledge
knowledgeRouter.post('/:id/knowledge', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const bot = db.getChatbotById(req.params.id);
  if (!bot) return res.status(404).json({ error: 'Chatbot not found' });

  if (bot.userId !== user.id && user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { type, name, content, sourceUrl, fileSizeBytes } = req.body;

  if (!name || !content || !content.trim()) {
    return res.status(400).json({ error: 'Document name and content are required.' });
  }

  // Size limit check (max 5MB of text content per document)
  if (content.length > 5 * 1024 * 1024) {
    return res.status(400).json({ error: 'Document exceeds the maximum limit of 5MB.' });
  }

  const sourceId = `ks_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const chunks = chunkDocument(content, sourceId, bot.id);

  const newSource: KnowledgeSource = {
    id: sourceId,
    chatbotId: bot.id,
    userId: user.id,
    type: type || 'text',
    name: name.trim(),
    sourceUrl: sourceUrl || undefined,
    content: content.trim(),
    chunkCount: chunks.length,
    status: 'indexed',
    fileSizeBytes: fileSizeBytes || Buffer.byteLength(content, 'utf8'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.addKnowledgeSource(newSource, chunks);

  db.logAudit({
    userId: user.id,
    userEmail: user.email,
    action: 'KNOWLEDGE_SOURCE_ADDED',
    targetResource: sourceId,
    details: `Added ${newSource.type} source "${newSource.name}" with ${chunks.length} chunks`,
    ipAddress: req.ip
  });

  return res.status(201).json({ source: newSource, chunksAdded: chunks.length });
});

// DELETE /api/chatbots/:id/knowledge/:sourceId
knowledgeRouter.delete('/:id/knowledge/:sourceId', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const bot = db.getChatbotById(req.params.id);
  if (!bot) return res.status(404).json({ error: 'Chatbot not found' });

  if (bot.userId !== user.id && user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const source = db.getKnowledgeSourceById(req.params.sourceId);
  if (!source) return res.status(404).json({ error: 'Knowledge source not found' });

  db.removeKnowledgeSource(source.id);

  db.logAudit({
    userId: user.id,
    userEmail: user.email,
    action: 'KNOWLEDGE_SOURCE_DELETED',
    targetResource: source.id,
    details: `Deleted knowledge source ${source.name}`,
    ipAddress: req.ip
  });

  return res.json({ success: true, message: 'Source deleted successfully' });
});

// POST /api/chatbots/:id/knowledge/reindex
knowledgeRouter.post('/:id/knowledge/reindex', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const bot = db.getChatbotById(req.params.id);
  if (!bot) return res.status(404).json({ error: 'Chatbot not found' });

  if (bot.userId !== user.id && user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const sources = db.getKnowledgeSources(bot.id);
  let totalReindexed = 0;

  for (const src of sources) {
    db.removeKnowledgeSource(src.id);
    const newChunks = chunkDocument(src.content, src.id, bot.id);
    db.addKnowledgeSource({ ...src, chunkCount: newChunks.length, status: 'indexed' }, newChunks);
    totalReindexed += newChunks.length;
  }

  return res.json({ message: `Successfully re-indexed ${sources.length} sources (${totalReindexed} chunks).` });
});
