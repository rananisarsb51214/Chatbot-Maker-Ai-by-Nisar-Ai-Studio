import React, { useState } from 'react';
import {
  BookOpen,
  Terminal,
  Shield,
  Layers,
  CheckCircle2,
  Database,
  Code,
  Copy,
  Check
} from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const curlChat = `curl -X POST "http://localhost:3000/api/chat" \\
  -H "Content-Type: application/json" \\
  -d '{
    "chatbotId": "bot_support_01",
    "message": "How do I embed this bot into my web application?",
    "conversationId": "conv_demo_1"
  }'`;

  const scriptTag = `<script 
  src="https://your-domain.com/widget.js" 
  data-bot-id="bot_support_01" 
  async>
</script>`;

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          System Architecture & Developer Reference
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Complete engineering specification for Chatbot Maker AI by Nisar AI Studio.
        </p>
      </div>

      {/* 1. Architecture Overview */}
      <section className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-base font-bold text-slate-900 dark:text-white">
          <Layers className="w-5 h-5 text-blue-500" />
          <span>1. Full-Stack System Architecture</span>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 leading-relaxed">
          <p>
            <strong>Frontend:</strong> React 19 SPA running on Vite with TypeScript, Tailwind CSS, Motion animations, and Lucide icons. Modularized with AuthContext and ThemeContext.
          </p>
          <p>
            <strong>Backend:</strong> Node.js with Express server hosting RESTful API endpoints for chatbots, RAG knowledge ingestion, conversation persistence, analytics, and administrator operations.
          </p>
          <p>
            <strong>AI Adapter:</strong> Server-side integration with <code className="font-mono bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">@google/genai</code> using Gemini 3.8 Flash with header telemetry (<code className="font-mono bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">'User-Agent': 'aistudio-build'</code>). Secrets are strictly confined to the backend.
          </p>
          <p>
            <strong>RAG Pipeline:</strong> Automatic sentence-boundary chunking with configurable overlap (600 chars / 100 overlap), BM25-style term retrieval, and SSRF-safe URL scraping (blocking private networks and metadata endpoints).
          </p>
        </div>
      </section>

      {/* 2. REST API Documentation */}
      <section className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-base font-bold text-slate-900 dark:text-white">
          <Terminal className="w-5 h-5 text-purple-500" />
          <span>2. REST API Specification</span>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-1.5">
              POST /api/chat - Chat Completion Endpoint
            </span>
            <div className="relative">
              <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {curlChat}
              </pre>
              <button
                onClick={() => copyCode(curlChat, 'chat')}
                className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center space-x-1 cursor-pointer"
              >
                {copiedKey === 'chat' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'chat' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-1.5">
              Widget Embed Snippet
            </span>
            <div className="relative">
              <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {scriptTag}
              </pre>
              <button
                onClick={() => copyCode(scriptTag, 'widget')}
                className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center space-x-1 cursor-pointer"
              >
                {copiedKey === 'widget' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'widget' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Firebase Setup Guide */}
      <section className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-base font-bold text-slate-900 dark:text-white">
          <Database className="w-5 h-5 text-amber-500" />
          <span>3. Firebase Setup & Security Rules</span>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
          <p>
            1. <strong>Security Rules:</strong> The file <code className="font-mono bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">firestore.rules</code> enforces granular ownership boundaries, ensuring users can only read and write their own chatbots, knowledge documents, and version snapshots.
          </p>
          <p>
            2. <strong>Role-Based Access Control:</strong> Administrative rights require verified server claims (<code className="font-mono bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">request.auth.token.role == 'admin'</code>). Client roles are never trusted.
          </p>
          <p>
            3. <strong>Blueprint:</strong> The schema blueprint in <code className="font-mono bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">firebase-blueprint.json</code> defines required validation rules and field types for all 11 collections.
          </p>
        </div>
      </section>

      {/* 4. Security Verification Checklist */}
      <section className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-base font-bold text-slate-900 dark:text-white">
          <Shield className="w-5 h-5 text-emerald-500" />
          <span>4. Security Verification Checklist</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            'Server-side Gemini API key isolation',
            'SSRF protection blocking private RFC1918 IPs',
            'Cloud metadata endpoint protection (169.254.169.254)',
            'Visitor request rate limiting on public widgets',
            'IDOR protection on chatbot deletion and updates',
            'Immutable version history snapshots with rollback',
            'Server-enforced role verification for admin routes',
            'Zero secret exposure in embed widgets or client bundles'
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center space-x-2 text-slate-800 dark:text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
