import React, { useState, useEffect } from 'react';
import { User, AuditLog, AbuseReport, ChatbotTemplate } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Users,
  AlertTriangle,
  Activity,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Cpu,
  RefreshCw,
  LayoutTemplate,
  Edit3,
  Plus,
  Star,
  X,
  Save,
  Search
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'templates' | 'abuse' | 'audit' | 'health'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [templates, setTemplates] = useState<ChatbotTemplate[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [abuseReports, setAbuseReports] = useState<AbuseReport[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Template admin state
  const [tplSearch, setTplSearch] = useState('');
  const [tplCategory, setTplCategory] = useState('All');
  const [editingTemplate, setEditingTemplate] = useState<ChatbotTemplate | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTplForm, setNewTplForm] = useState({
    name: '',
    category: 'Business and Customer Support',
    description: '',
    systemPrompt: '',
    welcomeMessage: '',
    tags: 'support, business',
    isFeatured: false
  });

  useEffect(() => {
    loadAdminData();
  }, [activeTab]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const u = await api.getAdminUsers();
        setUsers(u);
      } else if (activeTab === 'templates') {
        const t = await api.getTemplates({ activeOnly: false });
        setTemplates(t.templates);
      } else if (activeTab === 'audit') {
        const a = await api.getAdminAuditLogs();
        setAuditLogs(a);
      } else if (activeTab === 'abuse') {
        const r = await api.getAdminAbuseReports();
        setAbuseReports(r);
      } else if (activeTab === 'health') {
        const h = await api.getSystemHealth();
        setSystemHealth(h);
      }
    } catch (e: any) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Template Handlers
  const handleToggleTemplateActive = async (tpl: ChatbotTemplate) => {
    try {
      const updated = await api.adminUpdateTemplate(tpl.id, { isActive: !tpl.isActive });
      setTemplates(prev => prev.map(t => (t.id === tpl.id ? updated : t)));
      showNotice(`Template "${tpl.name}" is now ${updated.isActive ? 'Active' : 'Deactivated'}`);
    } catch (e: any) {
      alert(`Error updating template status: ${e.message}`);
    }
  };

  const handleToggleTemplateFeatured = async (tpl: ChatbotTemplate) => {
    try {
      const updated = await api.adminUpdateTemplate(tpl.id, { isFeatured: !tpl.isFeatured });
      setTemplates(prev => prev.map(t => (t.id === tpl.id ? updated : t)));
      showNotice(`Template "${tpl.name}" ${updated.isFeatured ? 'marked as Featured' : 'unmarked from Featured'}`);
    } catch (e: any) {
      alert(`Error updating featured status: ${e.message}`);
    }
  };

  const handleSaveEditTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    try {
      const updated = await api.adminUpdateTemplate(editingTemplate.id, {
        name: editingTemplate.name,
        category: editingTemplate.category,
        description: editingTemplate.description,
        systemPrompt: editingTemplate.systemPrompt,
        welcomeMessage: editingTemplate.welcomeMessage,
        tags: editingTemplate.tags
      });
      setTemplates(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      setEditingTemplate(null);
      showNotice(`Template "${updated.name}" updated (v${updated.version})`);
    } catch (e: any) {
      alert(`Error saving template: ${e.message}`);
    }
  };

  const handleCreateNewTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTplForm.name.trim() || !newTplForm.systemPrompt.trim()) {
      alert('Template Name and System Instructions are required.');
      return;
    }
    try {
      const created = await api.adminCreateTemplate({
        name: newTplForm.name.trim(),
        category: newTplForm.category,
        description: newTplForm.description.trim(),
        systemPrompt: newTplForm.systemPrompt.trim(),
        welcomeMessage: newTplForm.welcomeMessage.trim() || 'Hello! How can I help you?',
        tags: newTplForm.tags.split(',').map(s => s.trim()).filter(Boolean),
        isFeatured: newTplForm.isFeatured
      });
      setTemplates(prev => [created, ...prev]);
      setIsCreatingNew(false);
      setNewTplForm({
        name: '',
        category: 'Business and Customer Support',
        description: '',
        systemPrompt: '',
        welcomeMessage: '',
        tags: 'support, custom',
        isFeatured: false
      });
      showNotice(`New template "${created.name}" created successfully!`);
    } catch (e: any) {
      alert(`Error creating template: ${e.message}`);
    }
  };

  const handleRoleToggle = async (targetUser: User) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      const updated = await api.updateAdminUserRole(targetUser.id, newRole);
      setUsers(prev => prev.map(u => (u.id === targetUser.id ? updated : u)));
      showNotice(`Updated role of ${updated.email} to ${newRole}`);
    } catch (e: any) {
      alert(`Role update error: ${e.message}`);
    }
  };

  const handleStatusToggle = async (targetUser: User) => {
    const newStatus = targetUser.status === 'active' ? 'suspended' : 'active';
    try {
      const updated = await api.updateAdminUserStatus(targetUser.id, newStatus);
      setUsers(prev => prev.map(u => (u.id === targetUser.id ? updated : u)));
      showNotice(`User ${updated.email} is now ${newStatus}`);
    } catch (e: any) {
      alert(`Status update error: ${e.message}`);
    }
  };

  const handleReportStatus = async (reportId: string, status: AbuseReport['status']) => {
    try {
      await api.updateAbuseReportStatus(reportId, status);
      setAbuseReports(prev => prev.map(r => (r.id === reportId ? { ...r, status } : r)));
      showNotice(`Report status set to ${status}`);
    } catch (e: any) {
      alert(`Report update error: ${e.message}`);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="py-20 text-center space-y-3">
        <Shield className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Access Denied</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Administrator privileges are required to view the management dashboard. You can switch to an admin account in the top-right profile dropdown.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Administration Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
              Admin Verified
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Server-side user management, role moderation, audit trails, and system diagnostics.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-medium w-full sm:w-max">
        {[
          { id: 'users', label: 'User & Role Management', icon: Users },
          { id: 'templates', label: 'Template Management', icon: LayoutTemplate },
          { id: 'abuse', label: 'Abuse Reports', icon: AlertTriangle },
          { id: 'audit', label: 'Audit Trail', icon: FileText },
          { id: 'health', label: 'System Health', icon: Activity }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-3.5 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
        
        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Registered Accounts ({users.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                    <th className="pb-3 font-semibold">User</th>
                    <th className="pb-3 font-semibold">Email</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Plan</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">
                        {u.displayName}
                      </td>
                      <td className="py-3 font-mono text-slate-600 dark:text-slate-300">
                        {u.email}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 capitalize text-slate-600 dark:text-slate-300">
                        {u.tier}
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <button
                          onClick={() => handleRoleToggle(u)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                        >
                          Toggle {u.role === 'admin' ? 'to User' : 'to Admin'}
                        </button>
                        <button
                          onClick={() => handleStatusToggle(u)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                            u.status === 'active'
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <span>Chatbot Templates ({templates.length})</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    ({templates.filter(t => t.isActive).length} active, {templates.filter(t => t.isFeatured).length} featured)
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage the 50 standard templates, toggle visibility, customize prompts, or create new global blueprints.
                </p>
              </div>

              <button
                onClick={() => setIsCreatingNew(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm shadow-blue-500/20 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Global Template</span>
              </button>
            </div>

            {/* Search and Category Filters */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search templates by name, tags, or description..."
                  value={tplSearch}
                  onChange={(e) => setTplSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={tplCategory}
                onChange={(e) => setTplCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Categories ({templates.length})</option>
                {[
                  'Business and Customer Support',
                  'E-commerce',
                  'Marketing and Sales',
                  'Education',
                  'AI and Technology',
                  'Content Creation',
                  'Professional Services',
                  'Productivity',
                  'Community and Communication',
                  'Specialized Assistants'
                ].map(cat => (
                  <option key={cat} value={cat}>
                    {cat} ({templates.filter(t => t.category === cat).length})
                  </option>
                ))}
              </select>
            </div>

            {/* Templates Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                    <th className="pb-3 font-semibold">Template</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold text-center">Version</th>
                    <th className="pb-3 font-semibold text-center">Featured</th>
                    <th className="pb-3 font-semibold text-center">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {templates
                    .filter(t => {
                      if (tplCategory !== 'All' && t.category !== tplCategory) return false;
                      if (!tplSearch.trim()) return true;
                      const q = tplSearch.toLowerCase();
                      return (
                        t.name.toLowerCase().includes(q) ||
                        t.description.toLowerCase().includes(q) ||
                        t.slug.toLowerCase().includes(q) ||
                        t.tags.some(tg => tg.toLowerCase().includes(q))
                      );
                    })
                    .map(tpl => (
                      <tr key={tpl.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 pr-3">
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center space-x-1.5">
                            <span>{tpl.name}</span>
                            {tpl.isFeatured && (
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            {tpl.slug} • {tpl.tags.slice(0, 3).join(', ')}
                          </div>
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-300">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-700">
                            {tpl.category}
                          </span>
                        </td>
                        <td className="py-3 text-center font-mono text-slate-500 dark:text-slate-400">
                          v{tpl.version}
                        </td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => handleToggleTemplateFeatured(tpl)}
                            title={tpl.isFeatured ? 'Unset featured' : 'Mark featured'}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              tpl.isFeatured
                                ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/40 dark:border-amber-800'
                                : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${tpl.isFeatured ? 'fill-amber-500' : ''}`} />
                          </button>
                        </td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => handleToggleTemplateActive(tpl)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors cursor-pointer ${
                              tpl.isActive
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-400'
                            }`}
                          >
                            {tpl.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setEditingTemplate({ ...tpl })}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center space-x-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Template Edit Modal */}
            {editingTemplate && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 mb-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        Edit Template: {editingTemplate.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">
                        Slug: {editingTemplate.slug} • Version: {editingTemplate.version}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingTemplate(null)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveEditTemplate} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Template Name
                      </label>
                      <input
                        type="text"
                        value={editingTemplate.name}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Category
                      </label>
                      <select
                        value={editingTemplate.category}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[
                          'Business and Customer Support',
                          'E-commerce',
                          'Marketing and Sales',
                          'Education',
                          'AI and Technology',
                          'Content Creation',
                          'Professional Services',
                          'Productivity',
                          'Community and Communication',
                          'Specialized Assistants'
                        ].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={editingTemplate.description}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        System Instructions / Prompt
                      </label>
                      <textarea
                        value={editingTemplate.systemPrompt}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, systemPrompt: e.target.value })}
                        rows={5}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Welcome Message
                      </label>
                      <input
                        type="text"
                        value={editingTemplate.welcomeMessage}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, welcomeMessage: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={editingTemplate.tags.join(', ')}
                        onChange={(e) => setEditingTemplate({
                          ...editingTemplate,
                          tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => setEditingTemplate(null)}
                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center space-x-1.5 cursor-pointer shadow-sm shadow-blue-500/20"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Create New Global Template Modal */}
            {isCreatingNew && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 mb-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        Create New Global Template
                      </h4>
                      <p className="text-xs text-slate-400">
                        Add a new verified template to the global template catalog for all users.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsCreatingNew(false)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateNewTemplate} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Template Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. VIP Concierge Assistant"
                        value={newTplForm.name}
                        onChange={(e) => setNewTplForm({ ...newTplForm, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Category *
                      </label>
                      <select
                        value={newTplForm.category}
                        onChange={(e) => setNewTplForm({ ...newTplForm, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[
                          'Business and Customer Support',
                          'E-commerce',
                          'Marketing and Sales',
                          'Education',
                          'AI and Technology',
                          'Content Creation',
                          'Professional Services',
                          'Productivity',
                          'Community and Communication',
                          'Specialized Assistants'
                        ].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Description
                      </label>
                      <textarea
                        placeholder="Brief summary of what this bot achieves..."
                        value={newTplForm.description}
                        onChange={(e) => setNewTplForm({ ...newTplForm, description: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        System Instructions / Prompt *
                      </label>
                      <textarea
                        placeholder="Define role, boundaries, tone, formatting..."
                        value={newTplForm.systemPrompt}
                        onChange={(e) => setNewTplForm({ ...newTplForm, systemPrompt: e.target.value })}
                        rows={5}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Welcome Message
                      </label>
                      <input
                        type="text"
                        placeholder="Default greeting..."
                        value={newTplForm.welcomeMessage}
                        onChange={(e) => setNewTplForm({ ...newTplForm, welcomeMessage: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. concierge, vip, premium"
                        value={newTplForm.tags}
                        onChange={(e) => setNewTplForm({ ...newTplForm, tags: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="checkbox"
                        id="newTplFeatured"
                        checked={newTplForm.isFeatured}
                        onChange={(e) => setNewTplForm({ ...newTplForm, isFeatured: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="newTplFeatured" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                        Mark as Featured template
                      </label>
                    </div>

                    <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => setIsCreatingNew(false)}
                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center space-x-1.5 cursor-pointer shadow-sm shadow-blue-500/20"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Template</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ABUSE REPORTS TAB */}
        {activeTab === 'abuse' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Abuse & Moderation Reports ({abuseReports.length})
            </h3>

            {abuseReports.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No active abuse reports filed. All published bots are in good standing.
              </div>
            ) : (
              <div className="space-y-3">
                {abuseReports.map(rep => (
                  <div
                    key={rep.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          Target Bot: {rep.chatbotId}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                          rep.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {rep.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                        Reason: <strong>{rep.reason}</strong>
                      </p>
                      {rep.details && <p className="text-xs text-slate-500 mt-0.5">{rep.details}</p>}
                      <div className="text-[10px] text-slate-400 mt-1">
                        Reported by: {rep.reportedBy} • {new Date(rep.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-start sm:self-auto">
                      {(['investigating', 'resolved', 'dismissed'] as const).map(st => (
                        <button
                          key={st}
                          onClick={() => handleReportStatus(rep.id, st)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-[10px] font-semibold capitalize cursor-pointer"
                        >
                          Mark {st}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AUDIT LOG TAB */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              System Audit Logs
            </h3>

            <div className="space-y-2">
              {auditLogs.map(log => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px]">
                        [{log.action}]
                      </span>
                      <span className="text-slate-800 dark:text-slate-200">{log.details}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      User: {log.userEmail} • Target: {log.targetResource}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 flex items-center space-x-1 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SYSTEM HEALTH TAB */}
        {activeTab === 'health' && systemHealth && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Runtime Health & Diagnostic Telemetry
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-400 block mb-1">Server Status</span>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <strong className="text-sm text-slate-900 dark:text-white capitalize">
                    {systemHealth.status}
                  </strong>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Uptime: {Math.floor(systemHealth.uptimeSeconds / 60)} minutes • Node {systemHealth.nodeVersion}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-400 block mb-1">Memory Allocation</span>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {systemHealth.memory?.heapUsedMb} MB / {systemHealth.memory?.heapTotalMb} MB
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Resident Set (RSS): {systemHealth.memory?.rssMb} MB
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-400 block mb-1">AI Provider Engine</span>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {systemHealth.aiProvider?.defaultModel}
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  {systemHealth.aiProvider?.mode}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Stored Database Records
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div>Users: <strong className="font-mono">{systemHealth.databaseCounts?.users}</strong></div>
                <div>Chatbots: <strong className="font-mono">{systemHealth.databaseCounts?.chatbots}</strong></div>
                <div>Knowledge Chunks: <strong className="font-mono">{systemHealth.databaseCounts?.knowledgeChunks}</strong></div>
                <div>Conversations: <strong className="font-mono">{systemHealth.databaseCounts?.conversations}</strong></div>
                <div>Usage Records: <strong className="font-mono">{systemHealth.databaseCounts?.usageRecords}</strong></div>
                <div>Audit Logs: <strong className="font-mono">{systemHealth.databaseCounts?.auditLogs}</strong></div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
