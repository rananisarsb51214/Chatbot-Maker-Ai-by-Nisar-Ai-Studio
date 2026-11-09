import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  ShieldCheck,
  Sparkles,
  Key,
  Database,
  FileCode,
  Download,
  CheckCircle2,
  Lock,
  Save
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      await api.updateProfile({ displayName, photoURL });
      await refreshUser();
      setNotice('Profile updated successfully.');
      setTimeout(() => setNotice(null), 3000);
    } catch (err: any) {
      alert(`Error updating profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const downloadFile = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Account & Platform Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account profile, AI provider configuration, and Firebase Firestore credentials.
        </p>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-5">
        <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 dark:text-white">
          <User className="w-4 h-4 text-blue-500" />
          <span>User Profile</span>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="text"
                readOnly
                value={user?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Avatar Image URL
            </label>
            <input
              type="text"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-sm transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* AI Provider Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 dark:text-white">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>AI Engine & Provider Architecture</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-xs text-slate-900 dark:text-white">
                Default Model: Google Gemini 3.8 Flash
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Connected
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">@google/genai ^2.4.0</span>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
            <p>
              🔒 <strong>Server-Side Security Enforcement:</strong> All generative AI completions, token counting, and RAG context insertions execute exclusively in backend Node.js endpoints. API keys are never bundled, transmitted, or accessible to the browser client.
            </p>
            <p>
              ⚡ <strong>Adaptive Fallback Engine:</strong> In case of transient rate-limits or quota restrictions, the system gracefully falls back to an intelligent contextual assistant engine to preserve uninterrupted chatbot availability.
            </p>
          </div>
        </div>
      </div>

      {/* Firebase Firestore Blueprint & Rules */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 dark:text-white">
          <Database className="w-4 h-4 text-amber-500" />
          <span>Firebase Firestore Integration & Security Rules</span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          The application includes production-ready Firestore Security Rules (enforcing user ownership and administrator privileges) and a complete schema blueprint covering 11 collections:
        </p>

        <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-600 dark:text-slate-300">
          {['users', 'chatbots', 'chatbotVersions', 'knowledgeSources', 'conversations', 'messages', 'usageRecords', 'deployments', 'auditLogs', 'abuseReports', 'systemSettings'].map(col => (
            <span key={col} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700">
              {col}
            </span>
          ))}
        </div>

        <div className="pt-2 flex items-center space-x-3">
          <button
            onClick={async () => {
              const res = await fetch('/firestore.rules');
              const text = await res.text();
              downloadFile('firestore.rules', text, 'text/plain');
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span>Download firestore.rules</span>
          </button>

          <button
            onClick={async () => {
              const res = await fetch('/firebase-blueprint.json');
              const text = await res.text();
              downloadFile('firebase-blueprint.json', text, 'application/json');
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-500" />
            <span>Download firebase-blueprint.json</span>
          </button>
        </div>
      </div>

    </div>
  );
};
