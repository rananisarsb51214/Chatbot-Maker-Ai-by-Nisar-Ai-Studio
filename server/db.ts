import fs from 'fs';
import path from 'path';
import { INITIAL_TEMPLATES } from './templatesData';
import type { ChatbotTemplate } from './templatesData';

export type { ChatbotTemplate };

export interface User {
  id: string;
  email: string;
  passwordHash: string; // In-memory demo hash
  displayName: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended';
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
  tier: 'free' | 'pro' | 'enterprise';
  monthlyQuota: number;
  usedThisMonth: number;
}

export interface ChatbotTheme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  userBubbleColor: string;
  botBubbleColor: string;
  borderRadius: string;
  position: 'bottom-right' | 'bottom-left';
  fontFamily: string;
}

export interface Chatbot {
  id: string;
  userId: string;
  name: string;
  description: string;
  avatarUrl: string;
  welcomeMessage: string;
  placeholderText: string;
  systemInstruction: string;
  personality: 'friendly' | 'professional' | 'technical' | 'concise' | 'creative';
  language: string;
  responseLength: 'concise' | 'balanced' | 'detailed';
  temperature: number;
  suggestedQuestions: string[];
  theme: ChatbotTheme;
  aiProvider: string;
  aiModel: string;
  maxTokens: number;
  status: 'draft' | 'published' | 'archived';
  isPublic: boolean;
  version: number;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatbotVersion {
  id: string;
  chatbotId: string;
  userId: string;
  versionNumber: number;
  snapshot: Chatbot;
  changeSummary: string;
  createdAt: string;
}

export interface KnowledgeChunk {
  id: string;
  sourceId: string;
  chatbotId: string;
  content: string;
  metadata?: {
    pageNumber?: number;
    heading?: string;
  };
}

export interface KnowledgeSource {
  id: string;
  chatbotId: string;
  userId: string;
  type: 'file' | 'text' | 'url';
  name: string;
  sourceUrl?: string;
  content: string;
  chunkCount: number;
  status: 'processing' | 'indexed' | 'failed';
  errorMessage?: string;
  fileSizeBytes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Citation {
  sourceId: string;
  sourceName: string;
  snippet: string;
}

export interface Message {
  id: string;
  conversationId: string;
  chatbotId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Citation[];
  feedback?: 'like' | 'dislike' | 'none';
  tokens?: number;
  latencyMs?: number;
  createdAt: string;
}

export interface Conversation {
  id: string;
  chatbotId: string;
  userId?: string;
  visitorSessionId: string;
  title: string;
  isPublic: boolean;
  messageCount: number;
  totalTokens: number;
  createdAt: string;
  updatedAt: string;
}

export interface UsageRecord {
  id: string;
  userId: string;
  chatbotId: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  targetResource: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface AbuseReport {
  id: string;
  chatbotId: string;
  reportedBy: string;
  reason: string;
  details: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface UserFavorite {
  userId: string;
  templateId: string;
  createdAt: string;
}

export interface DatabaseState {
  users: User[];
  chatbots: Chatbot[];
  chatbotVersions: ChatbotVersion[];
  knowledgeSources: KnowledgeSource[];
  knowledgeChunks: KnowledgeChunk[];
  conversations: Conversation[];
  messages: Message[];
  usageRecords: UsageRecord[];
  auditLogs: AuditLog[];
  abuseReports: AbuseReport[];
  templates: ChatbotTemplate[];
  userFavorites: UserFavorite[];
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Data
const defaultTheme: ChatbotTheme = {
  primaryColor: '#3b82f6',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  userBubbleColor: '#3b82f6',
  botBubbleColor: '#f3f4f6',
  borderRadius: '16px',
  position: 'bottom-right',
  fontFamily: 'Inter, sans-serif'
};

const initialUsers: User[] = [
  {
    id: 'usr_admin_1',
    email: 'admin@nisaraistudio.com',
    passwordHash: 'admin123',
    displayName: 'Nisar AI Studio Admin',
    role: 'admin',
    status: 'active',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    tier: 'enterprise',
    monthlyQuota: 100000,
    usedThisMonth: 12450
  },
  {
    id: 'usr_nisar_1',
    email: 'nisarrsna@gmail.com',
    passwordHash: 'nisar123',
    displayName: 'Nisar Ahmed',
    role: 'admin',
    status: 'active',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    tier: 'enterprise',
    monthlyQuota: 100000,
    usedThisMonth: 4850
  },
  {
    id: 'usr_demo_1',
    email: 'creator@example.com',
    passwordHash: 'creator123',
    displayName: 'Sarah Developer',
    role: 'user',
    status: 'active',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    tier: 'pro',
    monthlyQuota: 20000,
    usedThisMonth: 1980
  }
];

const initialChatbots: Chatbot[] = [
  {
    id: 'bot_support_01',
    userId: 'usr_nisar_1',
    name: 'SaaS Customer Support Pro',
    description: 'Instant 24/7 technical customer support agent trained on platform docs and FAQs.',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    welcomeMessage: 'Hello! 👋 I am your Nisar AI Support assistant. How can I help you configure your chatbot or resolve technical questions today?',
    placeholderText: 'Ask about pricing, API integrations, webhooks...',
    systemInstruction: 'You are the official Customer Support specialist for Nisar AI Studio. You provide clear, empathetic, and accurate responses. When relevant, cite information from the provided knowledge base.',
    personality: 'friendly',
    language: 'English',
    responseLength: 'balanced',
    temperature: 0.6,
    suggestedQuestions: [
      'How do I embed a chatbot on my website?',
      'What AI models are supported by Chatbot Maker AI?',
      'How does knowledge base indexing (RAG) work?',
      'Can I rollback to an older chatbot version?'
    ],
    theme: {
      ...defaultTheme,
      primaryColor: '#2563eb',
      botBubbleColor: '#f1f5f9'
    },
    aiProvider: 'gemini',
    aiModel: 'gemini-3.8-flash',
    maxTokens: 1024,
    status: 'published',
    isPublic: true,
    version: 3,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bot_docs_02',
    userId: 'usr_nisar_1',
    name: 'Developer API Assistant',
    description: 'Assists software engineers with REST API specifications, curl examples, and webhook payloads.',
    avatarUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=120&auto=format&fit=crop&q=80',
    welcomeMessage: 'Welcome to the Developer Hub. Ready to query API schemas, authentication headers, or SDK snippets.',
    placeholderText: 'E.g., How do I authenticate to /api/chat with Bearer token?',
    systemInstruction: 'You are an expert technical solutions architect. Provide code snippets in curl, JavaScript/TypeScript, and Python. Always write secure, production-grade examples.',
    personality: 'technical',
    language: 'English',
    responseLength: 'detailed',
    temperature: 0.3,
    suggestedQuestions: [
      'How to make a POST request to /api/chat?',
      'What are the rate limits for the free tier?',
      'Show me an example widget embed snippet'
    ],
    theme: {
      ...defaultTheme,
      primaryColor: '#059669',
      botBubbleColor: '#f0fdf4'
    },
    aiProvider: 'gemini',
    aiModel: 'gemini-3.8-flash',
    maxTokens: 2048,
    status: 'published',
    isPublic: true,
    version: 1,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bot_sales_03',
    userId: 'usr_demo_1',
    name: 'Enterprise Sales Qualifier',
    description: 'Engages inbound leads, answers enterprise feature questions, and captures customer inquiries.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    welcomeMessage: 'Hi there! Looking to automate your business with custom AI bots? I can walk you through our enterprise plans and capabilities.',
    placeholderText: 'Tell me about team size or required integrations...',
    systemInstruction: 'You are an upbeat sales engineer at Nisar AI Studio. Highlight enterprise benefits like custom SLAs, SOC2 compliance, dedicated models, and unlimited RAG documents.',
    personality: 'professional',
    language: 'English',
    responseLength: 'concise',
    temperature: 0.7,
    suggestedQuestions: [
      'What is included in the Enterprise Tier?',
      'Do you support custom domain deployment?',
      'Can we book an architecture demo?'
    ],
    theme: {
      ...defaultTheme,
      primaryColor: '#7c3aed',
      botBubbleColor: '#faf5ff'
    },
    aiProvider: 'gemini',
    aiModel: 'gemini-3.8-flash',
    maxTokens: 800,
    status: 'draft',
    isPublic: false,
    version: 1,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const initialKnowledgeSources: KnowledgeSource[] = [
  {
    id: 'ks_docs_01',
    chatbotId: 'bot_support_01',
    userId: 'usr_nisar_1',
    type: 'text',
    name: 'Nisar AI Studio - Product Overview & FAQ.md',
    content: `# Nisar AI Studio - Chatbot Maker AI
Chatbot Maker AI allows companies and creators to build production-ready AI chatbots powered by Google Gemini and custom Knowledge Bases.

## Core Features
1. Multi-channel deployment: Hosted full-page chatbot, iframe embed, JavaScript widget snippet, and REST API.
2. Knowledge Base RAG: Upload Markdown, Text, or crawl public web URLs. The system automatically chunks documents and matches relevant context.
3. Versioning & Rollback: Every change creates an immutable snapshot. Revert to any prior version instantly.
4. Security: Safe origin enforcement, SSRF protection against private IP scraping, role-based access control.
5. Pricing Tiers: Free (1,000 msgs/mo), Pro (20,000 msgs/mo), Enterprise (100,000+ msgs/mo with custom models).`,
    chunkCount: 3,
    status: 'indexed',
    fileSizeBytes: 1240,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'ks_docs_02',
    chatbotId: 'bot_docs_02',
    userId: 'usr_nisar_1',
    type: 'text',
    name: 'REST API & Widget Integration Guide.md',
    content: `# Chatbot Maker AI - API Integration Guide

## REST Chat Completion Endpoint
POST /api/chat
Authorization: Bearer <API_KEY_OR_TOKEN>
Content-Type: application/json

Request payload:
{
  "chatbotId": "bot_xxx",
  "message": "Hello, how do I configure my bot?",
  "conversationId": "conv_xxx"
}

## Website Widget Embed
Add the following script before </body>:
<script src="https://ais-dev.run.app/widget.js" data-bot-id="bot_xxx" async></script>`,
    chunkCount: 2,
    status: 'indexed',
    fileSizeBytes: 890,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

const initialChunks: KnowledgeChunk[] = [
  {
    id: 'chk_1',
    sourceId: 'ks_docs_01',
    chatbotId: 'bot_support_01',
    content: 'Chatbot Maker AI allows companies and creators to build production-ready AI chatbots powered by Google Gemini and custom Knowledge Bases. Core features include multi-channel deployment (hosted page, iframe embed, script widget, and REST API).'
  },
  {
    id: 'chk_2',
    sourceId: 'ks_docs_01',
    chatbotId: 'bot_support_01',
    content: 'Knowledge Base RAG: Upload Markdown, Text, or crawl public web URLs. The system automatically chunks documents and performs semantic retrieval. Versioning & Rollback allows reverting to prior configurations at any time.'
  },
  {
    id: 'chk_3',
    sourceId: 'ks_docs_01',
    chatbotId: 'bot_support_01',
    content: 'Security: Safe origin enforcement, SSRF protection against private IP scraping, and role-based access control. Pricing tiers: Free (1,000 msgs/mo), Pro (20,000 msgs/mo), Enterprise (100,000+ msgs/mo).'
  },
  {
    id: 'chk_4',
    sourceId: 'ks_docs_02',
    chatbotId: 'bot_docs_02',
    content: 'REST API Endpoint: POST /api/chat with JSON body { chatbotId, message, conversationId }. Embed widget using <script src="/widget.js" data-bot-id="..."></script>.'
  }
];

const initialAuditLogs: AuditLog[] = [
  {
    id: 'log_01',
    userId: 'usr_nisar_1',
    userEmail: 'nisarrsna@gmail.com',
    action: 'CHATBOT_PUBLISHED',
    targetResource: 'bot_support_01',
    details: 'Published SaaS Customer Support Pro to public directory',
    ipAddress: '127.0.0.1',
    timestamp: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    id: 'log_02',
    userId: 'usr_nisar_1',
    userEmail: 'nisarrsna@gmail.com',
    action: 'KNOWLEDGE_INDEXED',
    targetResource: 'ks_docs_01',
    details: 'Extracted and indexed 3 chunks for RAG search',
    ipAddress: '127.0.0.1',
    timestamp: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'log_03',
    userId: 'usr_admin_1',
    userEmail: 'admin@nisaraistudio.com',
    action: 'SYSTEM_SETTINGS_UPDATE',
    targetResource: 'ai_providers',
    details: 'Verified server-side Gemini 3.8 Flash model latency and security headers',
    ipAddress: '127.0.0.1',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

const initialUsageRecords: UsageRecord[] = [
  {
    id: 'usg_1',
    userId: 'usr_nisar_1',
    chatbotId: 'bot_support_01',
    model: 'gemini-3.8-flash',
    promptTokens: 340,
    completionTokens: 180,
    totalTokens: 520,
    estimatedCostUsd: 0.00039,
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString()
  },
  {
    id: 'usg_2',
    userId: 'usr_nisar_1',
    chatbotId: 'bot_support_01',
    model: 'gemini-3.8-flash',
    promptTokens: 410,
    completionTokens: 220,
    totalTokens: 630,
    estimatedCostUsd: 0.00047,
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: 'usg_3',
    userId: 'usr_demo_1',
    chatbotId: 'bot_sales_03',
    model: 'gemini-3.8-flash',
    promptTokens: 250,
    completionTokens: 95,
    totalTokens: 345,
    estimatedCostUsd: 0.00026,
    timestamp: new Date(Date.now() - 1 * 3600000).toISOString()
  }
];

class Database {
  private state: DatabaseState;

  constructor() {
    this.state = this.load();
  }

  public load(): DatabaseState {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.chatbots) {
          // Idempotent template seeding: merge missing templates
          const existingTemplates: ChatbotTemplate[] = parsed.templates || [];
          const existingIds = new Set(existingTemplates.map(t => t.id));
          let changed = false;

          for (const initTpl of INITIAL_TEMPLATES) {
            if (!existingIds.has(initTpl.id)) {
              existingTemplates.push(initTpl);
              changed = true;
            }
          }

          parsed.templates = existingTemplates;
          parsed.userFavorites = parsed.userFavorites || [];

          if (changed || !parsed.userFavorites) {
            this.persist(parsed);
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read existing database file, initializing seeds.', e);
    }

    const defaultState: DatabaseState = {
      users: initialUsers,
      chatbots: initialChatbots,
      chatbotVersions: [
        {
          id: 'ver_1',
          chatbotId: 'bot_support_01',
          userId: 'usr_nisar_1',
          versionNumber: 1,
          snapshot: { ...initialChatbots[0], version: 1, name: 'SaaS Customer Support Initial' },
          changeSummary: 'Initial setup with welcome message',
          createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
        },
        {
          id: 'ver_2',
          chatbotId: 'bot_support_01',
          userId: 'usr_nisar_1',
          versionNumber: 2,
          snapshot: { ...initialChatbots[0], version: 2, temperature: 0.5 },
          changeSummary: 'Updated temperature and knowledge prompt',
          createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
        }
      ],
      knowledgeSources: initialKnowledgeSources,
      knowledgeChunks: initialChunks,
      conversations: [
        {
          id: 'conv_demo_1',
          chatbotId: 'bot_support_01',
          userId: 'usr_nisar_1',
          visitorSessionId: 'sess_demo_1',
          title: 'How do I embed chatbot?',
          isPublic: true,
          messageCount: 2,
          totalTokens: 640,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString()
        }
      ],
      messages: [
        {
          id: 'msg_1',
          conversationId: 'conv_demo_1',
          chatbotId: 'bot_support_01',
          role: 'user',
          content: 'How do I embed my chatbot on an external website?',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'msg_2',
          conversationId: 'conv_demo_1',
          chatbotId: 'bot_support_01',
          role: 'assistant',
          content: 'You can embed your chatbot using our lightweight JavaScript widget or an iframe code snippet. Simply navigate to the **Deployment** tab in the chatbot editor, copy the one-line `<script>` tag or `<iframe>`, and paste it into your website HTML before the `</body>` tag!',
          citations: [
            {
              sourceId: 'ks_docs_01',
              sourceName: 'Nisar AI Studio - Product Overview & FAQ.md',
              snippet: 'Multi-channel deployment: Hosted full-page chatbot, iframe embed, JavaScript widget snippet, and REST API.'
            }
          ],
          tokens: 185,
          latencyMs: 420,
          feedback: 'like',
          createdAt: new Date(Date.now() - 3590000).toISOString()
        }
      ],
      usageRecords: initialUsageRecords,
      auditLogs: initialAuditLogs,
      abuseReports: [],
      templates: [...INITIAL_TEMPLATES],
      userFavorites: []
    };

    this.persist(defaultState);
    return defaultState;
  }

  public persist(state: DatabaseState = this.state) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist database state:', e);
    }
  }

  // Users
  public getUsers(): User[] {
    return this.state.users;
  }

  public getUserById(id: string): User | undefined {
    return this.state.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: User): User {
    this.state.users.push(user);
    this.persist();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.state.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;
    this.state.users[idx] = { ...this.state.users[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persist();
    return this.state.users[idx];
  }

  // Chatbots
  public getChatbots(userId?: string): Chatbot[] {
    if (!userId) return this.state.chatbots;
    return this.state.chatbots.filter(b => b.userId === userId);
  }

  public getChatbotById(id: string): Chatbot | undefined {
    return this.state.chatbots.find(b => b.id === id);
  }

  public createChatbot(bot: Chatbot): Chatbot {
    this.state.chatbots.push(bot);
    // Create initial version snapshot
    this.createVersion({
      id: `ver_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      chatbotId: bot.id,
      userId: bot.userId,
      versionNumber: bot.version || 1,
      snapshot: { ...bot },
      changeSummary: 'Initial bot creation',
      createdAt: new Date().toISOString()
    });
    this.persist();
    return bot;
  }

  public updateChatbot(id: string, updates: Partial<Chatbot>, changeSummary = 'Updated settings'): Chatbot | undefined {
    const idx = this.state.chatbots.findIndex(b => b.id === id);
    if (idx === -1) return undefined;
    const old = this.state.chatbots[idx];
    const newVersion = (old.version || 1) + 1;
    const updated: Chatbot = {
      ...old,
      ...updates,
      version: newVersion,
      updatedAt: new Date().toISOString()
    };
    this.state.chatbots[idx] = updated;

    // Save version snapshot
    this.createVersion({
      id: `ver_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      chatbotId: id,
      userId: updated.userId,
      versionNumber: newVersion,
      snapshot: { ...updated },
      changeSummary,
      createdAt: new Date().toISOString()
    });

    this.persist();
    return updated;
  }

  public deleteChatbot(id: string): boolean {
    const prevLen = this.state.chatbots.length;
    this.state.chatbots = this.state.chatbots.filter(b => b.id !== id);
    this.state.knowledgeSources = this.state.knowledgeSources.filter(k => k.chatbotId !== id);
    this.state.knowledgeChunks = this.state.knowledgeChunks.filter(c => c.chatbotId !== id);
    this.state.chatbotVersions = this.state.chatbotVersions.filter(v => v.chatbotId !== id);
    this.persist();
    return this.state.chatbots.length < prevLen;
  }

  // Versions
  public getVersions(chatbotId: string): ChatbotVersion[] {
    return this.state.chatbotVersions
      .filter(v => v.chatbotId === chatbotId)
      .sort((a, b) => b.versionNumber - a.versionNumber);
  }

  public createVersion(version: ChatbotVersion): ChatbotVersion {
    this.state.chatbotVersions.push(version);
    this.persist();
    return version;
  }

  public rollbackToVersion(chatbotId: string, versionNumber: number): Chatbot | undefined {
    const version = this.state.chatbotVersions.find(
      v => v.chatbotId === chatbotId && v.versionNumber === versionNumber
    );
    if (!version) return undefined;

    const idx = this.state.chatbots.findIndex(b => b.id === chatbotId);
    if (idx === -1) return undefined;

    const rolledBack: Chatbot = {
      ...version.snapshot,
      version: this.state.chatbots[idx].version + 1,
      updatedAt: new Date().toISOString()
    };
    this.state.chatbots[idx] = rolledBack;

    this.createVersion({
      id: `ver_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      chatbotId,
      userId: rolledBack.userId,
      versionNumber: rolledBack.version,
      snapshot: { ...rolledBack },
      changeSummary: `Rolled back to version ${versionNumber}`,
      createdAt: new Date().toISOString()
    });

    this.persist();
    return rolledBack;
  }

  // Knowledge Sources & Chunks
  public getKnowledgeSources(chatbotId: string): KnowledgeSource[] {
    return this.state.knowledgeSources.filter(k => k.chatbotId === chatbotId);
  }

  public getKnowledgeSourceById(id: string): KnowledgeSource | undefined {
    return this.state.knowledgeSources.find(k => k.id === id);
  }

  public addKnowledgeSource(source: KnowledgeSource, chunks: KnowledgeChunk[]): KnowledgeSource {
    this.state.knowledgeSources.push(source);
    this.state.knowledgeChunks.push(...chunks);
    this.persist();
    return source;
  }

  public removeKnowledgeSource(sourceId: string): boolean {
    const prev = this.state.knowledgeSources.length;
    this.state.knowledgeSources = this.state.knowledgeSources.filter(k => k.id !== sourceId);
    this.state.knowledgeChunks = this.state.knowledgeChunks.filter(c => c.sourceId !== sourceId);
    this.persist();
    return this.state.knowledgeSources.length < prev;
  }

  public getKnowledgeChunks(chatbotId: string): KnowledgeChunk[] {
    return this.state.knowledgeChunks.filter(c => c.chatbotId === chatbotId);
  }

  // Conversations & Messages
  public getConversations(chatbotId?: string): Conversation[] {
    if (!chatbotId) return this.state.conversations;
    return this.state.conversations.filter(c => c.chatbotId === chatbotId);
  }

  public getConversationById(id: string): Conversation | undefined {
    return this.state.conversations.find(c => c.id === id);
  }

  public createConversation(conv: Conversation): Conversation {
    this.state.conversations.push(conv);
    this.persist();
    return conv;
  }

  public deleteConversation(id: string): boolean {
    this.state.conversations = this.state.conversations.filter(c => c.id !== id);
    this.state.messages = this.state.messages.filter(m => m.conversationId !== id);
    this.persist();
    return true;
  }

  public getMessages(conversationId: string): Message[] {
    return this.state.messages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  public addMessage(message: Message): Message {
    this.state.messages.push(message);
    const conv = this.state.conversations.find(c => c.id === message.conversationId);
    if (conv) {
      conv.messageCount = (conv.messageCount || 0) + 1;
      conv.totalTokens = (conv.totalTokens || 0) + (message.tokens || 0);
      conv.updatedAt = new Date().toISOString();
    }
    this.persist();
    return message;
  }

  public updateMessageFeedback(messageId: string, feedback: 'like' | 'dislike' | 'none'): boolean {
    const msg = this.state.messages.find(m => m.id === messageId);
    if (!msg) return false;
    msg.feedback = feedback;
    this.persist();
    return true;
  }

  // Usage & Telemetry
  public recordUsage(record: UsageRecord) {
    this.state.usageRecords.push(record);
    const user = this.state.users.find(u => u.id === record.userId);
    if (user) {
      user.usedThisMonth = (user.usedThisMonth || 0) + record.totalTokens;
    }
    this.persist();
  }

  public getUsageRecords(userId?: string): UsageRecord[] {
    if (!userId) return this.state.usageRecords;
    return this.state.usageRecords.filter(r => r.userId === userId);
  }

  // Audit Logs
  public logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    const fullLog: AuditLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    this.state.auditLogs.unshift(fullLog);
    if (this.state.auditLogs.length > 500) {
      this.state.auditLogs.pop();
    }
    this.persist();
  }

  public getAuditLogs(): AuditLog[] {
    return this.state.auditLogs;
  }

  // Abuse Reports
  public addAbuseReport(report: AbuseReport) {
    this.state.abuseReports.push(report);
    this.persist();
  }

  public getAbuseReports(): AbuseReport[] {
    return this.state.abuseReports;
  }

  public updateAbuseReportStatus(id: string, status: AbuseReport['status']): boolean {
    const rep = this.state.abuseReports.find(r => r.id === id);
    if (!rep) return false;
    rep.status = status;
    this.persist();
    return true;
  }

  // Templates Management
  public getTemplates(filter?: { category?: string; search?: string; featured?: boolean; activeOnly?: boolean }): ChatbotTemplate[] {
    let list = this.state.templates || [];
    if (filter?.activeOnly !== false) {
      list = list.filter(t => t.isActive);
    }
    if (filter?.category && filter.category !== 'all') {
      list = list.filter(t => t.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.featured) {
      list = list.filter(t => t.isFeatured);
    }
    if (filter?.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getTemplateById(id: string): ChatbotTemplate | undefined {
    return (this.state.templates || []).find(t => t.id === id);
  }

  public getTemplateBySlug(slug: string): ChatbotTemplate | undefined {
    return (this.state.templates || []).find(t => t.slug === slug);
  }

  public createTemplate(template: ChatbotTemplate): ChatbotTemplate {
    if (!this.state.templates) this.state.templates = [];
    this.state.templates.push(template);
    this.persist();
    return template;
  }

  public updateTemplate(id: string, updates: Partial<ChatbotTemplate>): ChatbotTemplate | undefined {
    if (!this.state.templates) return undefined;
    const idx = this.state.templates.findIndex(t => t.id === id);
    if (idx === -1) return undefined;
    const existing = this.state.templates[idx];
    const newVersion = (existing.version || 1) + 1;
    this.state.templates[idx] = {
      ...existing,
      ...updates,
      version: newVersion,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.state.templates[idx];
  }

  public deleteTemplate(id: string): boolean {
    if (!this.state.templates) return false;
    const prevLen = this.state.templates.length;
    this.state.templates = this.state.templates.filter(t => t.id !== id);
    this.persist();
    return this.state.templates.length < prevLen;
  }

  // Favorites
  public getUserFavorites(userId: string): string[] {
    const list = this.state.userFavorites || [];
    return list.filter(f => f.userId === userId).map(f => f.templateId);
  }

  public addFavorite(userId: string, templateId: string): void {
    if (!this.state.userFavorites) this.state.userFavorites = [];
    const exists = this.state.userFavorites.some(f => f.userId === userId && f.templateId === templateId);
    if (!exists) {
      this.state.userFavorites.push({
        userId,
        templateId,
        createdAt: new Date().toISOString()
      });
      this.persist();
    }
  }

  public removeFavorite(userId: string, templateId: string): void {
    if (!this.state.userFavorites) return;
    this.state.userFavorites = this.state.userFavorites.filter(
      f => !(f.userId === userId && f.templateId === templateId)
    );
    this.persist();
  }

  // Clone Template to a New Chatbot (Deep Copy)
  public cloneTemplateToChatbot(templateId: string, userId: string, customName?: string): Chatbot {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const botId = `bot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const clonedTheme: ChatbotTheme = { ...template.configuration.theme };

    const newBot: Chatbot = {
      id: botId,
      userId,
      name: customName || template.name,
      description: template.description,
      avatarUrl: template.configuration.avatarUrl,
      welcomeMessage: template.welcomeMessage,
      placeholderText: template.configuration.placeholderText,
      systemInstruction: template.systemPrompt,
      personality: template.configuration.personality,
      language: template.defaultLanguage,
      responseLength: template.responseStyle,
      temperature: template.configuration.temperature,
      suggestedQuestions: [...template.suggestedQuestions],
      theme: clonedTheme,
      aiProvider: 'gemini',
      aiModel: template.configuration.aiModel,
      maxTokens: template.configuration.maxTokens,
      status: 'draft',
      isPublic: false,
      version: 1,
      templateId: template.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return this.createChatbot(newBot);
  }

  // Reset Chatbot to Template Defaults
  public resetChatbotToTemplate(chatbotId: string, userId: string): Chatbot | undefined {
    const bot = this.getChatbotById(chatbotId);
    if (!bot) return undefined;
    if (bot.userId !== userId) {
      throw new Error('Unauthorized to reset this chatbot');
    }
    if (!bot.templateId) {
      throw new Error('This chatbot was not created from a template');
    }

    const template = this.getTemplateById(bot.templateId);
    if (!template) {
      throw new Error('Original template not found');
    }

    const resetUpdates: Partial<Chatbot> = {
      name: template.name,
      description: template.description,
      welcomeMessage: template.welcomeMessage,
      placeholderText: template.configuration.placeholderText,
      systemInstruction: template.systemPrompt,
      personality: template.configuration.personality,
      language: template.defaultLanguage,
      responseLength: template.responseStyle,
      temperature: template.configuration.temperature,
      suggestedQuestions: [...template.suggestedQuestions],
      theme: { ...template.configuration.theme },
      aiModel: template.configuration.aiModel,
      maxTokens: template.configuration.maxTokens,
      avatarUrl: template.configuration.avatarUrl
    };

    return this.updateChatbot(chatbotId, resetUpdates, `Reset to defaults of template: ${template.name}`);
  }
}

export const db = new Database();
