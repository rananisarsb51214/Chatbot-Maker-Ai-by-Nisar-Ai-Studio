import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import type { ChatbotTemplate } from '../db.js';
import { getAuthUser } from './auth.js';

export const templatesRouter = Router();

// Admin protection middleware helper
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

// GET /api/templates
templatesRouter.get('/', (req: Request, res: Response) => {
  try {
    const user = getAuthUser(req);
    const { q, category, featured, activeOnly } = req.query;

    const isAdmin = user?.role === 'admin';
    const filter = {
      search: q ? String(q) : undefined,
      category: category ? String(category) : undefined,
      featured: featured === 'true',
      activeOnly: isAdmin && activeOnly === 'false' ? false : true
    };

    const templates = db.getTemplates(filter);
    const userFavorites = user ? db.getUserFavorites(user.id) : [];

    return res.json({
      templates,
      total: templates.length,
      favorites: userFavorites
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch templates' });
  }
});

// GET /api/templates/user/favorites
templatesRouter.get('/user/favorites', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const favorites = db.getUserFavorites(user.id);
  return res.json({ favorites });
});

// GET /api/templates/:id
templatesRouter.get('/:id', (req: Request, res: Response) => {
  const template = db.getTemplateById(req.params.id) || db.getTemplateBySlug(req.params.id);
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  return res.json({ template });
});

// POST /api/templates/:id/clone (One-click chatbot creation from template)
templatesRouter.post('/:id/clone', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required to create a chatbot.' });
  }

  const { customName } = req.body || {};

  try {
    const newChatbot = db.cloneTemplateToChatbot(req.params.id, user.id, customName);

    db.logAudit({
      userId: user.id,
      userEmail: user.email,
      action: 'CHATBOT_CREATED_FROM_TEMPLATE',
      targetResource: newChatbot.id,
      details: `Created chatbot "${newChatbot.name}" from template ${req.params.id}`,
      ipAddress: req.ip
    });

    return res.status(201).json({
      chatbot: newChatbot,
      message: `Chatbot successfully created from template!`
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to clone template' });
  }
});

// POST /api/chatbots/:id/reset-to-template
templatesRouter.post('/chatbots/:id/reset-to-template', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const updated = db.resetChatbotToTemplate(req.params.id, user.id);
    if (!updated) {
      return res.status(404).json({ error: 'Chatbot not found' });
    }

    db.logAudit({
      userId: user.id,
      userEmail: user.email,
      action: 'CHATBOT_RESET_TO_TEMPLATE',
      targetResource: updated.id,
      details: `Reset chatbot "${updated.name}" to template defaults`,
      ipAddress: req.ip
    });

    return res.json({
      chatbot: updated,
      message: 'Chatbot configuration successfully reset to template defaults.'
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to reset chatbot' });
  }
});

// POST /api/templates/:id/favorite
templatesRouter.post('/:id/favorite', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });

  db.addFavorite(user.id, req.params.id);
  return res.json({ success: true, message: 'Added to favorites' });
});

// DELETE /api/templates/:id/favorite
templatesRouter.delete('/:id/favorite', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });

  db.removeFavorite(user.id, req.params.id);
  return res.json({ success: true, message: 'Removed from favorites' });
});

// ==========================================
// Admin Template Management Routes
// ==========================================

// POST /api/admin/templates
templatesRouter.post('/admin/templates', requireAdmin, (req: Request, res: Response) => {
  const {
    slug,
    name,
    category,
    description,
    icon,
    tags,
    systemPrompt,
    welcomeMessage,
    suggestedQuestions,
    defaultLanguage,
    responseStyle,
    recommendedFeatures,
    configuration,
    isFeatured
  } = req.body;

  if (!name || !systemPrompt || !category) {
    return res.status(400).json({ error: 'Name, category, and systemPrompt are required.' });
  }

  const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = `tpl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const newTemplate: ChatbotTemplate = {
    id,
    slug: generatedSlug,
    name,
    category,
    description: description || '',
    icon: icon || 'Bot',
    tags: tags || ['custom'],
    systemPrompt,
    welcomeMessage: welcomeMessage || `Hello! How can I assist you today?`,
    suggestedQuestions: suggestedQuestions || ['What can you help me with?'],
    defaultLanguage: defaultLanguage || 'English',
    responseStyle: responseStyle || 'balanced',
    recommendedFeatures: recommendedFeatures || [],
    configuration: configuration || {
      personality: 'friendly',
      temperature: 0.7,
      maxTokens: 1024,
      aiModel: 'gemini-3.8-flash',
      theme: {
        primaryColor: '#2563eb',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        userBubbleColor: '#2563eb',
        botBubbleColor: '#f1f5f9',
        borderRadius: '16px',
        position: 'bottom-right',
        fontFamily: 'Inter, sans-serif'
      },
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Ask a question...'
    },
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    isFeatured: Boolean(isFeatured)
  };

  db.createTemplate(newTemplate);

  const admin = getAuthUser(req)!;
  db.logAudit({
    userId: admin.id,
    userEmail: admin.email,
    action: 'ADMIN_TEMPLATE_CREATED',
    targetResource: newTemplate.id,
    details: `Admin created template "${newTemplate.name}"`,
    ipAddress: req.ip
  });

  return res.status(201).json({ template: newTemplate });
});

// PATCH /api/admin/templates/:id
templatesRouter.patch('/admin/templates/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateTemplate(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Template not found' });
  }

  const admin = getAuthUser(req)!;
  db.logAudit({
    userId: admin.id,
    userEmail: admin.email,
    action: 'ADMIN_TEMPLATE_UPDATED',
    targetResource: updated.id,
    details: `Admin updated template "${updated.name}" to version ${updated.version}`,
    ipAddress: req.ip
  });

  return res.json({ template: updated });
});

// DELETE /api/admin/templates/:id
templatesRouter.delete('/admin/templates/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteTemplate(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Template not found' });
  }

  const admin = getAuthUser(req)!;
  db.logAudit({
    userId: admin.id,
    userEmail: admin.email,
    action: 'ADMIN_TEMPLATE_DELETED',
    targetResource: req.params.id,
    details: `Admin deleted template ${req.params.id}`,
    ipAddress: req.ip
  });

  return res.json({ success: true, message: 'Template deleted' });
});
