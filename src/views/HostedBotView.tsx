import React, { useState, useEffect, useRef } from 'react';
import { Chatbot, Message } from '../types';
import { api } from '../services/api';
import {
  Send,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  AlertTriangle,
  RotateCcw,
  Bot
} from 'lucide-react';

interface HostedBotViewProps {
  botId: string;
  isEmbed?: boolean;
}

export const HostedBotView: React.FC<HostedBotViewProps> = ({ botId, isEmbed = false }) => {
  const [bot, setBot] = useState<Chatbot | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSent, setReportSent] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadBot();
  }, [botId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadBot = async () => {
    try {
      const data = await api.getPublicChatbot(botId);
      setBot(data);
    } catch (e) {
      console.error('Failed to load hosted bot:', e);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading || !bot) return;

    setInput('');
    const tempUserMsg: Message = {
      id: `usr_${Date.now()}`,
      conversationId: conversationId || '',
      chatbotId: bot.id,
      role: 'user',
      content: query,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await api.sendPublicChatMessage(bot.id, {
        message: query,
        conversationId
      });

      if (!conversationId) {
        setConversationId(res.conversationId);
      }

      setMessages(prev => [...prev, res.message]);
    } catch (err: any) {
      alert(`Chat error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReportAbuse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim() || !bot) return;
    try {
      await api.submitAbuseReport(bot.id, reportReason);
      setReportSent(true);
      setTimeout(() => {
        setReportModalOpen(false);
        setReportSent(false);
        setReportReason('');
      }, 2000);
    } catch (e: any) {
      alert(`Failed to submit report: ${e.message}`);
    }
  };

  if (!bot) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 text-slate-500 text-xs">
        Loading chatbot assistant...
      </div>
    );
  }

  const primaryColor = bot.theme?.primaryColor || '#2563eb';

  return (
    <div className={`min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 font-sans ${isEmbed ? 'p-0' : 'p-2 sm:p-6'}`}>
      <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Hosted Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <img
                src={bot.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
                alt={bot.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                {bot.name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[280px]">
                {bot.description || 'AI Powered Assistant'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setMessages([]);
                setConversationId(undefined);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setReportModalOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Report content"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Welcome Message */}
          <div className="flex items-start space-x-3">
            <img
              src={bot.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
              alt={bot.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
            />
            <div className="space-y-3 max-w-[85%]">
              <div className="p-4 rounded-2xl rounded-tl-sm text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 leading-relaxed shadow-xs">
                {bot.welcomeMessage || 'Hello! How can I assist you today?'}
              </div>

              {bot.suggestedQuestions && bot.suggestedQuestions.length > 0 && messages.length === 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {bot.suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-xs px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3 text-blue-500" />
                      <span>{q}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Conversation Messages */}
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {!isUser && (
                  <img
                    src={bot.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
                    alt={bot.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
                  />
                )}

                <div className={`max-w-[85%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'text-white rounded-tr-sm shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-xs'
                    }`}
                    style={isUser ? { backgroundColor: primaryColor } : undefined}
                  >
                    {msg.content}
                  </div>

                  {msg.citations && msg.citations.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                      <div className="font-semibold flex items-center space-x-1 text-[11px]">
                        <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Source References:</span>
                      </div>
                      {msg.citations.map((c, i) => (
                        <div key={i} className="pl-3 text-[11px] border-l border-amber-300 dark:border-amber-700">
                          <strong>{c.sourceName}:</strong> "{c.snippet}"
                        </div>
                      ))}
                    </div>
                  )}

                  {!isUser && (
                    <div className="flex items-center space-x-2 pt-1 text-slate-400 text-xs">
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start space-x-3">
              <img
                src={bot.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
                alt={bot.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
              />
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm flex items-center space-x-1.5 shadow-xs">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={bot.placeholderText || 'Type your message...'}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 rounded-2xl text-white font-medium shadow-sm transition-all disabled:opacity-40 cursor-pointer flex-shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Branding */}
          <div className="mt-3 text-center text-[11px] text-slate-400 flex items-center justify-center space-x-1">
            <span>Powered by</span>
            <strong className="text-slate-600 dark:text-slate-300">Nisar AI Studio</strong>
            <span>• Chatbot Maker AI</span>
          </div>
        </div>

      </div>

      {/* Abuse Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Report Chatbot Content</span>
            </h3>
            <p className="text-xs text-slate-500">
              Please describe why you are reporting this chatbot for moderator review.
            </p>

            {reportSent ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs text-center font-medium">
                Thank you. Report received and sent to administrators.
              </div>
            ) : (
              <form onSubmit={handleReportAbuse} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Specify spam, policy violation, or incorrect knowledge..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 cursor-pointer"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
