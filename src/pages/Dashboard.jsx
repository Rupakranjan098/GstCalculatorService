import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  TrendingUp,
  Receipt,
  Users,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import GradientHeroCard from '../components/GradientHeroCard';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import StatusPill from '../components/StatusPill';

export default function Dashboard() {
  const { 
    products, 
    invoices, 
    customers, 
    activityLogs,
    currentUser
  } = useOutletContext();

  // Computations
  const totalRevenue = invoices.reduce((acc, curr) => acc + curr.grandTotal, 0);
  const lowStockProductsCount = products.filter(p => p.stock <= p.minStock).length;
  const unpaidInvoices = invoices.filter(i => i.status === 'Unpaid');
  const totalUnpaidReceivables = unpaidInvoices.reduce((acc, curr) => acc + curr.grandTotal, 0);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <GradientHeroCard
        title={`Welcome back, ${currentUser.name}!`}
        subtitle="Your business overview looks solid. You have low-stock items requiring replenishment and GSTR-1 filing deadlines approaching."
        actionText="Create New Invoice"
        onActionClick={() => window.location.hash = '#/billing'} // fallback or Link trigger
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          subtext={`From ${invoices.length} invoices`}
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Stock Alerts"
          value={lowStockProductsCount}
          subtext={`${lowStockProductsCount > 0 ? 'Requires attention' : 'All stocks healthy'}`}
          icon={AlertTriangle}
          color={lowStockProductsCount > 0 ? 'amber' : 'emerald'}
        />
        <StatCard
          title="Receivables"
          value={`₹${totalUnpaidReceivables.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          subtext={`${unpaidInvoices.length} unpaid invoices`}
          icon={Receipt}
          color="rose"
        />
        <StatCard
          title="Total Customers"
          value={customers.length}
          subtext="Active in portal"
          icon={Users}
          color="slate"
        />
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Recent Invoices Card */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <DataTable
            title="Recent Invoices"
            headers={[
              { label: 'Invoice No' },
              { label: 'Customer' },
              { label: 'Amount' },
              { label: 'Status' }
            ]}
          >
            {invoices.slice(0, 5).map((inv, idx) => (
              <tr key={idx} className="hover:bg-slate-50/20">
                <td className="px-5 py-3.5 font-bold text-[#4F46E5]">{inv.invoiceNumber}</td>
                <td className="px-5 py-3.5 text-slate-800">{inv.customerName}</td>
                <td className="px-5 py-3.5 font-bold text-slate-800">
                  ₹{inv.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-5 py-3.5">
                  <StatusPill value={inv.status} />
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan="4" className="px-5 py-8 text-center text-slate-400 italic">No invoices recorded.</td>
              </tr>
            )}
          </DataTable>
        </div>

        {/* Live Operation Log card */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm mb-4">Live Operation Log</h3>
            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="border-l-2 border-[#4F46E5] pl-3 py-0.5 space-y-0.5">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400">
                    <span>{log.user} ({log.role})</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-[10.5px] font-bold text-slate-700 leading-tight">{log.action}</p>
                  <p className="text-[9.5px] text-slate-400 truncate">{log.details}</p>
                </div>
              ))}
              {activityLogs.length === 0 && (
                <p className="text-center text-slate-450 italic text-xs py-8">No log activities recorded.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
