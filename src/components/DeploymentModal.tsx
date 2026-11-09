import React, { useState } from 'react';
import { Chatbot } from '../types';
import {
  X,
  ExternalLink,
  Code,
  Copy,
  Check,
  Globe,
  Terminal,
  Download,
  ShieldCheck,
  Layers
} from 'lucide-react';

interface DeploymentModalProps {
  chatbot: Chatbot;
  isOpen: boolean;
  onClose: () => void;
  onOpenHosted: () => void;
}

export const DeploymentModal: React.FC<DeploymentModalProps> = ({
  chatbot,
  isOpen,
  onClose,
  onOpenHosted
}) => {
  const [activeTab, setActiveTab] = useState<'hosted' | 'widget' | 'iframe' | 'api' | 'config'>('hosted');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentOrigin = window.location.origin;
  const hostedUrl = `${currentOrigin}/share/${chatbot.id}`;
  const embedUrl = `${currentOrigin}/embed/${chatbot.id}`;
  const scriptTag = `<script src="${currentOrigin}/widget.js" data-bot-id="${chatbot.id}" async></script>`;
  const iframeSnippet = `<iframe\n  src="${embedUrl}"\n  width="100%"\n  height="650"\n  style="border: none; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);"\n  allow="microphone"\n></iframe>`;
  const curlSnippet = `curl -X POST "${currentOrigin}/api/chat" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "chatbotId": "${chatbot.id}",\n    "message": "Hello from custom API client"\n  }'`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadConfig = () => {
    const configData = {
      product: 'Chatbot Maker AI by Nisar AI Studio',
      exportedAt: new Date().toISOString(),
      chatbot: {
        id: chatbot.id,
        name: chatbot.name,
        description: chatbot.description,
        avatarUrl: chatbot.avatarUrl,
        welcomeMessage: chatbot.welcomeMessage,
        systemInstruction: chatbot.systemInstruction,
        personality: chatbot.personality,
        temperature: chatbot.temperature,
        theme: chatbot.theme,
        version: chatbot.version
      }
    };
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chatbot.name.toLowerCase().replace(/\s+/g, '-')}-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Deploy & Embed: {chatbot.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose from 5 integration channels with zero-key exposure security
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 dark:border-slate-800 flex space-x-2 overflow-x-auto text-xs font-medium">
          {[
            { id: 'hosted', label: '1. Hosted Page', icon: Globe },
            { id: 'widget', label: '2. Script Widget', icon: Layers },
            { id: 'iframe', label: '3. Responsive Iframe', icon: Code },
            { id: 'api', label: '4. REST API', icon: Terminal },
            { id: 'config', label: '5. Export JSON', icon: Download }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3 flex items-center space-x-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: Hosted Page */}
          {activeTab === 'hosted' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
                  <p className="font-semibold">Independent Public Web Address</p>
                  <p className="text-blue-800/80 dark:text-blue-300/80">
                    Your chatbot is hosted on an isolated, responsive public URL ready to share with customers, clients, or team members.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Public URL:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={hostedUrl}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200"
                  />
                  <button
                    onClick={() => copyToClipboard(hostedUrl, 'hosted')}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'hosted' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'hosted' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={onOpenHosted}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Script Widget */}
          {activeTab === 'widget' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Embed a floating chat bubble in the bottom right corner of any website. Simply paste this snippet before your HTML <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono">&lt;/body&gt;</code> closing tag:
              </p>

              <div className="relative">
                <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  {scriptTag}
                </pre>
                <button
                  onClick={() => copyToClipboard(scriptTag, 'script')}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center space-x-1 cursor-pointer"
                >
                  {copiedKey === 'script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'script' ? 'Copied' : 'Copy Snippet'}</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                ✅ Automatically adapts to mobile screens, handles visitor sessions, and matches the bot's custom brand colors.
              </div>
            </div>
          )}

          {/* TAB 3: Iframe */}
          {activeTab === 'iframe' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Embed your assistant directly into pages, docs, or web apps using a responsive iframe:
              </p>

              <div className="relative">
                <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  {iframeSnippet}
                </pre>
                <button
                  onClick={() => copyToClipboard(iframeSnippet, 'iframe')}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center space-x-1 cursor-pointer"
                >
                  {copiedKey === 'iframe' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'iframe' ? 'Copied' : 'Copy Iframe'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: REST API */}
          {activeTab === 'api' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Call this bot from your backend, mobile app, or CLI with JSON requests:
              </p>

              <div className="relative">
                <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  {curlSnippet}
                </pre>
                <button
                  onClick={() => copyToClipboard(curlSnippet, 'curl')}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center space-x-1 cursor-pointer"
                >
                  {copiedKey === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'curl' ? 'Copied' : 'Copy cURL'}</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                🔒 Security Note: Endpoints enforce server-side model processing. Your Gemini API key is never exposed in client requests.
              </div>
            </div>
          )}

          {/* TAB 5: JSON Config */}
          {activeTab === 'config' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Download a complete portable snapshot of your chatbot's persona, system instructions, knowledge references, and theme settings for backup or migration:
              </p>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center space-y-3">
                <Download className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                    {chatbot.name} Configuration File
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    JSON snapshot with version {chatbot.version}
                  </p>
                </div>
                <button
                  onClick={downloadConfig}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Configuration JSON</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1">
            <span className={`w-2 h-2 rounded-full ${chatbot.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>Status: <strong className="capitalize">{chatbot.status}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
