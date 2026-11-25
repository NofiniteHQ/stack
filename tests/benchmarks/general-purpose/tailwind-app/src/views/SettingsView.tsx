import React, { useState } from 'react';
import {
  SETTINGS_PROFILE,
  SETTINGS_API_KEYS,
  SETTINGS_TEAM_MEMBERS,
  ApiKeyItem,
  TeamMember,
} from '../../../shared/domain-data';
import {
  User,
  Bell,
  Key,
  Users,
  AlertTriangle,
  Copy,
  Check,
  Plus,
  Trash2,
  X,
  Shield,
  CheckCircle2,
} from 'lucide-react';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'notifications' | 'keys' | 'team' | 'danger'
  >('profile');

  // Profile form state
  const [profile, setProfile] = useState(SETTINGS_PROFILE);
  const [saveToast, setSaveToast] = useState(false);

  // Notification toggles
  const [notifications, setNotifications] = useState({
    incidents: true,
    weeklyDigest: false,
    anomalies: true,
    bulletins: true,
  });

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(SETTINGS_API_KEYS);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPerms, setNewKeyPerms] = useState<
    'Full Access' | 'Read Only' | 'Ingest Only'
  >('Ingest Only');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Team state
  const [team, setTeam] = useState<TeamMember[]>(SETTINGS_TEAM_MEMBERS);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Member' | 'Viewer'>(
    'Member'
  );

  // Danger zone state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const copyKey = (id: string, prefix: string) => {
    navigator.clipboard.writeText(prefix);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const revokeKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName.trim(),
      prefix: `nui_live_${Math.random()
        .toString(36)
        .substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
      createdDate: new Date().toISOString().split('T')[0],
      lastUsed: 'Just generated',
      permissions: newKeyPerms,
    };
    setApiKeys([newKey, ...apiKeys]);
    setIsKeyModalOpen(false);
    setNewKeyName('');
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) return;
    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'Invited',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop',
      lastActive: 'Invitation sent',
    };
    setTeam([...team, newMember]);
    setIsInviteModalOpen(false);
    setInviteEmail('');
  };

  const handleDeleteProject = () => {
    if (deleteConfirmation === 'DELETE') {
      setDeleteNotice('Workspace scheduled for deletion in 48 hours.');
      setIsDeleteModalOpen(false);
      setDeleteConfirmation('');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Settings Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          Organization Preferences
        </span>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
          Workspace Controls & Access Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure security policies, API credentials, team RBAC permissions,
          and notification webhooks.
        </p>
      </div>

      {saveToast && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            Profile configuration saved successfully to cluster metadata.
          </span>
        </div>
      )}

      {deleteNotice && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>{deleteNotice}</span>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'profile', label: 'General Profile', icon: User },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'keys', label: 'API Keys', icon: Key },
          { id: 'team', label: 'Team & RBAC', icon: Users },
          { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 lg:py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[44px] lg:min-h-[36px] ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Personal Information
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Update your corporate identity and regional preferences.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
            />
            <div>
              <button
                type="button"
                onClick={() => alert('Avatar picker simulated.')}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 min-h-[44px] lg:min-h-[32px] inline-flex items-center justify-center"
              >
                Change Avatar
              </button>
              <div className="text-[11px] text-slate-400 mt-1">
                PNG, JPG or WebP up to 4MB.
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="profile-legal-name"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Full Legal Name
                </label>
                <input
                  id="profile-legal-name"
                  type="text"
                  aria-label="Full Legal Name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] lg:min-h-[36px]"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-work-email"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Work Email Address
                </label>
                <input
                  id="profile-work-email"
                  type="email"
                  aria-label="Work Email Address"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] lg:min-h-[36px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="profile-role"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Designation / Role
                </label>
                <input
                  id="profile-role"
                  type="text"
                  aria-label="Designation / Role"
                  value={profile.role}
                  onChange={(e) =>
                    setProfile({ ...profile, role: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] lg:min-h-[36px]"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-timezone"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Primary Timezone
                </label>
                <select
                  id="profile-timezone"
                  aria-label="Primary Timezone"
                  value={profile.timezone}
                  onChange={(e) =>
                    setProfile({ ...profile, timezone: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] lg:min-h-[36px]"
                >
                  <option value="UTC-08:00 (Pacific Time)">
                    UTC-08:00 (Pacific Time)
                  </option>
                  <option value="UTC-05:00 (Eastern Time)">
                    UTC-05:00 (Eastern Time)
                  </option>
                  <option value="UTC+00:00 (London GMT)">
                    UTC+00:00 (London GMT)
                  </option>
                  <option value="UTC+05:30 (India Standard)">
                    UTC+05:30 (India Standard)
                  </option>
                  <option value="UTC+09:00 (Tokyo JST)">
                    UTC+09:00 (Tokyo JST)
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="profile-bio"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Engineering Biography
              </label>
              <textarea
                id="profile-bio"
                aria-label="Engineering Biography"
                rows={3}
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed min-h-[80px]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer min-h-[44px] lg:min-h-[36px]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Notifications */}
      {activeTab === 'notifications' && (
        <div className="max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Telemetry Notification Routing
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Choose when and how high-priority cluster alerts are dispatched.
            </p>
          </div>

          <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
            {[
              {
                id: 'incidents',
                title: 'Critical Incident Alerts (Sev-1)',
                desc: 'Immediate dispatch over SMS, PagerDuty, and email for unhandled edge outages.',
                checked: notifications.incidents,
              },
              {
                id: 'anomalies',
                title: 'High-Volume Ingestion Anomalies',
                desc: 'Alert when ingest rate exceeds 150% of 7-day rolling moving average.',
                checked: notifications.anomalies,
              },
              {
                id: 'weeklyDigest',
                title: 'Weekly Executive Performance Digest',
                desc: 'Summary of query latencies, cost per million events, and uptime SLA compliance.',
                checked: notifications.weeklyDigest,
              },
              {
                id: 'bulletins',
                title: 'Security Advisories & Token Expirations',
                desc: 'Notification 14 days before mutual TLS certificates or root keys expire.',
                checked: notifications.bulletins,
              },
            ].map((n) => (
              <div
                key={n.id}
                className="pt-4 first:pt-0 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {n.title}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    {n.desc}
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={n.checked}
                  aria-label={n.title}
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      [n.id]:
                        !notifications[n.id as keyof typeof notifications],
                    })
                  }
                  className="relative inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2 bg-transparent border-0 cursor-pointer shrink-0"
                >
                  <div
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      n.checked
                        ? 'bg-blue-600'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        n.checked ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: API Keys */}
      {activeTab === 'keys' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Programmatic Ingestion Keys
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Manage cryptographic tokens used by OpenTelemetry sidecars and
                microservices.
              </p>
            </div>
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer shrink-0 min-h-[44px] lg:min-h-[36px]"
            >
              <Plus className="w-4 h-4" />
              Generate API Key
            </button>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-label="Programmatic API keys directory"
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Key Name</th>
                  <th className="py-3 px-4">Masked Secret</th>
                  <th className="py-3 px-4">Permissions</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                {apiKeys.map((key) => (
                  <tr
                    key={key.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {key.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {key.prefix}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {key.permissions}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {key.createdDate}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {key.lastUsed}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => copyKey(key.id, key.prefix)}
                          aria-label={`Copy secret for ${key.name}`}
                          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                          title="Copy Key"
                        >
                          {copiedKeyId === key.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => revokeKey(key.id)}
                          aria-label={`Revoke key ${key.name}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                          title="Revoke Key"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Generate Key Modal */}
          {isKeyModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                <button
                  onClick={() => setIsKeyModalOpen(false)}
                  aria-label="Close modal"
                  className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Create Ingestion Credential
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Scoped keys ensure isolated telemetry channels between
                  services.
                </p>

                <form onSubmit={handleGenerateKey} className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="new-key-name"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Key Identifier Name
                    </label>
                    <input
                      id="new-key-name"
                      type="text"
                      aria-label="Key Identifier Name"
                      placeholder="e.g. Lambda Collector us-west"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] lg:min-h-[36px]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="new-key-perms"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Permission Scope
                    </label>
                    <select
                      id="new-key-perms"
                      aria-label="Permission Scope"
                      value={newKeyPerms}
                      onChange={(e) => setNewKeyPerms(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] lg:min-h-[36px]"
                    >
                      <option value="Ingest Only">
                        Ingest Only (Publish metrics)
                      </option>
                      <option value="Read Only">
                        Read Only (Execute analytical queries)
                      </option>
                      <option value="Full Access">
                        Full Access (Admin & Configuration)
                      </option>
                    </select>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsKeyModalOpen(false)}
                      className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 min-h-[44px] lg:min-h-[36px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm min-h-[44px] lg:min-h-[36px]"
                    >
                      Generate Key
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Team */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Team Collaborators
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Manage role-based privileges across engineers and analytics
                viewers.
              </p>
            </div>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer shrink-0 min-h-[44px] lg:min-h-[36px]"
            >
              <Plus className="w-4 h-4" />
              Invite Member
            </button>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-label="Team collaborators directory"
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {team.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {m.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {m.email}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {m.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          m.status === 'Active'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {m.lastActive}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invite Member Modal */}
          {isInviteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  aria-label="Close modal"
                  className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Invite Engineering Member
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Send an email invitation with automated SSO onboarding.
                </p>

                <form onSubmit={handleInvite} className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="invite-email"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Collaborator Corporate Email
                    </label>
                    <input
                      id="invite-email"
                      type="email"
                      aria-label="Collaborator Corporate Email"
                      placeholder="engineer@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] lg:min-h-[36px]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="invite-role"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Assigned Role
                    </label>
                    <select
                      id="invite-role"
                      aria-label="Assigned Role"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] lg:min-h-[36px]"
                    >
                      <option value="Admin">
                        Admin (Full Cluster Configuration)
                      </option>
                      <option value="Member">Member (Read & Ingestion)</option>
                      <option value="Viewer">
                        Viewer (Dashboard Read Only)
                      </option>
                    </select>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsInviteModalOpen(false)}
                      className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 min-h-[44px] lg:min-h-[36px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm min-h-[44px] lg:min-h-[36px]"
                    >
                      Send Invitation
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Danger Zone */}
      {activeTab === 'danger' && (
        <div className="max-w-2xl rounded-2xl border-2 border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
            <AlertTriangle className="w-5 h-5" />
            <span>Destructive Workspace Operations</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            The actions below will permanently purge ingested telemetry streams
            and drop active cloud tenants.
          </p>

          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Transfer Workspace Ownership
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Relinquish primary billing and administrative tenancy.
                </div>
              </div>
              <button
                onClick={() => alert('Ownership transfer workflow initiated.')}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 min-h-[44px] lg:min-h-[36px]"
              >
                Transfer
              </button>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-950 bg-rose-50/40 dark:bg-rose-950/20 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-rose-700 dark:text-rose-300">
                  Delete Project & Purge Ingest Buffers
                </div>
                <div className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-0.5">
                  Irreversibly delete all cluster telemetry tables, custom
                  alerts, and historical logs.
                </div>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer min-h-[44px] lg:min-h-[36px]"
              >
                Delete Project
              </button>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white dark:bg-slate-900 border-2 border-rose-500 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  aria-label="Close modal"
                  className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 text-rose-600 font-bold text-lg">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Confirm Irreversible Purge</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  This will immediately destroy all regional replication
                  targets. Please type{' '}
                  <span className="font-mono font-bold text-rose-600">
                    DELETE
                  </span>{' '}
                  to confirm.
                </p>

                <div className="mt-4">
                  <label htmlFor="delete-confirm-input" className="sr-only">
                    Type DELETE to confirm
                  </label>
                  <input
                    id="delete-confirm-input"
                    aria-label="Type DELETE to confirm"
                    type="text"
                    placeholder="Type DELETE"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[44px] lg:min-h-[36px]"
                  />
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 min-h-[44px] lg:min-h-[36px]"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={deleteConfirmation !== 'DELETE'}
                    onClick={handleDeleteProject}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white shadow-sm cursor-pointer min-h-[44px] lg:min-h-[36px]"
                  >
                    Confirm Destruction
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
