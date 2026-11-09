import {
  Chatbot,
  ChatbotTemplate,
  ChatbotVersion,
  KnowledgeSource,
  Conversation,
  Message,
  User,
  AnalyticsData,
  AuditLog,
  AbuseReport
} from '../types';

const TOKEN_KEY = 'chatbot_maker_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
  }

  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setStoredToken(res.token);
    return res;
  },

  async register(email: string, password: string, displayName?: string): Promise<{ user: User; token: string }> {
    const res = await request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName })
    });
    setStoredToken(res.token);
    return res;
  },

  async getCurrentUser(): Promise<{ user: User; token?: string; isDefaultDemo?: boolean }> {
    const res = await request<{ user: User; token?: string; isDefaultDemo?: boolean }>('/api/auth/me');
    if (res.token && !getStoredToken()) {
      setStoredToken(res.token);
    }
    return res;
  },

  async updateProfile(updates: { displayName?: string; photoURL?: string }): Promise<{ user: User }> {
    return request<{ user: User }>('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  async logout(): Promise<void> {
    await request('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setStoredToken(null);
  },

  // Chatbots
  async getChatbots(): Promise<Chatbot[]> {
    const res = await request<{ chatbots: Chatbot[] }>('/api/chatbots');
    return res.chatbots;
  },

  async getChatbot(id: string): Promise<Chatbot> {
    const res = await request<{ chatbot: Chatbot }>(`/api/chatbots/${id}`);
    return res.chatbot;
  },

  async getPublicChatbot(id: string): Promise<Chatbot> {
    const res = await request<{ chatbot: Chatbot }>(`/api/chatbots/public/${id}`);
    return res.chatbot;
  },

  async createChatbot(bot: Partial<Chatbot>): Promise<Chatbot> {
    const res = await request<{ chatbot: Chatbot }>('/api/chatbots', {
      method: 'POST',
      body: JSON.stringify(bot)
    });
    return res.chatbot;
  },

  async updateChatbot(id: string, updates: Partial<Chatbot>, changeSummary?: string): Promise<Chatbot> {
    const res = await request<{ chatbot: Chatbot }>(`/api/chatbots/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...updates, changeSummary })
    });
    return res.chatbot;
  },

  async deleteChatbot(id: string): Promise<void> {
    await request(`/api/chatbots/${id}`, { method: 'DELETE' });
  },

  async duplicateChatbot(id: string): Promise<Chatbot> {
    const res = await request<{ chatbot: Chatbot }>(`/api/chatbots/${id}/duplicate`, { method: 'POST' });
    return res.chatbot;
  },

  async publishChatbot(id: string, isPublic: boolean, status: string): Promise<Chatbot> {
    const res = await request<{ chatbot: Chatbot }>(`/api/chatbots/${id}/publish`, {
      method: 'POST',
      body: JSON.stringify({ isPublic, status })
    });
    return res.chatbot;
  },

  async getVersions(chatbotId: string): Promise<ChatbotVersion[]> {
    const res = await request<{ versions: ChatbotVersion[] }>(`/api/chatbots/${chatbotId}/versions`);
    return res.versions;
  },

  async rollbackVersion(chatbotId: string, versionNumber: number): Promise<Chatbot> {
    const res = await request<{ chatbot: Chatbot; message: string }>(`/api/chatbots/${chatbotId}/rollback`, {
      method: 'POST',
      body: JSON.stringify({ versionNumber })
    });
    return res.chatbot;
  },

  // Templates
  async getTemplates(params?: { q?: string; category?: string; featured?: boolean; activeOnly?: boolean }): Promise<{ templates: ChatbotTemplate[]; total: number; favorites: string[] }> {
    const query = new URLSearchParams();
    if (params?.q) query.set('q', params.q);
    if (params?.category) query.set('category', params.category);
    if (params?.featured) query.set('featured', 'true');
    if (params?.activeOnly !== undefined) query.set('activeOnly', String(params.activeOnly));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{ templates: ChatbotTemplate[]; total: number; favorites: string[] }>(`/api/templates${qs}`);
  },

  async getTemplate(id: string): Promise<ChatbotTemplate> {
    const res = await request<{ template: ChatbotTemplate }>(`/api/templates/${id}`);
    return res.template;
  },

  async cloneTemplate(templateId: string, customName?: string): Promise<{ chatbot: Chatbot; message: string }> {
    return request<{ chatbot: Chatbot; message: string }>(`/api/templates/${templateId}/clone`, {
      method: 'POST',
      body: JSON.stringify({ customName })
    });
  },

  async resetToTemplate(chatbotId: string): Promise<{ chatbot: Chatbot; message: string }> {
    return request<{ chatbot: Chatbot; message: string }>(`/api/templates/chatbots/${chatbotId}/reset-to-template`, {
      method: 'POST'
    });
  },

  async getFavoriteTemplateIds(): Promise<string[]> {
    const res = await request<{ favorites: string[] }>('/api/templates/user/favorites');
    return res.favorites;
  },

  async addFavoriteTemplate(templateId: string): Promise<void> {
    await request(`/api/templates/${templateId}/favorite`, { method: 'POST' });
  },

  async removeFavoriteTemplate(templateId: string): Promise<void> {
    await request(`/api/templates/${templateId}/favorite`, { method: 'DELETE' });
  },

  // Admin Templates
  async adminCreateTemplate(template: Partial<ChatbotTemplate>): Promise<ChatbotTemplate> {
    const res = await request<{ template: ChatbotTemplate }>('/api/templates/admin/templates', {
      method: 'POST',
      body: JSON.stringify(template)
    });
    return res.template;
  },

  async adminUpdateTemplate(id: string, updates: Partial<ChatbotTemplate>): Promise<ChatbotTemplate> {
    const res = await request<{ template: ChatbotTemplate }>(`/api/templates/admin/templates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    return res.template;
  },

  async adminDeleteTemplate(id: string): Promise<void> {
    await request(`/api/templates/admin/templates/${id}`, { method: 'DELETE' });
  },

  // Knowledge
  async getKnowledgeSources(chatbotId: string): Promise<{ sources: KnowledgeSource[]; totalChunks: number }> {
    return request<{ sources: KnowledgeSource[]; totalChunks: number }>(`/api/chatbots/${chatbotId}/knowledge`);
  },

  async addKnowledgeSource(chatbotId: string, data: { type: string; name: string; content: string; sourceUrl?: string; fileSizeBytes?: number }): Promise<KnowledgeSource> {
    const res = await request<{ source: KnowledgeSource; chunksAdded: number }>(`/api/chatbots/${chatbotId}/knowledge`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.source;
  },

  async deleteKnowledgeSource(chatbotId: string, sourceId: string): Promise<void> {
    await request(`/api/chatbots/${chatbotId}/knowledge/${sourceId}`, { method: 'DELETE' });
  },

  async fetchWebpage(url: string): Promise<{ url: string; content: string; sampleText: string }> {
    return request<{ url: string; content: string; sampleText: string }>('/api/knowledge/fetch-url', {
      method: 'POST',
      body: JSON.stringify({ url })
    });
  },

  async reindexKnowledge(chatbotId: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/chatbots/${chatbotId}/knowledge/reindex`, {
      method: 'POST'
    });
  },

  // Chat
  async sendChatMessage(payload: {
    chatbotId: string;
    message: string;
    conversationId?: string;
    history?: { role: string; content: string }[];
  }): Promise<{
    message: Message;
    conversationId: string;
    model: string;
    latencyMs: number;
    tokens: number;
    isMockFallback?: boolean;
  }> {
    return request('/api/chat', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async sendPublicChatMessage(chatbotId: string, payload: {
    message: string;
    conversationId?: string;
    visitorSessionId?: string;
  }): Promise<{ message: Message; conversationId: string; latencyMs: number }> {
    return request(`/api/chat/public/${chatbotId}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getConversations(chatbotId: string): Promise<Conversation[]> {
    const res = await request<{ conversations: Conversation[] }>(`/api/chat/${chatbotId}/conversations`);
    return res.conversations;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const res = await request<{ messages: Message[] }>(`/api/chat/conversations/${conversationId}/messages`);
    return res.messages;
  },

  async clearConversation(conversationId: string): Promise<void> {
    await request(`/api/chat/conversations/${conversationId}`, { method: 'DELETE' });
  },

  async submitMessageFeedback(messageId: string, feedback: 'like' | 'dislike' | 'none'): Promise<void> {
    await request(`/api/chat/messages/${messageId}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ feedback })
    });
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    return request<AnalyticsData>('/api/analytics');
  },

  // Admin
  async getAdminUsers(): Promise<User[]> {
    const res = await request<{ users: User[] }>('/api/admin/users');
    return res.users;
  },

  async updateAdminUserRole(userId: string, role: 'admin' | 'user'): Promise<User> {
    const res = await request<{ user: User }>(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    });
    return res.user;
  },

  async updateAdminUserStatus(userId: string, status: 'active' | 'suspended'): Promise<User> {
    const res = await request<{ user: User }>(`/api/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    return res.user;
  },

  async getAdminAuditLogs(): Promise<AuditLog[]> {
    const res = await request<{ logs: AuditLog[] }>('/api/admin/audit-logs');
    return res.logs;
  },

  async getAdminAbuseReports(): Promise<AbuseReport[]> {
    const res = await request<{ reports: AbuseReport[] }>('/api/admin/abuse-reports');
    return res.reports;
  },

  async submitAbuseReport(chatbotId: string, reason: string, details?: string): Promise<void> {
    await request('/api/admin/abuse-reports', {
      method: 'POST',
      body: JSON.stringify({ chatbotId, reason, details })
    });
  },

  async updateAbuseReportStatus(id: string, status: AbuseReport['status']): Promise<void> {
    await request(`/api/admin/abuse-reports/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  async getSystemHealth(): Promise<any> {
    return request('/api/admin/system-health');
  }
};
