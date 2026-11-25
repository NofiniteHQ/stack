import React, { useState } from 'react';
import {
  SAAS_METRICS,
  SAAS_VELOCITY_CHART,
  SAAS_CUSTOMERS,
  SAAS_AUDIT_STREAM,
  Customer,
} from '../../../shared/domain-data';
import {
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CreditCard,
  UserCheck,
  Server,
  X,
  CheckCircle2,
  Filter,
} from 'lucide-react';

export function DashboardView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>(SAAS_CUSTOMERS);

  // Form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPlan, setNewPlan] = useState<'Enterprise' | 'Pro' | 'Starter'>(
    'Enterprise'
  );
  const [formError, setFormError] = useState<string | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan =
      selectedPlan === 'all' ||
      c.plan.toLowerCase() === selectedPlan.toLowerCase();
    return matchesSearch && matchesPlan;
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setFormError('Customer name is required');
      return;
    }
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setFormError('Valid corporate email is required');
      return;
    }

    const newCustomer: Customer = {
      id: `CUST-00${customers.length + 1}`,
      name: newName.trim(),
      email: newEmail.trim(),
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop',
      company: newName.trim() + ' Tech',
      plan: newPlan,
      status: 'active',
      mrr: newPlan === 'Enterprise' ? 6500 : newPlan === 'Pro' ? 2200 : 650,
      users: newPlan === 'Enterprise' ? 150 : 35,
      renewalDate: '2027-11-15',
    };

    setCustomers([newCustomer, ...customers]);
    setIsModalOpen(false);
    setNewName('');
    setNewEmail('');
    setFormError(null);
  };

  const maxRevenue = Math.max(
    ...SAAS_VELOCITY_CHART.map((d) => Math.max(d.revenue, d.target))
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-primary">Fleet Live</span>
            <span className="text-xs text-muted">
              Cluster: us-east-1a • 4 Nodes Active
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mt-1">
            SaaS Revenue & Telemetry Executive Hub
          </h1>
          <p className="text-sm text-muted mt-1">
            Continuous real-time metrics, recurring subscription ARR, and
            tamper-evident audit streams.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary inline-flex items-center gap-2 cursor-pointer min-h-[44px] lg:min-h-[36px] px-4"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0">
        {SAAS_METRICS.map((metric) => (
          <div
            key={metric.id}
            className="card p-4 sm:p-5 border border-subtle bg-surface shadow-sm hover:shadow-md transition-shadow min-w-0"
          >
            <div className="flex items-center justify-between text-muted text-xs font-semibold uppercase tracking-wider">
              <span>{metric.title}</span>
              <span
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                  metric.trend === 'up'
                    ? 'badge badge-success'
                    : 'badge badge-danger'
                }`}
              >
                {metric.trend === 'up' ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {metric.change}
              </span>
            </div>
            <div className="text-2xl lg:text-3xl font-extrabold text-primary mt-2">
              {metric.value}
            </div>
            <div className="text-xs text-muted mt-1">{metric.description}</div>
          </div>
        ))}
      </div>

      {/* Velocity Chart + Audit Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
        {/* 12-Month Revenue Velocity Chart */}
        <div className="lg:col-span-2 card p-4 sm:p-6 border border-subtle bg-surface shadow-sm min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-base font-semibold text-primary">
                12-Month Revenue Velocity
              </h2>
              <p className="text-xs text-muted">
                Monthly ARR performance ($K) against target quota
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-muted">
                <span className="w-3 h-3 rounded-sm bg-primary shrink-0"></span>{' '}
                Actual Revenue
              </span>
              <span className="flex items-center gap-1.5 text-muted">
                <span className="w-3 h-3 rounded-sm bg-subtle shrink-0"></span>{' '}
                Planned Target
              </span>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-none min-w-0 pb-1">
            <div className="h-64 flex items-end gap-1.5 sm:gap-4 pt-4 border-b border-subtle min-w-[280px]">
              {SAAS_VELOCITY_CHART.map((d) => {
                const revHeight = (d.revenue / maxRevenue) * 100;
                const targetHeight = (d.target / maxRevenue) * 100;
                return (
                  <div
                    key={d.month}
                    className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end min-w-0"
                  >
                    <div className="w-full flex items-end justify-center gap-1 h-52">
                      <div
                        style={{ height: `${targetHeight}%` }}
                        className="w-1/2 bg-subtle rounded-t-sm transition-all duration-300"
                        title={`Target: $${d.target}k`}
                      />
                      <div
                        style={{ height: `${revHeight}%` }}
                        className="w-1/2 bg-primary rounded-t-sm transition-all duration-300 shadow-sm"
                        title={`Revenue: $${d.revenue}k`}
                      />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-medium text-muted group-hover:text-primary">
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Real-time Audit Stream */}
        <div className="card p-4 sm:p-6 border border-subtle bg-surface shadow-sm flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-primary">
              Live Audit Stream
            </h2>
            <span className="badge badge-success flex items-center gap-1 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>{' '}
              Streaming
            </span>
          </div>
          <div
            tabIndex={0}
            role="region"
            aria-label="Live audit stream"
            className="space-y-4 flex-1 overflow-y-auto max-h-72 pr-1 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {SAAS_AUDIT_STREAM.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 text-xs pb-3 border-b border-subtle last:border-0 last:pb-0"
              >
                <img
                  src={item.avatar}
                  alt={item.user}
                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-subtle"
                />
                <div className="flex-1">
                  <div className="text-primary">
                    <span className="font-semibold">{item.user}</span>{' '}
                    <span className="text-muted">{item.action}</span>{' '}
                    <span className="font-medium text-primary">
                      {item.target}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted mt-1 flex items-center gap-1.5">
                    <span>{item.time}</span>
                    <span>•</span>
                    <span className="capitalize">{item.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customers Data Table with Filters */}
      <div className="card border border-subtle bg-surface shadow-sm overflow-hidden min-w-0">
        <div className="p-4 sm:p-5 border-b border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-primary">
              Customer Directory
            </h2>
            <p className="text-xs text-muted">
              Manage enterprise subscriptions, seats, and contract renewal terms
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-9 pr-3 py-1.5 text-xs w-full sm:w-56 min-h-[44px] lg:min-h-[32px]"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-muted" />
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                aria-label="Filter by subscription plan"
                className="input py-1.5 px-2 text-xs min-h-[44px] lg:min-h-[32px]"
              >
                <option value="all">All Plans</option>
                <option value="enterprise">Enterprise</option>
                <option value="pro">Pro</option>
                <option value="starter">Starter</option>
              </select>
            </div>
          </div>
        </div>

        <div
          tabIndex={0}
          role="region"
          aria-label="Customer accounts directory"
          className="overflow-x-auto focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <table className="w-full text-left text-xs">
            <thead className="bg-subtle text-muted uppercase tracking-wider font-semibold border-b border-subtle">
              <tr>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">MRR</th>
                <th className="py-3 px-4">Seats</th>
                <th className="py-3 px-4">Renewal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">
                    No customers match current filter.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    className="hover:bg-subtle/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-subtle"
                        />
                        <div>
                          <div className="font-semibold text-primary">
                            {cust.name}
                          </div>
                          <div className="text-[11px] text-muted">
                            {cust.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-primary">
                      {cust.company}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`badge ${
                          cust.plan === 'Enterprise'
                            ? 'badge-primary'
                            : cust.plan === 'Pro'
                            ? 'badge-info'
                            : 'badge-secondary'
                        }`}
                      >
                        {cust.plan}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`badge ${
                          cust.status === 'active'
                            ? 'badge-success'
                            : cust.status === 'pending'
                            ? 'badge-warning'
                            : 'badge-danger'
                        } flex items-center gap-1`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cust.status === 'active'
                              ? 'bg-success'
                              : cust.status === 'pending'
                              ? 'bg-warning'
                              : 'bg-danger'
                          }`}
                        />
                        {cust.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-primary">
                      ${cust.mrr.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-muted">{cust.users} users</td>
                    <td className="py-3 px-4 text-muted">{cust.renewalDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-sm animate-fadeIn">
          <div className="card border border-subtle bg-surface rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-2 rounded-lg text-muted hover:text-primary hover:bg-subtle min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-primary">
              Provision Customer Account
            </h3>
            <p className="text-xs text-muted mt-1">
              Add a new tenant to the multi-region telemetry ingestion network.
            </p>

            {formError && (
              <div className="mt-3 p-2.5 rounded-lg badge-danger text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddCustomer} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="dash-customer-name"
                  className="block text-xs font-semibold text-muted mb-1"
                >
                  Full Customer Name
                </label>
                <input
                  id="dash-customer-name"
                  type="text"
                  aria-label="Full Customer Name"
                  placeholder="e.g. Samantha Wright"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="input w-full px-3 py-2 text-xs min-h-[44px] lg:min-h-[36px]"
                />
              </div>

              <div>
                <label
                  htmlFor="dash-customer-email"
                  className="block text-xs font-semibold text-muted mb-1"
                >
                  Corporate Work Email
                </label>
                <input
                  id="dash-customer-email"
                  type="email"
                  aria-label="Corporate Work Email"
                  placeholder="samantha@corp.io"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="input w-full px-3 py-2 text-xs min-h-[44px] lg:min-h-[36px]"
                />
              </div>

              <div>
                <label
                  htmlFor="dash-customer-plan"
                  className="block text-xs font-semibold text-muted mb-1"
                >
                  Subscription Tier
                </label>
                <select
                  id="dash-customer-plan"
                  aria-label="Subscription Tier"
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value as any)}
                  className="input w-full px-3 py-2 text-xs min-h-[44px] lg:min-h-[36px]"
                >
                  <option value="Enterprise">Enterprise ($6,500/mo)</option>
                  <option value="Pro">Growth Pro ($2,200/mo)</option>
                  <option value="Starter">Starter ($650/mo)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline text-xs min-h-[44px] lg:min-h-[36px] px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs min-h-[44px] lg:min-h-[36px] px-4"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
