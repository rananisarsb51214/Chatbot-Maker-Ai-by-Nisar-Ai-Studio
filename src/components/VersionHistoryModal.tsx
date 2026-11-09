import React, { useEffect, useState } from 'react';
import { ChatbotVersion, Chatbot } from '../types';
import { api } from '../services/api';
import { X, History, RotateCcw, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface VersionHistoryModalProps {
  chatbot: Chatbot;
  isOpen: boolean;
  onClose: () => void;
  onRollbackSuccess: (bot: Chatbot) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  chatbot,
  isOpen,
  onClose,
  onRollbackSuccess
}) => {
  const [versions, setVersions] = useState<ChatbotVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [rollingBackVer, setRollingBackVer] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadVersions();
    }
  }, [isOpen, chatbot.id]);

  const loadVersions = async () => {
    setLoading(true);
    try {
      const data = await api.getVersions(chatbot.id);
      setVersions(data);
    } catch (e) {
      console.error('Failed to load version history:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (verNum: number) => {
    if (!confirm(`Are you sure you want to rollback to Version ${verNum}? Current configuration will be backed up as a new version.`)) {
      return;
    }

    setRollingBackVer(verNum);
    setMessage(null);

    try {
      const updatedBot = await api.rollbackVersion(chatbot.id, verNum);
      setMessage(`Successfully rolled back to Version ${verNum}!`);
      onRollbackSuccess(updatedBot);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setMessage(`Rollback failed: ${err.message}`);
    } finally {
      setRollingBackVer(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Version History & Rollback
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Snapshots for {chatbot.name} (Current: v{chatbot.version})
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

        {/* Message Banner */}
        {message && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-xs text-blue-700 dark:text-blue-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            <span>{message}</span>
          </div>
        )}

        {/* Timeline Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading version snapshots...</div>
          ) : versions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">No previous versions available.</div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {versions.map((v) => {
                const isCurrent = v.versionNumber === chatbot.version;
                const isRolling = rollingBackVer === v.versionNumber;

                return (
                  <div key={v.id} className="relative group">
                    {/* Bullet marker */}
                    <span className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full ring-4 ring-white dark:ring-slate-900 ${
                      isCurrent ? 'bg-blue-600' : 'bg-slate-400'
                    }`} />

                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            Version {v.versionNumber}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                              Active
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          {v.changeSummary || 'Configuration updated'}
                        </p>

                        <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(v.createdAt).toLocaleString()}</span>
                          </span>
                          <span>•</span>
                          <span>Model: {v.snapshot.aiModel}</span>
                        </div>
                      </div>

                      {!isCurrent && (
                        <button
                          onClick={() => handleRollback(v.versionNumber)}
                          disabled={isRolling}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{isRolling ? 'Restoring...' : 'Rollback to v' + v.versionNumber}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-end">
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
