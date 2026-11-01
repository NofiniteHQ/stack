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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Fleet Live
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Cluster: us-east-1a • 4 Nodes Active
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            SaaS Revenue & Telemetry Executive Hub
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Continuous real-time metrics, recurring subscription ARR, and
            tamper-evident audit streams.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer min-h-[44px] lg:min-h-[36px]"
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
            className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow min-w-0"
          >
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>{metric.title}</span>
              <span
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                  metric.trend === 'up'
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
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
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
              {metric.value}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {metric.description}
            </div>
          </div>
        ))}
      </div>

      {/* Velocity Chart + Audit Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
        {/* 12-Month Revenue Velocity Chart */}
        <div className="lg:col-span-2 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                12-Month Revenue Velocity
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Monthly ARR performance ($K) against target quota
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded-sm bg-blue-600 dark:bg-blue-500 shrink-0"></span>{' '}
                Actual Revenue
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-slate-300 dark:bg-slate-700 shrink-0"></span>{' '}
                Planned Target
              </span>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-none min-w-0 pb-1">
            <div className="h-64 flex items-end gap-1.5 sm:gap-4 pt-4 border-b border-slate-200 dark:border-slate-800 min-w-[280px]">
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
                        className="w-1/2 bg-slate-200 dark:bg-slate-800 rounded-t-sm transition-all duration-300 group-hover:bg-slate-300 dark:group-hover:bg-slate-700"
                        title={`Target: $${d.target}k`}
                      />
                      <div
                        style={{ height: `${revHeight}%` }}
                        className="w-1/2 bg-blue-600 dark:bg-blue-500 rounded-t-sm transition-all duration-300 group-hover:bg-blue-500 dark:group-hover:bg-blue-400 shadow-sm"
                        title={`Revenue: $${d.revenue}k`}
                      />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Real-time Audit Stream */}
        <div className="p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Live Audit Stream
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>{' '}
              Streaming
            </span>
          </div>
          <div
            tabIndex={0}
            role="region"
            aria-label="Live audit stream"
            className="space-y-4 flex-1 overflow-y-auto max-h-72 pr-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SAAS_AUDIT_STREAM.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 text-xs pb-3 border-b border-slate-100 dark:border-slate-800/60 last:border-0 last:pb-0"
              >
                <img
                  src={item.avatar}
                  alt={item.user}
                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <div className="flex-1">
                  <div className="text-slate-900 dark:text-slate-200">
                    <span className="font-semibold">{item.user}</span>{' '}
                    <span className="text-slate-600 dark:text-slate-400">
                      {item.action}
                    </span>{' '}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {item.target}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1.5">
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
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden min-w-0">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Customer Directory
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Manage enterprise subscriptions, seats, and contract renewal terms
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-56 min-h-[44px] lg:min-h-[32px]"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                aria-label="Filter by subscription plan"
                className="py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs min-h-[44px] lg:min-h-[32px]"
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
          className="overflow-x-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
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
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-slate-600 dark:text-slate-400"
                  >
                    No customers match current filter.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {cust.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {cust.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {cust.company}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                          cust.plan === 'Enterprise'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                            : cust.plan === 'Pro'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {cust.plan}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                          cust.status === 'active'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : cust.status === 'pending'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cust.status === 'active'
                              ? 'bg-emerald-500'
                              : cust.status === 'pending'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        {cust.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      ${cust.mrr.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {cust.users} users
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {cust.renewalDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Provision Customer Account
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Add a new tenant to the multi-region telemetry ingestion network.
            </p>

            {formError && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddCustomer} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="provision-name"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Full Customer Name
                </label>
                <input
                  id="provision-name"
                  type="text"
                  placeholder="e.g. Samantha Wright"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] lg:min-h-[36px]"
                />
              </div>

              <div>
                <label
                  htmlFor="provision-email"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Corporate Work Email
                </label>
                <input
                  id="provision-email"
                  type="email"
                  placeholder="samantha@corp.io"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] lg:min-h-[36px]"
                />
              </div>

              <div>
                <label
                  htmlFor="provision-plan"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Subscription Tier
                </label>
                <select
                  id="provision-plan"
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] lg:min-h-[36px]"
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
                  className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] lg:min-h-[36px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm min-h-[44px] lg:min-h-[36px]"
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
