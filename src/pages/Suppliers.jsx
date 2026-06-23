import React from 'react';
import { useOutletContext } from 'react-router-dom';
import ExpandableRow from '../components/ExpandableRow';

export default function Suppliers() {
  const { suppliers } = useOutletContext();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs">
        <h3 className="font-extrabold text-slate-800 text-sm">Supplier Records</h3>
        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Click any supplier row to view purchase orders and outward liabilities.</p>
      </div>

      {/* Suppliers Table */}
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
              {suppliers.map((s, idx) => {
                const ledgerBalance = s.purchases?.reduce((acc, curr) => {
                  return curr.status === 'Unpaid' ? acc + curr.amount : acc;
                }, 0) || 0;

                return (
                  <ExpandableRow
                    key={s.id}
                    colSpan={5}
                    renderMainRow={(isExpanded) => (
                      <>
                        <td className="px-5 py-3">
                          <div className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center font-bold text-xs">
                            {s.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-slate-800 font-bold">
                          <div>{s.name}</div>
                          <div className="text-[9px] text-slate-400 font-semibold mt-0.5">{s.email}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-500 font-semibold">{s.phone}</td>
                        <td className="px-5 py-3 font-mono text-slate-450">{s.gstin}</td>
                        <td className={`px-5 py-3 text-right font-bold ${
                          ledgerBalance > 0 ? 'text-rose-500' : 'text-emerald-600'
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
                        <h4 className="font-extrabold text-[9px] text-slate-400 uppercase tracking-widest mb-2.5">Procurement History</h4>
                        <table className="w-full text-left text-xs bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
                          <thead>
                            <tr className="bg-slate-50/50 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                              <th className="px-4 py-2.5">PO Number</th>
                              <th className="px-4 py-2.5">Date</th>
                              <th className="px-4 py-2.5 text-right">Amount</th>
                              <th className="px-4 py-2.5 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                            {s.purchases?.map((p, pIdx) => (
                              <tr key={pIdx}>
                                <td className="px-4 py-2.5 font-bold text-[#4F46E5]">{p.purchaseNo}</td>
                                <td className="px-4 py-2.5 text-slate-400">{p.date}</td>
                                <td className="px-4 py-2.5 text-right text-slate-800 font-bold">
                                  ₹{p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                    p.status === 'Paid' ? 'bg-emerald-55/10 text-emerald-600' : 'bg-amber-55/10 text-amber-600'
                                  }`}>
                                    {p.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            {(!s.purchases || s.purchases.length === 0) && (
                              <tr>
                                <td colSpan="4" className="px-4 py-4 text-center text-slate-400 italic">No purchase history.</td>
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
