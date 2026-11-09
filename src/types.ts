export interface User {
  id: string;
  email: string;
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

export interface TemplateConfiguration {
  personality: 'friendly' | 'professional' | 'technical' | 'concise' | 'creative';
  temperature: number;
  maxTokens: number;
  aiModel: string;
  theme: ChatbotTheme;
  avatarUrl: string;
  placeholderText: string;
}

export interface ChatbotTemplate {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  tags: string[];
  systemPrompt: string;
  welcomeMessage: string;
  suggestedQuestions: string[];
  defaultLanguage: string;
  responseStyle: 'concise' | 'balanced' | 'detailed';
  recommendedFeatures: string[];
  configuration: TemplateConfiguration;
  version: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isFeatured?: boolean;
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

export interface AnalyticsData {
  metrics: {
    totalBots: number;
    activeBots: number;
    draftBots: number;
    archivedBots: number;
    totalConversations: number;
    totalMessages: number;
    totalTokens: number;
    estimatedCostUsd: number;
    monthlyQuota: number;
    usedThisMonth: number;
  };
  dailyVolume: { date: string; messages: number; tokens: number }[];
  topChatbots: {
    id: string;
    name: string;
    status: string;
    conversations: number;
    messages: number;
    tokens: number;
    costUsd: number;
  }[];
}
