import React from 'react';
import { useOutletContext } from 'react-router-dom';
import ExpandableRow from '../components/ExpandableRow';

export default function Customers() {
  const { customers, invoices } = useOutletContext();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs">
        <h3 className="font-extrabold text-slate-800 text-sm">Customer Database</h3>
        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Click any customer row to view their transaction ledger details.</p>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC]/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3.5 w-12">Avatar</th>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">GSTIN</th>
                <th className="px-5 py-3.5 text-right">Ledger Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
              {customers.map((c, idx) => {
                const customerInvoices = invoices.filter(inv => inv.customerId === c.id);
                const ledgerBalance = customerInvoices.reduce((acc, curr) => {
                  return curr.status === 'Unpaid' ? acc + curr.grandTotal : acc;
                }, 0);

                return (
                  <ExpandableRow
                    key={c.id}
                    colSpan={5}
                    renderMainRow={(isExpanded) => (
                      <>
                        <td className="px-5 py-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold text-xs">
                            {c.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-slate-800 font-bold">
                          <div>{c.name}</div>
                          <div className="text-[9px] text-slate-400 font-semibold mt-0.5">{c.email}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-500 font-semibold">{c.phone}</td>
                        <td className="px-5 py-3 font-mono text-slate-450">
                          {c.gstin || <span className="text-slate-300 italic">Unregistered Retail</span>}
                        </td>
                        <td className={`px-5 py-3 text-right font-bold ${
                          ledgerBalance > 0 ? 'text-rose-500' : 'text-emerald-650'
                        }`}>
                          {ledgerBalance > 0 
                            ? `₹${ledgerBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` 
                            : 'Settled'
                          }
                        </td>
                      </>
                    )}
                    renderExpandedContent={() => (
                      <div className="max-w-3xl">
                        <h4 className="font-extrabold text-[9px] text-slate-400 uppercase tracking-widest mb-2.5">Invoice History</h4>
                        <table className="w-full text-left text-xs bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
                          <thead>
                            <tr className="bg-slate-50/50 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                              <th className="px-4 py-2.5">Invoice No</th>
                              <th className="px-4 py-2.5">Date</th>
                              <th className="px-4 py-2.5">Amount</th>
                              <th className="px-4 py-2.5">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                            {customerInvoices.map((inv, iIdx) => (
                              <tr key={iIdx}>
                                <td className="px-4 py-2.5 font-bold text-[#4F46E5]">{inv.invoiceNumber}</td>
                                <td className="px-4 py-2.5 text-slate-400">{inv.date}</td>
                                <td className="px-4 py-2.5 text-slate-800">
                                  ₹{inv.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-4 py-2.5">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                    inv.status === 'Paid' ? 'bg-emerald-55/10 text-emerald-600' : 'bg-amber-55/10 text-amber-600'
                                  }`}>
                                    {inv.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            {customerInvoices.length === 0 && (
                              <tr>
                                <td colSpan="4" className="px-4 py-4 text-center text-slate-400 italic">No transaction history.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
