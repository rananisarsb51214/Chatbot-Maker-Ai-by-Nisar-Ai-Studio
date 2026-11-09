import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRouter } from './server/routes/auth.js';
import { chatbotsRouter } from './server/routes/chatbots.js';
import { knowledgeRouter } from './server/routes/knowledge.js';
import { chatRouter } from './server/routes/chat.js';
import { analyticsRouter } from './server/routes/analytics.js';
import { adminRouter } from './server/routes/admin.js';
import { templatesRouter } from './server/routes/templates.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

// Body parsers with safe limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  return res.json({
    status: 'ok',
    service: 'Chatbot Maker AI by Nisar AI Studio',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount API Routers
app.use('/api/auth', authRouter);
app.use('/api/chatbots', chatbotsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/knowledge', knowledgeRouter);
app.use('/api/chat', chatRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/admin', adminRouter);

// Website Embeddable JavaScript Widget
app.get('/widget.js', (req: Request, res: Response) => {
  const host = req.protocol + '://' + req.get('host');
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
(function() {
  var scriptTag = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var botId = scriptTag ? scriptTag.getAttribute('data-bot-id') : null;
  if (!botId) {
    console.error('Chatbot Maker AI Widget: Missing data-bot-id attribute on script tag.');
    return;
  }

  var hostUrl = "${host}";

  // Create floating widget container
  var container = document.createElement('div');
  container.id = 'nisar-chatbot-widget-' + botId;
  container.style.position = 'fixed';
  container.style.bottom = '24px';
  container.style.right = '24px';
  container.style.zIndex = '999999';
  container.style.fontFamily = 'Inter, -apple-system, sans-serif';

  // Toggle button
  var btn = document.createElement('button');
  btn.style.width = '60px';
  btn.style.height = '60px';
  btn.style.borderRadius = '50%';
  btn.style.backgroundColor = '#2563eb';
  btn.style.color = '#ffffff';
  btn.style.border = 'none';
  btn.style.cursor = 'pointer';
  btn.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
  btn.style.display = 'flex';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';
  btn.style.transition = 'transform 0.2s ease';
  btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';

  // Iframe modal
  var iframe = document.createElement('iframe');
  iframe.src = hostUrl + '/embed/' + botId;
  iframe.style.width = '380px';
  iframe.style.height = '600px';
  iframe.style.maxHeight = 'calc(100vh - 110px)';
  iframe.style.maxWidth = 'calc(100vw - 32px)';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '16px';
  iframe.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.3)';
  iframe.style.display = 'none';
  iframe.style.marginBottom = '16px';

  btn.onclick = function() {
    var isOpen = iframe.style.display === 'block';
    iframe.style.display = isOpen ? 'none' : 'block';
    btn.innerHTML = isOpen 
      ? '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>'
      : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
  };

  container.appendChild(iframe);
  container.appendChild(btn);
  document.body.appendChild(container);
})();
  `);
});

async function startServer() {
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Chatbot Maker AI by Nisar AI Studio running on port ${PORT}`);
  });
}

startServer();
