import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Bot,
  Sun,
  Moon,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  LogOut,
  Sparkles,
  Plus,
  LayoutTemplate
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onCreateNewBot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onCreateNewBot }) => {
  const { user, switchUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                Chatbot Maker AI
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                PRO
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              by Nisar AI Studio
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Templates Library Shortcut */}
          <button
            onClick={() => onNavigate('templates')}
            className={`hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              currentView === 'templates'
                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutTemplate className="w-4 h-4 text-blue-500" />
            <span>Templates</span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              50
            </span>
          </button>

          {/* Quick Create Bot */}
          <button
            onClick={onCreateNewBot}
            className="hidden sm:inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all shadow-blue-500/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Chatbot</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* User Profile & Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-2.5 p-1.5 pl-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors bg-white dark:bg-slate-800 text-left cursor-pointer"
            >
              <img
                src={user?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80'}
                alt={user?.displayName || 'User'}
                className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div className="hidden md:block leading-tight pr-1">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                  <span>{user?.displayName || 'User'}</span>
                  {user?.role === 'admin' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 inline" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-slate-400 inline" />
                  )}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {user?.role === 'admin' ? 'Administrator' : 'Creator Tier'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/60 mb-1">
                  <div className="font-semibold text-slate-900 dark:text-white text-sm">
                    {user?.displayName}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs truncate">
                    {user?.email}
                  </div>
                  <div className="mt-1 flex items-center space-x-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <Sparkles className="w-3 h-3" />
                    <span>Gemini 3.8 Flash Connected</span>
                  </div>
                </div>

                {/* Quick Account Switcher for Demo & Testing RBAC */}
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Account (Test RBAC)
                </div>

                <button
                  onClick={() => {
                    switchUser('nisarrsna@gmail.com');
                    setUserDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer ${
                    user?.email === 'nisarrsna@gmail.com'
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div>
                    <div>Nisar Ahmed</div>
                    <div className="text-[10px] text-slate-400">nisarrsna@gmail.com (Admin)</div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-mono">
                    Admin
                  </span>
                </button>

                <button
                  onClick={() => {
                    switchUser('admin@nisaraistudio.com');
                    setUserDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer ${
                    user?.email === 'admin@nisaraistudio.com'
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div>
                    <div>Studio System Admin</div>
                    <div className="text-[10px] text-slate-400">admin@nisaraistudio.com</div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-mono">
                    Admin
                  </span>
                </button>

                <button
                  onClick={() => {
                    switchUser('creator@example.com');
                    setUserDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer ${
                    user?.email === 'creator@example.com'
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div>
                    <div>Sarah Developer</div>
                    <div className="text-[10px] text-slate-400">creator@example.com</div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                    User
                  </span>
                </button>

                <div className="border-t border-slate-100 dark:border-slate-700/60 my-1"></div>

                <button
                  onClick={() => {
                    onNavigate('settings');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 flex items-center space-x-2 cursor-pointer"
                >
                  <span>Account Settings & API Keys</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center space-x-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
