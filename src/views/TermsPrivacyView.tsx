import React, { useState } from 'react';
import { FileText, Shield } from 'lucide-react';

export const TermsPrivacyView: React.FC = () => {
  const [tab, setTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Legal & Privacy Policies
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Chatbot Maker AI by Nisar AI Studio compliance and terms of service.
        </p>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setTab('terms')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            tab === 'terms'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Terms of Service
        </button>
        <button
          onClick={() => setTab('privacy')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            tab === 'privacy'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Privacy Policy
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {tab === 'terms' ? (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Terms of Service — Chatbot Maker AI
            </h2>
            <p>
              Last Updated: October 2026. By accessing or using Chatbot Maker AI by Nisar AI Studio, you agree to comply with and be bound by these terms.
            </p>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">1. Acceptable Use</h3>
            <p>
              Users may not create chatbots that generate hate speech, malware, phishing scams, or engage in abusive automated behaviors. We reserve the right to suspend any chatbot found in violation of our platform moderation guidelines.
            </p>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">2. Knowledge Base Ingestion</h3>
            <p>
              You warrant that you hold legitimate rights to all documents, markdown files, and web content ingested into the RAG knowledge retrieval system. Ingesting copyrighted or proprietary data without permission is prohibited.
            </p>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">3. Service Availability & Quotas</h3>
            <p>
              Usage is subject to tiered monthly message quotas. We reserve the right to throttle or rate-limit requests exceeding allocated thresholds.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Privacy Policy — Nisar AI Studio
            </h2>
            <p>
              We prioritize data privacy and user ownership. Your data belongs to you.
            </p>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">1. Data Collection & Isolation</h3>
            <p>
              We collect user profile details, chatbot configurations, and conversation logs. All user data is partitioned by unique user identification, enforced through strict database ownership boundaries.
            </p>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">2. AI Model Training</h3>
            <p>
              Your proprietary documents, conversation transcripts, and knowledge base chunks are never utilized to train public foundation models without explicit consent.
            </p>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">3. Data Deletion</h3>
            <p>
              Deleting a chatbot permanently purges its associated knowledge sources, version snapshots, and conversation transcripts from our active storage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
