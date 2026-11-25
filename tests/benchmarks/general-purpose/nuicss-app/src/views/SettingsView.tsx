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
      <div className="pb-6 border-b border-subtle">
        <span className="badge badge-primary">Organization Preferences</span>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mt-1">
          Workspace Controls & Access Management
        </h1>
        <p className="text-sm text-muted mt-1">
          Configure security policies, API credentials, team RBAC permissions,
          and notification webhooks.
        </p>
      </div>

      {saveToast && (
        <div className="card p-3 border border-success/30 bg-success/10 text-success text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>
            Profile configuration saved successfully to cluster metadata.
          </span>
        </div>
      )}

      {deleteNotice && (
        <div className="card p-3 border border-danger/30 bg-danger/10 text-danger text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{deleteNotice}</span>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-subtle pb-2">
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
                  ? 'btn btn-primary'
                  : 'btn btn-ghost text-muted hover:text-primary'
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
        <div className="max-w-2xl card border border-subtle bg-surface p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-primary">
              Personal Information
            </h2>
            <p className="text-xs text-muted">
              Update your corporate identity and regional preferences.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-subtle"
            />
            <div>
              <button
                type="button"
                onClick={() => alert('Avatar picker simulated.')}
                className="btn btn-outline text-xs py-2 px-3 min-h-[44px] lg:min-h-[32px] inline-flex items-center justify-center"
              >
                Change Avatar
              </button>
              <div className="text-[11px] text-muted mt-1">
                PNG, JPG or WebP up to 4MB.
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="profile-legal-name"
                  className="block text-xs font-semibold text-muted mb-1"
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
                  className="input w-full px-3 py-2 text-xs min-h-[44px] lg:min-h-[36px]"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-work-email"
                  className="block text-xs font-semibold text-muted mb-1"
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
                  className="input w-full px-3 py-2 text-xs min-h-[44px] lg:min-h-[36px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="profile-role"
                  className="block text-xs font-semibold text-muted mb-1"
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
                  className="input w-full px-3 py-2 text-xs min-h-[44px] lg:min-h-[36px]"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-timezone"
                  className="block text-xs font-semibold text-muted mb-1"
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
                  className="input w-full px-3 py-2 text-xs min-h-[44px] lg:min-h-[36px]"
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
                className="block text-xs font-semibold text-muted mb-1"
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
                className="input w-full px-3 py-2 text-xs leading-relaxed min-h-[80px]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="btn btn-primary px-5 py-2.5 text-xs font-semibold cursor-pointer shadow-sm min-h-[44px] lg:min-h-[36px]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Notifications */}
      {activeTab === 'notifications' && (
        <div className="max-w-2xl card border border-subtle bg-surface p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-primary">
              Telemetry Notification Routing
            </h2>
            <p className="text-xs text-muted">
              Choose when and how high-priority cluster alerts are dispatched.
            </p>
          </div>

          <div className="space-y-4 divide-y divide-subtle">
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
                  <div className="text-xs font-bold text-primary">
                    {n.title}
                  </div>
                  <div className="text-[11px] text-muted mt-0.5">{n.desc}</div>
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
                      n.checked ? 'bg-primary' : 'bg-subtle'
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 card border border-subtle bg-surface shadow-sm">
            <div>
              <h2 className="text-base font-bold text-primary">
                Programmatic Ingestion Keys
              </h2>
              <p className="text-xs text-muted">
                Manage cryptographic tokens used by OpenTelemetry sidecars and
                microservices.
              </p>
            </div>
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="btn btn-primary inline-flex items-center gap-2 text-xs font-semibold shrink-0 cursor-pointer min-h-[44px] lg:min-h-[36px]"
            >
              <Plus className="w-4 h-4" />
              Generate API Key
            </button>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-label="Programmatic API keys directory"
            className="card border border-subtle bg-surface overflow-x-auto shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <table className="w-full text-left text-xs">
              <thead className="bg-subtle text-muted uppercase tracking-wider font-semibold border-b border-subtle">
                <tr>
                  <th className="py-3 px-4">Key Name</th>
                  <th className="py-3 px-4">Masked Secret</th>
                  <th className="py-3 px-4">Permissions</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle font-sans">
                {apiKeys.map((key) => (
                  <tr
                    key={key.id}
                    className="hover:bg-subtle/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-primary">
                      {key.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-muted">
                      {key.prefix}
                    </td>
                    <td className="py-3 px-4">
                      <span className="badge badge-primary text-[10px] font-bold">
                        {key.permissions}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted">{key.createdDate}</td>
                    <td className="py-3 px-4 text-muted">{key.lastUsed}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => copyKey(key.id, key.prefix)}
                          aria-label={`Copy secret for ${key.name}`}
                          className="btn btn-ghost p-2 text-muted hover:text-primary min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                          title="Copy Key"
                        >
                          {copiedKeyId === key.id ? (
                            <Check className="w-3.5 h-3.5 text-success" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => revokeKey(key.id)}
                          aria-label={`Revoke key ${key.name}`}
                          className="btn btn-ghost p-2 text-muted hover:text-danger min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-sm animate-fadeIn">
              <div className="card border border-subtle bg-surface rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                <button
                  onClick={() => setIsKeyModalOpen(false)}
                  aria-label="Close modal"
                  className="absolute top-4 right-4 p-2 rounded-lg text-muted hover:text-primary hover:bg-subtle min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-primary">
                  Create Ingestion Credential
                </h3>
                <p className="text-xs text-muted mt-1">
                  Scoped keys ensure isolated telemetry channels between
                  services.
                </p>

                <form onSubmit={handleGenerateKey} className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="new-key-name"
                      className="block text-xs font-semibold text-muted mb-1"
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
                      className="input w-full px-3 py-2 text-xs min-h-[44px] lg:min-h-[36px]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="new-key-perms"
                      className="block text-xs font-semibold text-muted mb-1"
                    >
                      Permission Scope
                    </label>
                    <select
                      id="new-key-perms"
                      aria-label="Permission Scope"
                      value={newKeyPerms}
                      onChange={(e) => setNewKeyPerms(e.target.value as any)}
                      className="input w-full px-3 py-2 text-xs min-h-[44px] lg:min-h-[36px]"
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
                      className="btn btn-outline text-xs min-h-[44px] lg:min-h-[36px] px-4"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary text-xs min-h-[44px] lg:min-h-[36px] px-4"
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 card border border-subtle bg-surface shadow-sm">
            <div>
              <h2 className="text-base font-bold text-primary">
                Team Collaborators
              </h2>
              <p className="text-xs text-muted">
                Manage role-based privileges across engineers and analytics
                viewers.
              </p>
            </div>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="btn btn-primary inline-flex items-center gap-2 text-xs font-semibold shrink-0 cursor-pointer min-h-[44px] lg:min-h-[36px]"
            >
              <Plus className="w-4 h-4" />
              Invite Member
            </button>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-label="Team collaborators directory"
            className="card border border-subtle bg-surface overflow-x-auto shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <table className="w-full text-left text-xs">
              <thead className="bg-subtle text-muted uppercase tracking-wider font-semibold border-b border-subtle">
                <tr>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {team.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-subtle/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-8 h-8 rounded-full object-cover border border-subtle"
                        />
                        <span className="font-semibold text-primary">
                          {m.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted">{m.email}</td>
                    <td className="py-3 px-4">
                      <span className="badge badge-primary text-[10px] font-bold">
                        {m.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`badge ${
                          m.status === 'Active'
                            ? 'badge-success'
                            : 'badge-warning'
                        } text-[10px] font-medium`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted">{m.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invite Member Modal */}
          {isInviteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-sm animate-fadeIn">
              <div className="card border border-subtle bg-surface rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  aria-label="Close modal"
                  className="absolute top-4 right-4 p-2 rounded-lg text-muted hover:text-primary hover:bg-subtle min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-primary">
                  Invite Engineering Member
                </h3>
                <p className="text-xs text-muted mt-1">
                  Send an email invitation with automated SSO onboarding.
                </p>

                <form onSubmit={handleInvite} className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="invite-email"
                      className="block text-xs font-semibold text-muted mb-1"
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
                      className="input w-full px-3 py-2 text-xs min-h-[44px] lg:min-h-[36px]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="invite-role"
                      className="block text-xs font-semibold text-muted mb-1"
                    >
                      Assigned Role
                    </label>
                    <select
                      id="invite-role"
                      aria-label="Assigned Role"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as any)}
                      className="input w-full px-3 py-2 text-xs min-h-[44px] lg:min-h-[36px]"
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
                      className="btn btn-outline text-xs min-h-[44px] lg:min-h-[36px] px-4"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary text-xs min-h-[44px] lg:min-h-[36px] px-4"
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
        <div className="max-w-2xl card border-2 border-danger/40 bg-surface p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-danger font-bold text-base">
            <AlertTriangle className="w-5 h-5" />
            <span>Destructive Workspace Operations</span>
          </div>
          <p className="text-xs text-muted">
            The actions below will permanently purge ingested telemetry streams
            and drop active cloud tenants.
          </p>

          <div className="space-y-4 pt-2">
            <div className="card p-4 border border-subtle flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-primary">
                  Transfer Workspace Ownership
                </div>
                <div className="text-[11px] text-muted mt-0.5">
                  Relinquish primary billing and administrative tenancy.
                </div>
              </div>
              <button
                onClick={() => alert('Ownership transfer workflow initiated.')}
                className="btn btn-outline text-xs font-semibold min-h-[44px] lg:min-h-[36px] px-4"
              >
                Transfer
              </button>
            </div>

            <div className="card p-4 border border-danger/30 bg-danger/5 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-danger">
                  Delete Project & Purge Ingest Buffers
                </div>
                <div className="text-[11px] text-danger/80 mt-0.5">
                  Irreversibly delete all cluster telemetry tables, custom
                  alerts, and historical logs.
                </div>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="btn btn-danger text-xs font-semibold cursor-pointer min-h-[44px] lg:min-h-[36px] px-4"
              >
                Delete Project
              </button>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-sm animate-fadeIn">
              <div className="card border-2 border-danger bg-surface rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  aria-label="Close modal"
                  className="absolute top-4 right-4 p-2 rounded-lg text-muted hover:text-primary min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 text-danger font-bold text-lg">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Confirm Irreversible Purge</span>
                </div>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  This will immediately destroy all regional replication
                  targets. Please type{' '}
                  <span className="font-mono font-bold text-danger">
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
                    className="input w-full px-3 py-2 text-xs font-mono min-h-[44px] lg:min-h-[36px]"
                  />
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="btn btn-outline text-xs min-h-[44px] lg:min-h-[36px] px-4"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={deleteConfirmation !== 'DELETE'}
                    onClick={handleDeleteProject}
                    className="btn btn-danger text-xs font-semibold cursor-pointer disabled:opacity-40 min-h-[44px] lg:min-h-[36px] px-4"
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
