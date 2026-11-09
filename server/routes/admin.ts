import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { getAuthUser } from './auth.js';

export const adminRouter = Router();

// Admin protection middleware
function requireAdmin(req: Request, res: Response, next: () => void) {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Administrator privileges required.' });
  }
  next();
}

// GET /api/admin/users
adminRouter.get('/users', requireAdmin, (req: Request, res: Response) => {
  const users = db.getUsers().map(({ passwordHash, ...safeUser }) => safeUser);
  return res.json({ users });
});

// PATCH /api/admin/users/:id/role
adminRouter.patch('/users/:id/role', requireAdmin, (req: Request, res: Response) => {
  const { role } = req.body;
  if (!role || !['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Valid role (admin, user) is required.' });
  }

  const updated = db.updateUser(req.params.id, { role });
  if (!updated) return res.status(404).json({ error: 'User not found.' });

  const admin = getAuthUser(req)!;
  db.logAudit({
    userId: admin.id,
    userEmail: admin.email,
    action: 'USER_ROLE_CHANGED',
    targetResource: req.params.id,
    details: `Changed role of user ${updated.email} to ${role}`,
    ipAddress: req.ip
  });

  const { passwordHash, ...safeUser } = updated;
  return res.json({ user: safeUser });
});

// PATCH /api/admin/users/:id/status
adminRouter.patch('/users/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status || !['active', 'suspended'].includes(status)) {
    return res.status(400).json({ error: 'Valid status (active, suspended) is required.' });
  }

  const updated = db.updateUser(req.params.id, { status });
  if (!updated) return res.status(404).json({ error: 'User not found.' });

  const admin = getAuthUser(req)!;
  db.logAudit({
    userId: admin.id,
    userEmail: admin.email,
    action: 'USER_STATUS_CHANGED',
    targetResource: req.params.id,
    details: `Updated status of user ${updated.email} to ${status}`,
    ipAddress: req.ip
  });

  const { passwordHash, ...safeUser } = updated;
  return res.json({ user: safeUser });
});

// GET /api/admin/audit-logs
adminRouter.get('/audit-logs', requireAdmin, (_req: Request, res: Response) => {
  const logs = db.getAuditLogs();
  return res.json({ logs });
});

// GET /api/admin/abuse-reports
adminRouter.get('/abuse-reports', requireAdmin, (_req: Request, res: Response) => {
  const reports = db.getAbuseReports();
  return res.json({ reports });
});

// POST /api/admin/abuse-reports (Publicly report a bot for moderation)
adminRouter.post('/abuse-reports', (req: Request, res: Response) => {
  const { chatbotId, reason, details } = req.body;
  if (!chatbotId || !reason) {
    return res.status(400).json({ error: 'chatbotId and reason are required.' });
  }

  const bot = db.getChatbotById(chatbotId);
  if (!bot) return res.status(404).json({ error: 'Chatbot not found.' });

  const user = getAuthUser(req);
  const report = {
    id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    chatbotId,
    reportedBy: user ? user.email : 'Anonymous Visitor',
    reason,
    details: details || '',
    status: 'pending' as const,
    createdAt: new Date().toISOString()
  };

  db.addAbuseReport(report);
  return res.status(201).json({ message: 'Abuse report submitted. Thank you for helping keep our platform safe.' });
});

// PATCH /api/admin/abuse-reports/:id
adminRouter.patch('/abuse-reports/:id', requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status || !['pending', 'investigating', 'resolved', 'dismissed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid report status.' });
  }

  const ok = db.updateAbuseReportStatus(req.params.id, status);
  if (!ok) return res.status(404).json({ error: 'Report not found.' });

  return res.json({ success: true, status });
});

// GET /api/admin/system-health
adminRouter.get('/system-health', requireAdmin, (_req: Request, res: Response) => {
  const mem = process.memoryUsage();
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');

  return res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    memory: {
      rssMb: Number((mem.rss / 1024 / 1024).toFixed(2)),
      heapUsedMb: Number((mem.heapUsed / 1024 / 1024).toFixed(2)),
      heapTotalMb: Number((mem.heapTotal / 1024 / 1024).toFixed(2))
    },
    aiProvider: {
      configured: hasGeminiKey,
      defaultModel: 'gemini-3.8-flash',
      mode: hasGeminiKey ? 'Gemini 3.8 Flash (Live Server API)' : 'Autonomous Intelligent Engine'
    },
    databaseCounts: {
      users: db.getUsers().length,
      chatbots: db.getChatbots().length,
      knowledgeChunks: db.getKnowledgeChunks('').length,
      conversations: db.getConversations().length,
      usageRecords: db.getUsageRecords().length,
      auditLogs: db.getAuditLogs().length
    }
  });
});
