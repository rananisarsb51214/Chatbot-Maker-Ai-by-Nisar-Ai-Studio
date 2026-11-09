import React, { useState, useEffect } from 'react';
import { Chatbot, KnowledgeSource } from '../types';
import { api } from '../services/api';
import { ChatPlayground } from '../components/ChatPlayground';
import { VersionHistoryModal } from '../components/VersionHistoryModal';
import { DeploymentModal } from '../components/DeploymentModal';
import {
  Save,
  Globe,
  Upload,
  FileText,
  Link,
  Trash2,
  RefreshCw,
  History,
  Palette,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Sparkles,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';

interface EditorViewProps {
  initialBot: Chatbot;
  onBack: () => void;
  onOpenHosted: (botId: string) => void;
}

export const EditorView: React.FC<EditorViewProps> = ({ initialBot, onBack, onOpenHosted }) => {
  const [bot, setBot] = useState<Chatbot>(initialBot);
  const [activeTab, setActiveTab] = useState<'general' | 'persona' | 'knowledge' | 'theme' | 'deploy'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [deployOpen, setDeployOpen] = useState(false);

  // Knowledge base state
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [loadingSources, setLoadingSources] = useState(false);
  const [crawlUrl, setCrawlUrl] = useState('');
  const [crawling, setCrawling] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [rawDocTitle, setRawDocTitle] = useState('');
  const [rawDocContent, setRawDocContent] = useState('');
  const [addingRaw, setAddingRaw] = useState(false);

  // Suggested questions temp input
  const [newQuestionInput, setNewQuestionInput] = useState('');

  // Load knowledge sources
  const loadKnowledge = async () => {
    setLoadingSources(true);
    try {
      const data = await api.getKnowledgeSources(bot.id);
      setSources(data.sources);
    } catch (e) {
      console.error('Failed to load knowledge:', e);
    } finally {
      setLoadingSources(false);
    }
  };

  useEffect(() => {
    loadKnowledge();
  }, [bot.id]);

  // Handle Save
  const handleSave = async (publishStatus?: 'draft' | 'published' | 'archived') => {
    setIsSaving(true);
    setSaveNotice(null);
    try {
      const updates: Partial<Chatbot> = {
        ...bot,
        ...(publishStatus ? { status: publishStatus } : {})
      };
      const updated = await api.updateChatbot(bot.id, updates, 'Saved settings in builder');
      setBot(updated);
      setSaveNotice('All changes saved and snapshot recorded.');
      setTimeout(() => setSaveNotice(null), 3000);
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to Template Defaults
  const handleResetToTemplate = async () => {
    if (!bot.templateId) {
      alert('This chatbot was not created from a template.');
      return;
    }
    if (!confirm(`Are you sure you want to reset "${bot.name}" to its original template defaults? This will restore default system prompts, tone, and theme without deleting any knowledge sources or conversation transcripts.`)) {
      return;
    }
    setIsSaving(true);
    try {
      const res = await api.resetToTemplate(bot.id);
      setBot(res.chatbot);
      setSaveNotice('Chatbot successfully restored to template defaults!');
      setTimeout(() => setSaveNotice(null), 3500);
    } catch (err: any) {
      alert(`Reset failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Add Question Chip
  const addQuestion = () => {
    if (!newQuestionInput.trim()) return;
    const current = bot.suggestedQuestions || [];
    setBot({ ...bot, suggestedQuestions: [...current, newQuestionInput.trim()] });
    setNewQuestionInput('');
  };

  const removeQuestion = (idx: number) => {
    const updated = (bot.suggestedQuestions || []).filter((_, i) => i !== idx);
    setBot({ ...bot, suggestedQuestions: updated });
  };

  // Crawl URL with safe SSRF check
  const handleCrawlUrl = async () => {
    if (!crawlUrl.trim() || crawling) return;
    setCrawling(true);
    setUrlError(null);

    try {
      const res = await api.fetchWebpage(crawlUrl.trim());
      // Automatically add as knowledge source
      const added = await api.addKnowledgeSource(bot.id, {
        type: 'url',
        name: `Webpage: ${new URL(crawlUrl).hostname}`,
        sourceUrl: crawlUrl.trim(),
        content: res.content,
        fileSizeBytes: Buffer.byteLength(res.content, 'utf8')
      });
      setSources(prev => [added, ...prev]);
      setCrawlUrl('');
      setSaveNotice(`Webpage crawled and indexed into ${added.chunkCount} chunks!`);
      setTimeout(() => setSaveNotice(null), 3000);
    } catch (err: any) {
      setUrlError(err.message || 'Failed to crawl URL.');
    } finally {
      setCrawling(false);
    }
  };

  // Add Raw Text / Markdown Document
  const handleAddRawText = async () => {
    if (!rawDocTitle.trim() || !rawDocContent.trim() || addingRaw) return;
    setAddingRaw(true);

    try {
      const added = await api.addKnowledgeSource(bot.id, {
        type: 'text',
        name: rawDocTitle.trim(),
        content: rawDocContent.trim(),
        fileSizeBytes: Buffer.byteLength(rawDocContent, 'utf8')
      });
      setSources(prev => [added, ...prev]);
      setRawDocTitle('');
      setRawDocContent('');
      setSaveNotice(`Document indexed into ${added.chunkCount} knowledge chunks!`);
      setTimeout(() => setSaveNotice(null), 3000);
    } catch (err: any) {
      alert(`Error indexing document: ${err.message}`);
    } finally {
      setAddingRaw(false);
    }
  };

  // Handle File Upload (.txt, .md, .json)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        const added = await api.addKnowledgeSource(bot.id, {
          type: 'file',
          name: file.name,
          content: text,
          fileSizeBytes: file.size
        });
        setSources(prev => [added, ...prev]);
        setSaveNotice(`Uploaded & indexed ${file.name} (${added.chunkCount} chunks)!`);
        setTimeout(() => setSaveNotice(null), 3000);
      } catch (err: any) {
        alert(`Error uploading file: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Delete Knowledge Source
  const handleDeleteSource = async (srcId: string, name: string) => {
    if (!confirm(`Delete knowledge source "${name}"?`)) return;
    try {
      await api.deleteKnowledgeSource(bot.id, srcId);
      setSources(prev => prev.filter(s => s.id !== srcId));
      setSaveNotice(`Source deleted.`);
      setTimeout(() => setSaveNotice(null), 2500);
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Reindex All
  const handleReindex = async () => {
    try {
      const res = await api.reindexKnowledge(bot.id);
      setSaveNotice(res.message);
      loadKnowledge();
      setTimeout(() => setSaveNotice(null), 3500);
    } catch (e: any) {
      alert(`Reindex failed: ${e.message}`);
    }
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {bot.name || 'Untitled Bot'}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                v{bot.version}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                bot.status === 'published'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {bot.status}
              </span>
              {bot.templateId && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 flex items-center space-x-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Template</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure persona, instructions, knowledge retrieval, and theme.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {bot.templateId && (
            <button
              onClick={handleResetToTemplate}
              disabled={isSaving}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Reset configuration to original template defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>Reset Defaults</span>
            </button>
          )}

          <button
            onClick={() => setHistoryOpen(true)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-purple-500" />
            <span>Rollback / History</span>
          </button>

          <button
            onClick={() => setDeployOpen(true)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>Deploy & Embed</span>
          </button>

          <button
            onClick={() => handleSave(bot.status === 'published' ? 'published' : 'draft')}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Save Notification */}
      {saveNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* Main Two-Column Layout: Left is Builder Tabs, Right is Live Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Tabbed Form (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-medium overflow-x-auto">
            {[
              { id: 'general', label: '1. Identity', icon: Globe },
              { id: 'persona', label: '2. Personality & Prompt', icon: Sliders },
              { id: 'knowledge', label: '3. Knowledge Base & RAG', icon: FileText },
              { id: 'theme', label: '4. Theme & Style', icon: Palette }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: General & Identity */}
          {activeTab === 'general' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-5 shadow-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Chatbot Name *
                </label>
                <input
                  type="text"
                  value={bot.name}
                  onChange={(e) => setBot({ ...bot, name: e.target.value })}
                  placeholder="E.g., Customer Support Pro, Sales Qualifier..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={bot.description}
                  onChange={(e) => setBot({ ...bot, description: e.target.value })}
                  placeholder="Short summary of what this bot handles..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Bot Avatar
                </label>
                <div className="flex items-center space-x-3 mb-3">
                  {avatarPresets.map((preset, idx) => (
                    <img
                      key={idx}
                      src={preset}
                      alt="Preset"
                      onClick={() => setBot({ ...bot, avatarUrl: preset })}
                      className={`w-10 h-10 rounded-xl object-cover cursor-pointer transition-all border-2 ${
                        bot.avatarUrl === preset ? 'border-blue-600 scale-105 shadow-sm' : 'border-transparent hover:opacity-80'
                      }`}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  value={bot.avatarUrl}
                  onChange={(e) => setBot({ ...bot, avatarUrl: e.target.value })}
                  placeholder="Or paste custom image URL..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Welcome Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Welcome Message
                </label>
                <textarea
                  rows={2}
                  value={bot.welcomeMessage}
                  onChange={(e) => setBot({ ...bot, welcomeMessage: e.target.value })}
                  placeholder="Greeting shown when conversation opens..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Input Placeholder & Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Input Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={bot.placeholderText}
                    onChange={(e) => setBot({ ...bot, placeholderText: e.target.value })}
                    placeholder="E.g., Ask a question..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Primary Language
                  </label>
                  <select
                    value={bot.language || 'English'}
                    onChange={(e) => setBot({ ...bot, language: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                </div>
              </div>

              {/* Status & Public Visibility */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Publish Status
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Published bots are accessible on their hosted link and embed widgets.
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setBot({ ...bot, status: bot.status === 'published' ? 'draft' : 'published', isPublic: bot.status !== 'published' })}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      bot.status === 'published'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {bot.status === 'published' ? 'Published' : 'Draft'}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Personality & Instructions */}
          {activeTab === 'persona' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-5 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    System Instructions & Role
                  </label>
                  <span className="text-[11px] text-slate-400">Instructs Gemini how to behave</span>
                </div>
                <textarea
                  rows={4}
                  value={bot.systemInstruction}
                  onChange={(e) => setBot({ ...bot, systemInstruction: e.target.value })}
                  placeholder="You are an expert customer support agent for..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              {/* Personality chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Tone & Personality Preset
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['friendly', 'professional', 'technical', 'concise', 'creative'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setBot({ ...bot, personality: p })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all cursor-pointer ${
                        bot.personality === p
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Response Length & Temperature */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Response Length
                  </label>
                  <select
                    value={bot.responseLength || 'balanced'}
                    onChange={(e) => setBot({ ...bot, responseLength: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="concise">Concise (Fast & short)</option>
                    <option value="balanced">Balanced (Standard)</option>
                    <option value="detailed">Detailed (In-depth explanations)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Creativity (Temperature: {bot.temperature})
                    </label>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={bot.temperature}
                    onChange={(e) => setBot({ ...bot, temperature: parseFloat(e.target.value) })}
                    className="w-full cursor-pointer accent-blue-600 mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Deterministic (0.0)</span>
                    <span>Balanced (0.7)</span>
                    <span>Creative (1.0)</span>
                  </div>
                </div>
              </div>

              {/* AI Provider & Model */}
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900 dark:text-blue-200">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>AI Engine Specification</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Provider:</span>
                    <strong className="text-slate-800 dark:text-slate-200">Google Gemini (Server-side)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Model:</span>
                    <strong className="text-slate-800 dark:text-slate-200">gemini-3.8-flash</strong>
                  </div>
                </div>
              </div>

              {/* Suggested Questions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Suggested Starter Question Chips
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={newQuestionInput}
                    onChange={(e) => setNewQuestionInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQuestion())}
                    placeholder="Type starter prompt and click Add..."
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addQuestion}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(bot.suggestedQuestions || []).map((q, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs flex items-center space-x-1.5"
                    >
                      <span>{q}</span>
                      <button
                        onClick={() => removeQuestion(idx)}
                        className="text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Knowledge Base & RAG */}
          {activeTab === 'knowledge' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Knowledge Base & RAG Sources
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ingest documents and websites. Answers will cite these documents automatically.
                  </p>
                </div>
                <button
                  onClick={handleReindex}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-index Chunks</span>
                </button>
              </div>

              {/* 3 Ingestion Channels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Method 1: Web URL Crawler with SSRF Protection */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span>Crawl Public Webpage</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Safe URL ingestion with automatic SSRF protection.
                  </p>
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="url"
                      value={crawlUrl}
                      onChange={(e) => setCrawlUrl(e.target.value)}
                      placeholder="https://example.com/docs"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                    <button
                      onClick={handleCrawlUrl}
                      disabled={crawling || !crawlUrl.trim()}
                      className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
                    >
                      {crawling ? 'Crawling...' : 'Crawl'}
                    </button>
                  </div>
                  {urlError && (
                    <div className="text-[11px] text-red-600 dark:text-red-400 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{urlError}</span>
                    </div>
                  )}
                </div>

                {/* Method 2: File Upload (txt/md/json) */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <Upload className="w-4 h-4 text-emerald-500" />
                    <span>Upload Document File</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Accepts Markdown (.md), Text (.txt), or JSON.
                  </p>
                  <label className="block w-full text-center py-2 px-3 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors">
                    <span>Select File to Index</span>
                    <input
                      type="file"
                      accept=".txt,.md,.json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

              </div>

              {/* Method 3: Raw Text Editor */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span>Add Raw Knowledge Text / FAQ</span>
                </div>
                <input
                  type="text"
                  value={rawDocTitle}
                  onChange={(e) => setRawDocTitle(e.target.value)}
                  placeholder="Document Title (e.g., Return Policy FAQ)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
                <textarea
                  rows={3}
                  value={rawDocContent}
                  onChange={(e) => setRawDocContent(e.target.value)}
                  placeholder="Paste documentation paragraphs, policies, answers, or specs..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
                <button
                  onClick={handleAddRawText}
                  disabled={addingRaw || !rawDocTitle.trim() || !rawDocContent.trim()}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {addingRaw ? 'Indexing...' : 'Index Document Chunks'}
                </button>
              </div>

              {/* Indexed Sources Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Indexed Sources ({sources.length})
                </h4>

                {loadingSources ? (
                  <div className="py-8 text-center text-xs text-slate-400">Loading sources...</div>
                ) : sources.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-400">
                    No knowledge sources indexed yet. Add web pages or documents above.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sources.map((src) => (
                      <div
                        key={src.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                            {src.type === 'url' ? <Globe className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          </div>
                          <div className="truncate">
                            <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                              {src.name}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                              <span>{src.chunkCount} RAG chunks</span>
                              <span>•</span>
                              <span>{((src.fileSizeBytes || 0) / 1024).toFixed(1)} KB</span>
                              <span>•</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Indexed</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteSource(src.id, src.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer flex-shrink-0"
                          title="Remove source"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: Theme & Style */}
          {activeTab === 'theme' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-5 shadow-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Brand Primary Accent Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={bot.theme?.primaryColor || '#2563eb'}
                    onChange={(e) => setBot({
                      ...bot,
                      theme: { ...(bot.theme || {} as any), primaryColor: e.target.value, userBubbleColor: e.target.value }
                    })}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
                  />
                  <div className="flex items-center space-x-2">
                    {['#2563eb', '#059669', '#7c3aed', '#dc2626', '#d97706', '#0f172a'].map((col) => (
                      <button
                        key={col}
                        onClick={() => setBot({
                          ...bot,
                          theme: { ...(bot.theme || {} as any), primaryColor: col, userBubbleColor: col }
                        })}
                        className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 shadow-sm transition-transform hover:scale-110 cursor-pointer"
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Position */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Widget Launcher Screen Position
                </label>
                <div className="flex space-x-3">
                  {(['bottom-right', 'bottom-left'] as const).map(pos => (
                    <button
                      key={pos}
                      onClick={() => setBot({
                        ...bot,
                        theme: { ...(bot.theme || {} as any), position: pos }
                      })}
                      className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all cursor-pointer ${
                        bot.theme?.position === pos
                          ? 'bg-blue-600 text-white font-semibold shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {pos.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Radius */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Chat Bubble Corner Rounding
                </label>
                <select
                  value={bot.theme?.borderRadius || '16px'}
                  onChange={(e) => setBot({
                    ...bot,
                    theme: { ...(bot.theme || {} as any), borderRadius: e.target.value }
                  })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                >
                  <option value="8px">Subtle (8px)</option>
                  <option value="16px">Standard Modern (16px)</option>
                  <option value="24px">Playful Rounded (24px)</option>
                </select>
              </div>

            </div>
          )}

        </div>

        {/* Right: Live Interactive Sandbox (5 cols) */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Live Interactive Sandbox</span>
              </span>
              <span className="text-[11px] text-slate-400">Instant test</span>
            </div>
            
            {/* Embedded Playground */}
            <div className="h-[620px]">
              <ChatPlayground chatbot={bot} />
            </div>
          </div>
        </div>

      </div>

      {/* Modals */}
      <VersionHistoryModal
        chatbot={bot}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onRollbackSuccess={(updated) => setBot(updated)}
      />

      <DeploymentModal
        chatbot={bot}
        isOpen={deployOpen}
        onClose={() => setDeployOpen(false)}
        onOpenHosted={() => onOpenHosted(bot.id)}
      />

    </div>
  );
};
