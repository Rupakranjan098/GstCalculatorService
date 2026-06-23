import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import ExpandableRow from '../components/ExpandableRow';

export default function Suppliers() {
  const { 
    suppliers, 
    setSuppliers,
    setActivityLogs,
    currentUser
  } = useOutletContext();

  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  // Form fields
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    email: '',
    phone: '',
    gstin: '',
    state: 'Delhi',
    stateCode: '07',
    address: ''
  });

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setSupplierForm({ name: '', email: '', phone: '', gstin: '', state: 'Delhi', stateCode: '07', address: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (e, s) => {
    e.stopPropagation(); // prevent expandable row toggle
    setEditingSupplier(s);
    setSupplierForm({ ...s });
    setShowModal(true);
  };

  const handleDelete = (e, s) => {
    e.stopPropagation(); // prevent expandable row toggle
    if (confirm("Delete supplier " + s.name + "?")) {
      setSuppliers(prev => prev.filter(item => item.id !== s.id));
      const log = {
        id: `log-${Date.now()}`,
        user: currentUser.name,
        role: currentUser.role,
        action: `Deleted Supplier ${s.name}`,
        timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        details: `Removed procurement account for ${s.name}`
      };
      setActivityLogs(prev => [log, ...prev]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSupplier) {
      setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? { ...s, ...supplierForm } : s));
      const log = {
        id: `log-${Date.now()}`,
        user: currentUser.name,
        role: currentUser.role,
        action: `Modified Supplier ${supplierForm.name}`,
        timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        details: `Updated registry details for ${supplierForm.name}`
      };
      setActivityLogs(prev => [log, ...prev]);
    } else {
      const newSupp = {
        ...supplierForm,
        id: `s-${Date.now()}`,
        purchases: []
      };
      setSuppliers(prev => [...prev, newSupp]);
      const log = {
        id: `log-${Date.now()}`,
        user: currentUser.name,
        role: currentUser.role,
        action: `Added Supplier ${supplierForm.name}`,
        timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        details: `Registered new vendor profile for ${supplierForm.name}`
      };
      setActivityLogs(prev => [log, ...prev]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs flex justify-between items-center">
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm">Supplier Records</h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Click any supplier row to view purchase orders and outward liabilities.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-150 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Supplier
        </button>
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
                <th className="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
              {suppliers.map((s) => {
                const ledgerBalance = s.purchases?.reduce((acc, curr) => {
                  return curr.status === 'Unpaid' ? acc + curr.amount : acc;
                }, 0) || 0;

                return (
                  <ExpandableRow
                    key={s.id}
                    colSpan={6}
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
                          ledgerBalance > 0 ? 'text-rose-500' : 'text-emerald-650'
                        }`}>
                          {ledgerBalance > 0 
                            ? `₹${ledgerBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` 
                            : 'Settled'
                          }
                        </td>
                        <td className="px-5 py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={(e) => handleOpenEdit(e, s)}
                              className="p-1 hover:bg-slate-100 text-[#4F46E5] rounded-lg cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, s)}
                              className="p-1 hover:bg-rose-50 text-rose-500 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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

      {/* Supplier Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100 font-sans">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center font-bold text-xs text-slate-700">
              <span>{editingSupplier ? 'Edit Supplier Details' : 'Add New Supplier'}</span>
              <button onClick={() => setShowModal(false)} className="text-slate-455 hover:text-slate-700 text-base font-extrabold cursor-pointer">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-semibold text-slate-600">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Supplier Name</label>
                <input
                  type="text"
                  required
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={supplierForm.email}
                    onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GSTIN Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 07SUPPL6666F6Z6"
                    value={supplierForm.gstin}
                    onChange={(e) => setSupplierForm({ ...supplierForm, gstin: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">State Location</label>
                  <input
                    type="text"
                    required
                    value={supplierForm.state}
                    onChange={(e) => setSupplierForm({ ...supplierForm, state: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Postal Address</label>
                <textarea
                  required
                  rows="2"
                  value={supplierForm.address}
                  onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#4F46E5] hover:bg-[#3F37C9] text-white rounded-xl font-bold shadow-md transition-colors cursor-pointer"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
