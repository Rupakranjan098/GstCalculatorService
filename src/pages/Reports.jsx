import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Calendar,
  FileText,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent
} from 'lucide-react';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import StatusPill from '../components/StatusPill';

export default function Reports() {
  const {
    invoices,
    suppliers,
    businessProfile
  } = useOutletContext();

  const [activeReportTab, setActiveReportTab] = useState('Sales');
  const [reportStartDate, setReportStartDate] = useState('2026-06-01');
  const [reportEndDate, setReportEndDate] = useState('2026-06-30');

  // Date Range Syncing trigger
  const parseInvoiceDate = (dateStr) => {
    if (!dateStr) return new Date();
    const months = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };
    const parts = dateStr.split(' ');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = months[parts[1].toLowerCase()];
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    const parsed = Date.parse(dateStr);
    if (!isNaN(parsed)) return new Date(parsed);
    return new Date();
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const invDate = parseInvoiceDate(inv.date);
      const start = reportStartDate ? new Date(reportStartDate) : null;
      const end = reportEndDate ? new Date(reportEndDate) : null;
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);
      if (start && invDate < start) return false;
      if (end && invDate > end) return false;
      return true;
    });
  }, [invoices, reportStartDate, reportEndDate]);

  const filteredPurchases = useMemo(() => {
    const allPurchases = [];
    suppliers.forEach(s => {
      if (s.purchases) {
        s.purchases.forEach(p => {
          allPurchases.push({
            ...p,
            supplierName: s.name,
            supplierId: s.id
          });
        });
      }
    });
    return allPurchases.filter(p => {
      const pDate = parseInvoiceDate(p.date);
      const start = reportStartDate ? new Date(reportStartDate) : null;
      const end = reportEndDate ? new Date(reportEndDate) : null;
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);
      if (start && pDate < start) return false;
      if (end && pDate > end) return false;
      return true;
    });
  }, [suppliers, reportStartDate, reportEndDate]);

  const reportStats = useMemo(() => {
    let totalSalesSubtotal = 0;
    let totalSalesGrand = 0;
    let paidSalesCount = 0;
    let paidSalesSum = 0;
    let unpaidSalesCount = 0;
    let unpaidSalesSum = 0;

    filteredInvoices.forEach(inv => {
      totalSalesSubtotal += inv.subtotal || 0;
      totalSalesGrand += inv.grandTotal || 0;
      if (inv.status === 'Paid') {
        paidSalesCount++;
        paidSalesSum += inv.grandTotal || 0;
      } else {
        unpaidSalesCount++;
        unpaidSalesSum += inv.grandTotal || 0;
      }
    });

    let totalCgstCollected = 0;
    let totalSgstCollected = 0;
    let totalIgstCollected = 0;

    filteredInvoices.forEach(inv => {
      totalCgstCollected += inv.cgstTotal || 0;
      totalSgstCollected += inv.sgstTotal || 0;
      totalIgstCollected += inv.igstTotal || 0;
    });

    const totalGstCollected = totalCgstCollected + totalSgstCollected + totalIgstCollected;

    const operatingRevenue = totalSalesSubtotal;
    let totalPurchasesAmount = 0;
    filteredPurchases.forEach(p => {
      totalPurchasesAmount += p.amount || 0;
    });
    
    const costOfSales = totalPurchasesAmount;
    const grossProfit = operatingRevenue - costOfSales;
    const netMarginPercent = operatingRevenue > 0 ? (grossProfit / operatingRevenue) * 100 : 0;

    return {
      sales: {
        totalRevenue: totalSalesSubtotal,
        totalSales: totalSalesGrand,
        paidCount: paidSalesCount,
        paidSum: paidSalesSum,
        unpaidCount: unpaidSalesCount,
        unpaidSum: unpaidSalesSum,
        avgInvoiceValue: filteredInvoices.length > 0 ? (totalSalesGrand / filteredInvoices.length) : 0
      },
      gst: {
        taxableValue: totalSalesSubtotal,
        cgst: totalCgstCollected,
        sgst: totalSgstCollected,
        igst: totalIgstCollected,
        total: totalGstCollected
      },
      pl: {
        revenue: operatingRevenue,
        cost: costOfSales,
        profit: grossProfit,
        margin: netMarginPercent
      }
    };
  }, [filteredInvoices, filteredPurchases]);

  return (
    <div className="space-y-6">
      {/* Date Range Picker Top-Right via Flex Layout Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm">Financial Statements</h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Filter sales logs, GST tax declarations, and operating performance.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 text-[11px] font-bold text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Date Range:</span>
          <input 
            type="date" 
            value={reportStartDate} 
            onChange={(e) => setReportStartDate(e.target.value)} 
            className="bg-transparent focus:outline-none text-slate-700 cursor-pointer border-none p-0 w-[110px]" 
          />
          <span className="text-slate-300">—</span>
          <input 
            type="date" 
            value={reportEndDate} 
            onChange={(e) => setReportEndDate(e.target.value)} 
            className="bg-transparent focus:outline-none text-slate-700 cursor-pointer border-none p-0 w-[110px]" 
          />
        </div>
      </div>

      {/* Switcher styled like nested sub-items */}
      <div className="flex items-center gap-6 pb-2.5 border-b border-slate-100">
        {['Sales', 'GST', 'Profit & Loss'].map(t => {
          const isSelected = activeReportTab === t;
          return (
            <button
              key={t}
              onClick={() => setActiveReportTab(t)}
              className={`text-xs font-bold transition-all relative pb-2 cursor-pointer ${
                isSelected 
                  ? 'text-[#4F46E5] font-black' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {t}
              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-[#4F46E5]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Stats Row */}
      {activeReportTab === 'Sales' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Sales"
            value={`₹${reportStats.sales.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            subtext={`Excl. Tax: ₹${reportStats.sales.totalRevenue.toLocaleString('en-IN')}`}
            icon={TrendingUp}
            color="indigo"
          />
          <StatCard
            title="Paid Invoices"
            value={`₹${reportStats.sales.paidSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            subtext={`${reportStats.sales.paidCount} Transactions`}
            icon={DollarSign}
            color="emerald"
          />
          <StatCard
            title="Unpaid / Pending"
            value={`₹${reportStats.sales.unpaidSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            subtext={`${reportStats.sales.unpaidCount} Receivables`}
            icon={TrendingDown}
            color="amber"
          />
          <StatCard
            title="Avg Invoice Value"
            value={`₹${reportStats.sales.avgInvoiceValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            subtext={`Across ${filteredInvoices.length} orders`}
            icon={Percent}
            color="slate"
          />
        </div>
      )}

      {activeReportTab === 'GST' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="GST Liabilities"
            value={`₹${reportStats.gst.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            subtext={`Taxable Value: ₹${reportStats.gst.taxableValue.toLocaleString('en-IN')}`}
            icon={Percent}
            color="indigo"
          />
          <StatCard
            title="CGST Collected"
            value={`₹${reportStats.gst.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            subtext="Central Tax Portion"
            icon={DollarSign}
            color="slate"
          />
          <StatCard
            title="SGST Collected"
            value={`₹${reportStats.gst.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            subtext="State Tax Portion"
            icon={DollarSign}
            color="slate"
          />
          <StatCard
            title="IGST Collected"
            value={`₹${reportStats.gst.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            subtext="Integrated Tax Portion"
            icon={DollarSign}
            color="slate"
          />
        </div>
      )}

      {activeReportTab === 'Profit & Loss' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Operating Sales"
            value={`₹${reportStats.pl.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            subtext="Excludes GST liabilities"
            icon={TrendingUp}
            color="indigo"
          />
          <StatCard
            title="Supplier Purchases"
            value={`₹${reportStats.pl.cost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            subtext="Inventory procurement costs"
            icon={TrendingDown}
            color="rose"
          />
          <StatCard
            title="Gross Profit"
            value={`₹${reportStats.pl.profit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            subtext="Sales minus Procurement"
            icon={TrendingUp}
            color={reportStats.pl.profit >= 0 ? 'emerald' : 'rose'}
          />
          <StatCard
            title="Net Margin %"
            value={`${reportStats.pl.margin.toFixed(1)}%`}
            subtext="Operational profit percentage"
            icon={Percent}
            color="slate"
          />
        </div>
      )}

      {/* Tabular Statement Table */}
      {activeReportTab === 'Sales' && (
        <DataTable
          title="Sales Logs"
          headers={['Invoice No', 'Customer', 'Date', 'Subtotal', 'GST', 'Total', 'Status']}
        >
          {filteredInvoices.map((inv, idx) => {
            const totalGst = inv.cgstTotal + inv.sgstTotal + inv.igstTotal;
            return (
              <tr key={idx} className="hover:bg-slate-50/20">
                <td className="px-5 py-3 font-bold text-[#4F46E5]">{inv.invoiceNumber}</td>
                <td className="px-5 py-3 text-slate-800">{inv.customerName}</td>
                <td className="px-5 py-3">{inv.date}</td>
                <td className="px-5 py-3">₹{inv.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className="px-5 py-3">₹{totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className="px-5 py-3 font-bold text-slate-805">₹{inv.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className="px-5 py-3">
                  <StatusPill value={inv.status} />
                </td>
              </tr>
            );
          })}
          {filteredInvoices.length === 0 && (
            <tr>
              <td colSpan="7" className="px-5 py-6 text-center text-slate-400 italic">No sales invoices found in selected range.</td>
            </tr>
          )}
        </DataTable>
      )}

      {activeReportTab === 'GST' && (
        <DataTable
          title="GST Tax Inward / Outward Report"
          headers={['Date', 'Invoice No', 'Customer Name', 'Taxable Value', 'CGST', 'SGST', 'IGST', 'Total GST']}
        >
          {filteredInvoices.map((inv, idx) => {
            const totalGst = inv.cgstTotal + inv.sgstTotal + inv.igstTotal;
            return (
              <tr key={idx} className="hover:bg-slate-50/20">
                <td className="px-5 py-3">{inv.date}</td>
                <td className="px-5 py-3 font-bold text-slate-700">{inv.invoiceNumber}</td>
                <td className="px-5 py-3 text-slate-800">{inv.customerName}</td>
                <td className="px-5 py-3">₹{inv.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className="px-5 py-3">₹{inv.cgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className="px-5 py-3">₹{inv.sgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className="px-5 py-3">₹{inv.igstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className="px-5 py-3 font-bold text-slate-800">₹{totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            );
          })}
          {filteredInvoices.length === 0 && (
            <tr>
              <td colSpan="8" className="px-5 py-6 text-center text-slate-400 italic">No GST transactions found in selected range.</td>
            </tr>
          )}
        </DataTable>
      )}

      {activeReportTab === 'Profit & Loss' && (
        <DataTable
          title="Operating Profit & Loss Statements"
          headers={['Type', 'Identifier', 'Details', 'Date', { label: 'Debit (Cost)', align: 'right' }, { label: 'Credit (Rev)', align: 'right' }, { label: 'Net Impact', align: 'right' }]}
        >
          {[
            ...filteredInvoices.map(inv => ({
              type: 'Sales Credit',
              id: inv.invoiceNumber,
              details: `Sale to ${inv.customerName}`,
              date: inv.date,
              debit: 0,
              credit: inv.subtotal,
              impact: inv.subtotal,
              dateObj: parseInvoiceDate(inv.date)
            })),
            ...filteredPurchases.map(p => ({
              type: 'Procurement Debit',
              id: p.purchaseNo,
              details: `Purchase from ${p.supplierName}`,
              date: p.date,
              debit: p.amount,
              credit: 0,
              impact: -p.amount,
              dateObj: parseInvoiceDate(p.date)
            }))
          ]
          .sort((a, b) => b.dateObj - a.dateObj)
          .map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/20">
              <td className="px-5 py-3">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  row.type.startsWith('Sales') ? 'bg-emerald-55/10 text-emerald-605 text-emerald-600' : 'bg-rose-55/10 text-rose-600'
                }`}>
                  {row.type}
                </span>
              </td>
              <td className="px-5 py-3 font-bold text-slate-800">{row.id}</td>
              <td className="px-5 py-3 text-slate-700">{row.details}</td>
              <td className="px-5 py-3 text-slate-500">{row.date}</td>
              <td className="px-5 py-3 text-right text-rose-500 font-bold">
                {row.debit > 0 ? `₹${row.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
              </td>
              <td className="px-5 py-3 text-right text-emerald-600 font-bold">
                {row.credit > 0 ? `₹${row.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
              </td>
              <td className={`px-5 py-3 text-right font-black ${row.impact >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {row.impact >= 0 ? '+' : ''}₹{row.impact.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
          {filteredInvoices.length === 0 && filteredPurchases.length === 0 && (
            <tr>
              <td colSpan="7" className="px-5 py-6 text-center text-slate-400 italic">No operational transactions found in selected range.</td>
            </tr>
          )}
        </DataTable>
      )}

      {/* Export Action Button Pair */}
      <div className="flex gap-2.5 pt-2">
        <button 
          onClick={() => alert(`Exporting ${activeReportTab} Statement to PDF...`)}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs rounded-xl font-bold text-xs transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4 text-rose-500" />
          <span>Export PDF</span>
        </button>
        <button 
          onClick={() => alert(`Exporting ${activeReportTab} Statement to Excel...`)}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs rounded-xl font-bold text-xs transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export Excel</span>
        </button>
      </div>

    </div>
  );
}
