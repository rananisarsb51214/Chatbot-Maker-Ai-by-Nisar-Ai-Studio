import React, { useState, useEffect, useMemo } from 'react';
import { ChatbotTemplate, Chatbot } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Search,
  Star,
  Eye,
  Plus,
  X,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Filter,
  ArrowRight,
  BookOpen,
  Headphones,
  ShoppingBag,
  Target,
  GraduationCap,
  Terminal,
  PenTool,
  TrendingUp,
  Clock,
  Shield,
  Utensils,
  Zap,
  Info
} from 'lucide-react';

interface TemplateLibraryViewProps {
  onTemplateSelected: (chatbot: Chatbot) => void;
}

const CATEGORIES = [
  'All',
  'Business and Customer Support',
  'E-commerce',
  'Marketing and Sales',
  'Education',
  'AI and Technology',
  'Content Creation',
  'Professional Services',
  'Productivity',
  'Community and Communication',
  'Specialized Assistants'
];

export const TemplateLibraryView: React.FC<TemplateLibraryViewProps> = ({ onTemplateSelected }) => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<ChatbotTemplate[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterView, setFilterView] = useState<'all' | 'featured' | 'favorites'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'name-desc' | 'newest'>('featured');

  // Preview Modal
  const [previewTemplate, setPreviewTemplate] = useState<ChatbotTemplate | null>(null);
  const [cloningId, setCloningId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await api.getTemplates({ activeOnly: true });
      setTemplates(data.templates);
      setFavorites(data.favorites || []);
    } catch (e) {
      console.error('Failed to load templates:', e);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  // Toggle Favorite
  const handleToggleFavorite = async (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    const isFav = favorites.includes(templateId);
    try {
      if (isFav) {
        await api.removeFavoriteTemplate(templateId);
        setFavorites(prev => prev.filter(id => id !== templateId));
        showNotification('Removed from favorites.');
      } else {
        await api.addFavoriteTemplate(templateId);
        setFavorites(prev => [...prev, templateId]);
        showNotification('Saved to favorites!');
      }
    } catch (err: any) {
      alert(`Favorite error: ${err.message}`);
    }
  };

  // 1-Click Clone & Open in Editor
  const handleUseTemplate = async (template: ChatbotTemplate) => {
    if (cloningId) return; // Prevent double click
    setCloningId(template.id);
    setNotice(null);

    try {
      const res = await api.cloneTemplate(template.id);
      showNotification(`Chatbot "${res.chatbot.name}" created! Opening builder...`);
      setTimeout(() => {
        setCloningId(null);
        if (previewTemplate) setPreviewTemplate(null);
        onTemplateSelected(res.chatbot);
      }, 700);
    } catch (err: any) {
      alert(`Error using template: ${err.message}`);
      setCloningId(null);
    }
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Filter & Sort Logic
  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      // Category filter
      if (selectedCategory !== 'All' && t.category !== selectedCategory) {
        return false;
      }
      // Quick tab filter
      if (filterView === 'featured' && !t.isFeatured) {
        return false;
      }
      if (filterView === 'favorites' && !favorites.includes(t.id)) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesTag = t.tags.some(tag => tag.toLowerCase().includes(q));
        const matchesCat = t.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesTag && !matchesCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  }, [templates, selectedCategory, filterView, searchQuery, sortBy, favorites]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, filterView, sortBy]);

  const totalPages = Math.ceil(filteredTemplates.length / PAGE_SIZE) || 1;
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Business and Customer Support': return Headphones;
      case 'E-commerce': return ShoppingBag;
      case 'Marketing and Sales': return Target;
      case 'Education': return GraduationCap;
      case 'AI and Technology': return Terminal;
      case 'Content Creation': return PenTool;
      case 'Professional Services': return TrendingUp;
      case 'Productivity': return Clock;
      case 'Community and Communication': return Shield;
      case 'Specialized Assistants': return Utensils;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Nisar AI Studio • 50 Curated Bot Templates</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Production-Ready Chatbot Library
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
            Choose from 50 battle-tested persona templates across 10 business categories. 
            Click <strong>Use Template</strong> to instantiate your custom assistant in 1 second.
          </p>
        </div>
      </div>

      {/* Notification Banner */}
      {notice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Search, Filter Tabs & Sort Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 50 templates by title, tag, or topic..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          {/* Quick Filters (All, Featured, Favorites) & Sort */}
          <div className="flex items-center space-x-2 self-start sm:self-auto w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFilterView('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterView === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All ({templates.length})
              </button>
              <button
                onClick={() => setFilterView('featured')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                  filterView === 'featured'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Featured</span>
              </button>
              <button
                onClick={() => setFilterView('favorites')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                  filterView === 'favorites'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Favorites ({favorites.length})</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer shadow-xs focus:outline-none"
            >
              <option value="featured">Sort: Featured First</option>
              <option value="name-asc">Sort: Name (A-Z)</option>
              <option value="name-desc">Sort: Name (Z-A)</option>
              <option value="newest">Sort: Recently Added</option>
            </select>
          </div>

        </div>

        {/* 10 Category Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'All' ? templates.length : templates.filter(t => t.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Templates */}
      {loading ? (
        <div className="py-24 text-center text-sm text-slate-400">Loading 50 production templates...</div>
      ) : paginatedTemplates.length === 0 ? (
        <div className="py-20 px-4 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            No templates found matching your criteria
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, selecting "All Categories", or clearing your favorite filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setFilterView('all');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedTemplates.map((tpl) => {
            const isFav = favorites.includes(tpl.id);
            const isCloning = cloningId === tpl.id;
            const CatIcon = getCategoryIcon(tpl.category);

            return (
              <div
                key={tpl.id}
                className="group rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col justify-between overflow-hidden relative"
              >
                {/* Card Top */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={tpl.configuration.avatarUrl}
                        alt={tpl.name}
                        className="w-11 h-11 rounded-2xl object-cover border border-slate-100 dark:border-slate-700 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 truncate max-w-[160px]">
                            {tpl.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {tpl.name}
                        </h3>
                      </div>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => handleToggleFavorite(e, tpl.id)}
                      className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer text-slate-400 hover:text-amber-500"
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'text-amber-400 fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {tpl.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-[10px] font-medium text-slate-600 dark:text-slate-400 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                    {tpl.tags.length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{tpl.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setPreviewTemplate(tpl)}
                    className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleUseTemplate(tpl)}
                    disabled={isCloning}
                    className="flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isCloning ? 'Creating...' : 'Use Template'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="text-slate-500 dark:text-slate-400">
            Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, filteredTemplates.length)} of {filteredTemplates.length} templates
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 cursor-pointer font-medium"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 font-bold font-mono">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 cursor-pointer font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center space-x-3">
                <img
                  src={previewTemplate.configuration.avatarUrl}
                  alt={previewTemplate.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {previewTemplate.category}
                    </span>
                    {previewTemplate.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Featured
                      </span>
                    )}
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {previewTemplate.name}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              
              {/* Description */}
              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {previewTemplate.description}
                </p>
              </div>

              {/* Notice for health/legal/finance */}
              {(previewTemplate.category === 'Specialized Assistants') && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start space-x-2 text-amber-900 dark:text-amber-200">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong>Educational Notice:</strong> This template provides educational information and does not substitute for licensed healthcare, legal, or financial professional counsel. Relevant disclaimers are pre-configured into the system prompt.
                  </div>
                </div>
              )}

              {/* System Prompt Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">
                    System Instructions & Persona
                  </h4>
                  <button
                    onClick={() => handleCopyPrompt(previewTemplate.systemPrompt)}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center space-x-1 cursor-pointer hover:underline"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-48 border border-slate-800">
                  {previewTemplate.systemPrompt}
                </pre>
              </div>

              {/* Welcome Message */}
              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Welcome Greeting
                </h4>
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed">
                  {previewTemplate.welcomeMessage}
                </div>
              </div>

              {/* Starter Questions */}
              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Suggested Starter Questions
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {previewTemplate.suggestedQuestions.map((q, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 font-medium"
                    >
                      {q}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                <div>
                  <span className="text-slate-400 block">AI Model:</span>
                  <strong className="text-slate-900 dark:text-white">{previewTemplate.configuration.aiModel}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Personality:</span>
                  <strong className="text-slate-900 dark:text-white capitalize">{previewTemplate.configuration.personality}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Temperature:</span>
                  <strong className="text-slate-900 dark:text-white">{previewTemplate.configuration.temperature}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Response Style:</span>
                  <strong className="text-slate-900 dark:text-white capitalize">{previewTemplate.responseStyle}</strong>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Close Preview
              </button>

              <button
                onClick={() => handleUseTemplate(previewTemplate)}
                disabled={Boolean(cloningId)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{cloningId === previewTemplate.id ? 'Creating Chatbot...' : 'Use This Template'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
