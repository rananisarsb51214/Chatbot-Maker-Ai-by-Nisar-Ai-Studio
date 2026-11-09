import React, { useState, useRef, useEffect } from 'react';
import { Chatbot, Message } from '../types';
import { api } from '../services/api';
import {
  Send,
  RotateCcw,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  BookOpen,
  Cpu,
  Clock,
  AlertCircle
} from 'lucide-react';

interface ChatPlaygroundProps {
  chatbot: Chatbot;
  standalone?: boolean;
}

export const ChatPlayground: React.FC<ChatPlaygroundProps> = ({ chatbot, standalone = false }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<{ model: string; latencyMs: number; tokens: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle send message
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setErrorMsg(null);
    setInput('');

    // Append optimistic user message
    const tempUserMsg: Message = {
      id: `usr_${Date.now()}`,
      conversationId: conversationId || '',
      chatbotId: chatbot.id,
      role: 'user',
      content: query,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await api.sendChatMessage({
        chatbotId: chatbot.id,
        message: query,
        conversationId,
        history: messages.map(m => ({ role: m.role, content: m.content }))
      });

      if (!conversationId) {
        setConversationId(res.conversationId);
      }

      setMessages(prev => [...prev, res.message]);
      setTelemetry({
        model: res.model,
        latencyMs: res.latencyMs,
        tokens: res.tokens
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset conversation
  const handleResetConversation = async () => {
    if (conversationId) {
      await api.clearConversation(conversationId).catch(() => {});
    }
    setMessages([]);
    setConversationId(undefined);
    setTelemetry(null);
    setErrorMsg(null);
  };

  // Copy to clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Submit feedback
  const handleFeedback = async (messageId: string, type: 'like' | 'dislike') => {
    try {
      await api.submitMessageFeedback(messageId, type);
      setMessages(prev =>
        prev.map(m => (m.id === messageId ? { ...m, feedback: type } : m))
      );
    } catch (e) {
      console.error('Feedback failed:', e);
    }
  };

  const primaryColor = chatbot.theme?.primaryColor || '#2563eb';

  return (
    <div className={`flex flex-col h-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm ${
      standalone ? 'min-h-[550px]' : 'h-full'
    }`}>
      
      {/* Playground Header */}
      <div className="px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={chatbot.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
              alt={chatbot.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                {chatbot.name || 'Chatbot Playground'}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                v{chatbot.version || 1}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[240px]">
              {chatbot.description || 'Live testing sandbox'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {telemetry && (
            <div className="hidden lg:flex items-center space-x-2 text-[11px] bg-slate-100 dark:bg-slate-700/60 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{telemetry.latencyMs}ms</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <div className="flex items-center space-x-1">
                <Cpu className="w-3 h-3 text-slate-400" />
                <span>{telemetry.tokens} tok</span>
              </div>
            </div>
          )}

          <button
            onClick={handleResetConversation}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Welcome Message Bubble */}
        <div className="flex items-start space-x-3">
          <img
            src={chatbot.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
            alt={chatbot.name}
            className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
          />
          <div className="space-y-2 max-w-[85%]">
            <div
              className="p-3.5 rounded-2xl rounded-tl-sm text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm leading-relaxed"
            >
              {chatbot.welcomeMessage || 'Hello! How can I assist you today?'}
            </div>

            {/* Suggested Question Chips */}
            {chatbot.suggestedQuestions && chatbot.suggestedQuestions.length > 0 && messages.length === 0 && (
              <div className="pt-2 flex flex-wrap gap-1.5">
                {chatbot.suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="text-xs text-left px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Stream */}
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {!isUser && (
                <img
                  src={chatbot.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
                  alt={chatbot.name}
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
                />
              )}

              <div className={`max-w-[85%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                    isUser
                      ? 'text-white rounded-tr-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-sm'
                  }`}
                  style={isUser ? { backgroundColor: primaryColor } : undefined}
                >
                  {msg.content}
                </div>

                {/* Citations if available from RAG */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <div className="font-semibold flex items-center space-x-1 text-[11px]">
                      <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Retrieved Knowledge References ({msg.citations.length}):</span>
                    </div>
                    {msg.citations.map((c, i) => (
                      <div key={i} className="pl-4 text-[11px] text-amber-800/90 dark:text-amber-300/90 border-l border-amber-300 dark:border-amber-800">
                        <span className="font-medium">{c.sourceName}:</span> "{c.snippet}"
                      </div>
                    ))}
                  </div>
                )}

                {/* Assistant message action bar (Copy, Feedback) */}
                {!isUser && (
                  <div className="flex items-center space-x-2 pt-1 text-slate-400 text-xs">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleFeedback(msg.id, 'like')}
                      className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                        msg.feedback === 'like' ? 'text-blue-600 dark:text-blue-400' : ''
                      }`}
                      title="Helpful"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleFeedback(msg.id, 'dislike')}
                      className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                        msg.feedback === 'dislike' ? 'text-red-500' : ''
                      }`}
                      title="Not helpful"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>

                    {msg.latencyMs && (
                      <span className="text-[10px] text-slate-400 pl-1 font-mono">
                        {msg.latencyMs}ms
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-start space-x-3">
            <img
              src={chatbot.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
              alt={chatbot.name}
              className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
            />
            <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm flex items-center space-x-1.5 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
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
            placeholder={chatbot.placeholderText || 'Type a message...'}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl text-white font-medium shadow-sm transition-all disabled:opacity-40 cursor-pointer flex-shrink-0"
            style={{ backgroundColor: primaryColor }}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
