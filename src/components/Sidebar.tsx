import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Bot,
  PlusCircle,
  BarChart3,
  Shield,
  BookOpen,
  Settings,
  FileText,
  Zap,
  LayoutTemplate
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { user } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'My Chatbots', icon: Bot },
    { id: 'templates', label: 'Template Library', icon: LayoutTemplate, badge: '50' },
    { id: 'create', label: 'Create Chatbot', icon: PlusCircle },
    { id: 'analytics', label: 'Analytics & Costs', icon: BarChart3 },
    ...(user?.role === 'admin'
      ? [{ id: 'admin', label: 'Admin Dashboard', icon: Shield, badge: 'Admin' }]
      : []),
    { id: 'docs', label: 'Docs & API Reference', icon: BookOpen },
    { id: 'settings', label: 'Settings & Models', icon: Settings },
    { id: 'terms', label: 'Terms & Privacy', icon: FileText }
  ];

  const quotaPercent = user ? Math.min(100, Math.round(((user.usedThisMonth || 0) / (user.monthlyQuota || 1000)) * 100)) : 0;

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-50/60 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      
      {/* Navigation Links */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Studio Navigation
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === 'create' && currentView === 'editor-new');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive ? 'bg-blue-700 text-blue-100' : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quota & AI Usage Card */}
      <div className="mt-6 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Monthly Quota</span>
          </div>
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
            {quotaPercent}%
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${quotaPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>{(user?.usedThisMonth || 0).toLocaleString()} used</span>
          <span>{(user?.monthlyQuota || 1000).toLocaleString()} max</span>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 dark:text-slate-400">Plan:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-200 capitalize">
            {user?.tier || 'Pro'}
          </span>
        </div>
      </div>

    </aside>
  );
};
