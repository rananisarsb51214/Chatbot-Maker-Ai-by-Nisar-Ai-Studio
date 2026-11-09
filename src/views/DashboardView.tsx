import React, { useState, useEffect } from 'react';
import { Chatbot, AnalyticsData } from '../types';
import { api } from '../services/api';
import {
  Plus,
  Search,
  Bot,
  MessageSquare,
  Sparkles,
  DollarSign,
  MoreVertical,
  ExternalLink,
  Copy,
  Trash2,
  Archive,
  Play,
  Settings,
  Layers,
  CheckCircle2,
  LayoutTemplate
} from 'lucide-react';

interface DashboardViewProps {
  onSelectBotForEdit: (bot: Chatbot) => void;
  onSelectBotForTest: (bot: Chatbot) => void;
  onSelectBotForDeploy: (bot: Chatbot) => void;
  onCreateNewBot: () => void;
  onNavigateToTemplates?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectBotForEdit,
  onSelectBotForTest,
  onSelectBotForDeploy,
  onCreateNewBot,
  onNavigateToTemplates
}) => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [actionMenuBotId, setActionMenuBotId] = useState<string | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bots, stats] = await Promise.all([
        api.getChatbots(),
        api.getAnalytics().catch(() => null)
      ]);
      setChatbots(bots);
      setAnalytics(stats);
    } catch (e) {
      console.error('Failed to load dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotice = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"? This removes all associated knowledge sources and versions.`)) {
      return;
    }
    try {
      await api.deleteChatbot(id);
      setChatbots(prev => prev.filter(b => b.id !== id));
      showNotice(`Chatbot "${name}" deleted.`);
    } catch (e: any) {
      alert(`Error deleting chatbot: ${e.message}`);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const cloned = await api.duplicateChatbot(id);
      setChatbots(prev => [cloned, ...prev]);
      showNotice(`Duplicated as "${cloned.name}".`);
    } catch (e: any) {
      alert(`Error duplicating chatbot: ${e.message}`);
    }
  };

  const handleArchive = async (bot: Chatbot) => {
    const newStatus = bot.status === 'archived' ? 'published' : 'archived';
    try {
      const updated = await api.updateChatbot(bot.id, { status: newStatus }, `Set status to ${newStatus}`);
      setChatbots(prev => prev.map(b => (b.id === bot.id ? updated : b)));
      showNotice(`Chatbot is now ${newStatus}.`);
    } catch (e: any) {
      alert(`Error updating status: ${e.message}`);
    }
  };

  const filteredBots = chatbots.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Metrics */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Chatbot Workspace
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Build, customize, and deploy AI assistants powered by Gemini and custom knowledge bases.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            {onNavigateToTemplates && (
              <button
                onClick={onNavigateToTemplates}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-all cursor-pointer shadow-sm"
              >
                <LayoutTemplate className="w-4 h-4 text-blue-500" />
                <span>Templates Library</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  50
                </span>
              </button>
            )}

            <button
              onClick={onCreateNewBot}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-sm transition-all shadow-blue-500/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Blank Bot</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2 animate-fade-in mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedbackNotice}</span>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span>Total Chatbots</span>
              <Bot className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {analytics?.metrics.totalBots ?? chatbots.length}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {chatbots.filter(b => b.status === 'published').length} published active
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span>Conversations</span>
              <MessageSquare className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {analytics?.metrics.totalConversations ?? 0}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              across hosted & embeds
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span>Messages Processed</span>
              <Sparkles className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {analytics?.metrics.totalMessages ?? 0}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {(analytics?.metrics.totalTokens ?? 0).toLocaleString()} tokens
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span>Estimated AI Cost</span>
              <DollarSign className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              ${(analytics?.metrics.estimatedCostUsd ?? 0).toFixed(4)}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              Gemini 3.8 Flash Economy
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chatbots by name or description..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center space-x-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['all', 'published', 'draft', 'archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                filterStatus === status
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Chatbots Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-400">Loading your chatbots...</div>
      ) : filteredBots.length === 0 ? (
        <div className="py-16 px-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3 bg-white/40 dark:bg-slate-900/40">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-base">
            {searchQuery ? 'No chatbots match your search' : 'No chatbots found'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {searchQuery ? 'Try adjusting your search terms or filters.' : 'Get started by creating your first AI chatbot assistant.'}
          </p>
          <div className="flex items-center justify-center space-x-2 pt-2">
            {onNavigateToTemplates && (
              <button
                onClick={onNavigateToTemplates}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center space-x-1.5 cursor-pointer shadow-sm transition-colors"
              >
                <LayoutTemplate className="w-4 h-4 text-blue-500" />
                <span>Explore 50 Templates</span>
              </button>
            )}
            <button
              onClick={onCreateNewBot}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Blank Bot</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBots.map((bot) => {
            const isMenuOpen = actionMenuBotId === bot.id;

            return (
              <div
                key={bot.id}
                className="group relative rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Card Top */}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={bot.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
                        alt={bot.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-100 dark:border-slate-700 shadow-sm"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {bot.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            bot.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : bot.status === 'draft'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                          }`}>
                            {bot.status}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            v{bot.version}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 3-dots Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setActionMenuBotId(isMenuOpen ? null : bot.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-20 text-xs">
                          <button
                            onClick={() => {
                              setActionMenuBotId(null);
                              onSelectBotForEdit(bot);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center space-x-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                          >
                            <Settings className="w-3.5 h-3.5" />
                            <span>Edit Builder</span>
                          </button>

                          <button
                            onClick={() => {
                              setActionMenuBotId(null);
                              onSelectBotForDeploy(bot);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center space-x-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Deploy & Embed</span>
                          </button>

                          <button
                            onClick={() => {
                              setActionMenuBotId(null);
                              handleDuplicate(bot.id);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center space-x-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Duplicate</span>
                          </button>

                          <button
                            onClick={() => {
                              setActionMenuBotId(null);
                              handleArchive(bot);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center space-x-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                          >
                            <Archive className="w-3.5 h-3.5" />
                            <span>{bot.status === 'archived' ? 'Unarchive' : 'Archive'}</span>
                          </button>

                          <div className="border-t border-slate-100 dark:border-slate-700 my-1" />

                          <button
                            onClick={() => {
                              setActionMenuBotId(null);
                              handleDelete(bot.id, bot.name);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center space-x-2 text-red-600 dark:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Chatbot</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                    {bot.description || 'No description provided.'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono">{bot.aiModel}</span>
                    <span>Style: <strong className="text-slate-600 dark:text-slate-300 capitalize">{bot.personality}</strong></span>
                  </div>
                </div>

                {/* Card Actions Bottom */}
                <div className="px-5 py-3 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectBotForTest(bot)}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Test Playground</span>
                  </button>

                  <button
                    onClick={() => onSelectBotForEdit(bot)}
                    className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                  >
                    <span>Configure</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
