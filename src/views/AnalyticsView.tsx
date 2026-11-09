import React, { useState, useEffect } from 'react';
import { AnalyticsData } from '../types';
import { api } from '../services/api';
import {
  BarChart3,
  TrendingUp,
  Download,
  DollarSign,
  MessageSquare,
  Cpu,
  Layers,
  Calendar,
  Sparkles
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.getAnalytics();
      setData(res);
    } catch (e) {
      console.error('Failed to load analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    window.open(`/api/analytics/export?format=${format}`, '_blank');
  };

  if (loading) {
    return <div className="py-20 text-center text-sm text-slate-400">Loading analytics and telemetry metrics...</div>;
  }

  const metrics = data?.metrics;
  const maxDaily = Math.max(...(data?.dailyVolume.map(d => d.messages) || [1]), 1);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Analytics & AI Usage
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time telemetry, message volume, token consumption, and cost estimations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExport('csv')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExport('json')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-500" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Conversations</span>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {metrics?.totalConversations ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across hosted links & widget embeds
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Total Messages</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {metrics?.totalMessages ?? 0}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Real visitor interactions
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Token Consumption</span>
            <Cpu className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {(metrics?.totalTokens ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Prompts + completions
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Estimated AI Cost</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            ${(metrics?.estimatedCostUsd ?? 0).toFixed(4)}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
            Gemini 3.8 Flash Tier
          </div>
        </div>
      </div>

      {/* 7-Day Message Volume Bar Visualizer */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <span>7-Day Interaction Volume</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aggregated daily message telemetry
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
            Real Recorded Activity
          </span>
        </div>

        <div className="pt-6 pb-2">
          <div className="flex items-end justify-between gap-3 h-44">
            {data?.dailyVolume.map((item, idx) => {
              const heightPercent = Math.max(12, Math.round((item.messages / maxDaily) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.messages} msgs
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-slate-700/60 rounded-xl h-full flex items-end p-1">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-lg transition-all duration-500 hover:brightness-110"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                    {new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chatbot Leaderboard Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Chatbot Popularity & Cost Leaderboard
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                <th className="pb-3 font-semibold">Chatbot Name</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Conversations</th>
                <th className="pb-3 font-semibold text-right">Messages</th>
                <th className="pb-3 font-semibold text-right">Tokens Used</th>
                <th className="pb-3 font-semibold text-right">Est. Cost (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {data?.topChatbots.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">
                    {b.name}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      b.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono text-slate-600 dark:text-slate-300">
                    {b.conversations}
                  </td>
                  <td className="py-3 text-right font-mono text-slate-900 dark:text-white font-medium">
                    {b.messages}
                  </td>
                  <td className="py-3 text-right font-mono text-slate-600 dark:text-slate-300">
                    {b.tokens.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                    ${b.costUsd.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
