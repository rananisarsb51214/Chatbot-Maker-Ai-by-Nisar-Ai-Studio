import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { EditorView } from './views/EditorView';
import { AnalyticsView } from './views/AnalyticsView';
import { AdminView } from './views/AdminView';
import { SettingsView } from './views/SettingsView';
import { DocumentationView } from './views/DocumentationView';
import { TermsPrivacyView } from './views/TermsPrivacyView';
import { HostedBotView } from './views/HostedBotView';
import { TemplateLibraryView } from './views/TemplateLibraryView';
import { DeploymentModal } from './components/DeploymentModal';
import { ChatPlayground } from './components/ChatPlayground';
import { Chatbot } from './types';
import { api } from './services/api';
import { X, Sparkles, Bot } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedBot, setSelectedBot] = useState<Chatbot | null>(null);
  const [testBotModal, setTestBotModal] = useState<Chatbot | null>(null);
  const [deployBotModal, setDeployBotModal] = useState<Chatbot | null>(null);

  // Check path for public embed/hosted share: e.g. /share/:id or /embed/:id
  const pathname = window.location.pathname;
  if (pathname.startsWith('/share/')) {
    const botId = pathname.replace('/share/', '').trim();
    return <HostedBotView botId={botId} isEmbed={false} />;
  }
  if (pathname.startsWith('/embed/')) {
    const botId = pathname.replace('/embed/', '').trim();
    return <HostedBotView botId={botId} isEmbed={true} />;
  }

  // Handle create new chatbot
  const handleCreateNewBot = async () => {
    try {
      const created = await api.createChatbot({
        name: 'My New AI Chatbot',
        description: 'Custom AI assistant trained on knowledge sources.',
        welcomeMessage: 'Hello! I am your AI assistant. How can I help you today?',
        placeholderText: 'Ask a question...',
        systemInstruction: 'You are an intelligent, polite, and accurate assistant.',
        personality: 'friendly',
        responseLength: 'balanced',
        temperature: 0.7,
        status: 'draft',
        isPublic: false
      });
      setSelectedBot(created);
      setCurrentView('editor');
    } catch (e: any) {
      alert(`Could not create chatbot: ${e.message}`);
    }
  };

  const handleOpenHosted = (botId: string) => {
    window.open(`/share/${botId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500 text-xs">
        Initializing Chatbot Maker AI...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'create') {
            handleCreateNewBot();
          } else {
            setCurrentView(view);
          }
        }}
        onCreateNewBot={handleCreateNewBot}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => {
            if (view === 'create') {
              handleCreateNewBot();
            } else {
              setCurrentView(view);
            }
          }}
        />

        {/* Main Workspace Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentView === 'dashboard' && (
            <DashboardView
              onSelectBotForEdit={(bot) => {
                setSelectedBot(bot);
                setCurrentView('editor');
              }}
              onSelectBotForTest={(bot) => setTestBotModal(bot)}
              onSelectBotForDeploy={(bot) => setDeployBotModal(bot)}
              onCreateNewBot={handleCreateNewBot}
              onNavigateToTemplates={() => setCurrentView('templates')}
            />
          )}

          {currentView === 'editor' && selectedBot && (
            <EditorView
              initialBot={selectedBot}
              onBack={() => setCurrentView('dashboard')}
              onOpenHosted={handleOpenHosted}
            />
          )}

          {currentView === 'templates' && (
            <TemplateLibraryView
              onTemplateSelected={(clonedBot) => {
                setSelectedBot(clonedBot);
                setCurrentView('editor');
              }}
            />
          )}

          {currentView === 'analytics' && <AnalyticsView />}

          {currentView === 'admin' && <AdminView />}

          {currentView === 'docs' && <DocumentationView />}

          {currentView === 'settings' && <SettingsView />}

          {currentView === 'terms' && <TermsPrivacyView />}
        </main>
      </div>

      {/* Standalone Test Playground Modal */}
      {testBotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[650px] max-h-[90vh]">
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Test Playground: {testBotModal.name}
                </h3>
              </div>
              <button
                onClick={() => setTestBotModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-3 bg-slate-50 dark:bg-slate-900">
              <ChatPlayground chatbot={testBotModal} standalone={true} />
            </div>
          </div>
        </div>
      )}

      {/* Deployment Modal */}
      {deployBotModal && (
        <DeploymentModal
          chatbot={deployBotModal}
          isOpen={Boolean(deployBotModal)}
          onClose={() => setDeployBotModal(null)}
          onOpenHosted={() => handleOpenHosted(deployBotModal.id)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
