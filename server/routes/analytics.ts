import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { getAuthUser } from './auth.js';

export const analyticsRouter = Router();

// GET /api/analytics
analyticsRouter.get('/', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const isAdmin = user.role === 'admin';
  const chatbots = isAdmin ? db.getChatbots() : db.getChatbots(user.id);
  const botIds = new Set(chatbots.map(b => b.id));

  const allConversations = db.getConversations().filter(c => botIds.has(c.chatbotId));
  const usageRecords = db.getUsageRecords().filter(u => botIds.has(u.chatbotId));

  const totalBots = chatbots.length;
  const activeBots = chatbots.filter(b => b.status === 'published').length;
  const draftBots = chatbots.filter(b => b.status === 'draft').length;
  const archivedBots = chatbots.filter(b => b.status === 'archived').length;

  const totalConversations = allConversations.length;
  const totalMessages = allConversations.reduce((acc, c) => acc + (c.messageCount || 0), 0);
  const totalTokens = usageRecords.reduce((acc, r) => acc + (r.totalTokens || 0), 0);
  const totalCostUsd = usageRecords.reduce((acc, r) => acc + (r.estimatedCostUsd || 0), 0);

  // Group messages by day for the last 7 days
  const dailyVolume: { date: string; messages: number; tokens: number }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const recordsOnDate = usageRecords.filter(r => r.timestamp.startsWith(dateStr));
    dailyVolume.push({
      date: dateStr,
      messages: recordsOnDate.length,
      tokens: recordsOnDate.reduce((sum, r) => sum + r.totalTokens, 0)
    });
  }

  // Top chatbots by usage
  const topChatbots = chatbots.map(b => {
    const bRecords = usageRecords.filter(r => r.chatbotId === b.id);
    const bConvs = allConversations.filter(c => c.chatbotId === b.id);
    return {
      id: b.id,
      name: b.name,
      status: b.status,
      conversations: bConvs.length,
      messages: bConvs.reduce((acc, c) => acc + (c.messageCount || 0), 0),
      tokens: bRecords.reduce((acc, r) => acc + (r.totalTokens || 0), 0),
      costUsd: Number(bRecords.reduce((acc, r) => acc + (r.estimatedCostUsd || 0), 0).toFixed(4))
    };
  }).sort((a, b) => b.messages - a.messages);

  return res.json({
    metrics: {
      totalBots,
      activeBots,
      draftBots,
      archivedBots,
      totalConversations,
      totalMessages,
      totalTokens,
      estimatedCostUsd: Number(totalCostUsd.toFixed(4)),
      monthlyQuota: user.monthlyQuota,
      usedThisMonth: user.usedThisMonth
    },
    dailyVolume,
    topChatbots
  });
});

// GET /api/chatbots/:id/analytics
analyticsRouter.get('/bot/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const bot = db.getChatbotById(req.params.id);
  if (!bot) return res.status(404).json({ error: 'Chatbot not found' });

  if (bot.userId !== user?.id && user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const convs = db.getConversations(bot.id);
  const records = db.getUsageRecords().filter(r => r.chatbotId === bot.id);

  const totalConversations = convs.length;
  const totalMessages = convs.reduce((acc, c) => acc + (c.messageCount || 0), 0);
  const totalTokens = records.reduce((acc, r) => acc + (r.totalTokens || 0), 0);
  const totalCostUsd = records.reduce((acc, r) => acc + (r.estimatedCostUsd || 0), 0);

  return res.json({
    chatbotId: bot.id,
    name: bot.name,
    totalConversations,
    totalMessages,
    totalTokens,
    totalCostUsd: Number(totalCostUsd.toFixed(4)),
    recentUsage: records.slice(-20)
  });
});

// GET /api/analytics/export
analyticsRouter.get('/export', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const format = req.query.format === 'csv' ? 'csv' : 'json';
  const chatbots = user.role === 'admin' ? db.getChatbots() : db.getChatbots(user.id);
  const botIds = new Set(chatbots.map(b => b.id));
  const records = db.getUsageRecords().filter(u => botIds.has(u.chatbotId));

  if (format === 'csv') {
    let csv = 'Timestamp,ChatbotID,Model,PromptTokens,CompletionTokens,TotalTokens,EstimatedCostUSD\n';
    records.forEach(r => {
      csv += `"${r.timestamp}","${r.chatbotId}","${r.model}",${r.promptTokens},${r.completionTokens},${r.totalTokens},${r.estimatedCostUsd}\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="chatbot-analytics.csv"');
    return res.send(csv);
  }

  return res.json({ exportedAt: new Date().toISOString(), records });
});
