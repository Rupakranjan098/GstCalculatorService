import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import ExpandableRow from '../components/ExpandableRow';

export default function Customers() {
  const { 
    customers, 
    setCustomers, 
    invoices,
    setActivityLogs,
    currentUser
  } = useOutletContext();

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Form fields
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    gstin: '',
    state: 'Delhi',
    stateCode: '07',
    address: ''
  });

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setCustomerForm({ name: '', email: '', phone: '', gstin: '', state: 'Delhi', stateCode: '07', address: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (e, c) => {
    e.stopPropagation(); // prevent expandable row toggle
    setEditingCustomer(c);
    setCustomerForm({ ...c });
    setShowModal(true);
  };

  const handleDelete = (e, c) => {
    e.stopPropagation(); // prevent expandable row toggle
    if (confirm("Delete customer " + c.name + "?")) {
      setCustomers(prev => prev.filter(item => item.id !== c.id));
      const log = {
        id: `log-${Date.now()}`,
        user: currentUser.name,
        role: currentUser.role,
        action: `Deleted Customer ${c.name}`,
        timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        details: `Removed client account for ${c.name}`
      };
      setActivityLogs(prev => [log, ...prev]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...c, ...customerForm } : c));
      const log = {
        id: `log-${Date.now()}`,
        user: currentUser.name,
        role: currentUser.role,
        action: `Modified Customer ${customerForm.name}`,
        timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        details: `Updated registry details for ${customerForm.name}`
      };
      setActivityLogs(prev => [log, ...prev]);
    } else {
      const newCust = {
        ...customerForm,
        id: `c-${Date.now()}`
      };
      setCustomers(prev => [...prev, newCust]);
      const log = {
        id: `log-${Date.now()}`,
        user: currentUser.name,
        role: currentUser.role,
        action: `Added Customer ${customerForm.name}`,
        timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        details: `Registered new account for ${customerForm.name}`
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
          <h3 className="font-extrabold text-slate-800 text-sm">Customer Database</h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Click any customer row to view their transaction ledger details.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-150 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Customer
        </button>
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
                <th className="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
              {customers.map((c) => {
                const customerInvoices = invoices.filter(inv => inv.customerId === c.id);
                const ledgerBalance = customerInvoices.reduce((acc, curr) => {
                  return curr.status === 'Unpaid' ? acc + curr.grandTotal : acc;
                }, 0);

                return (
                  <ExpandableRow
                    key={c.id}
                    colSpan={6}
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
                        <td className="px-5 py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={(e) => handleOpenEdit(e, c)}
                              className="p-1 hover:bg-slate-100 text-[#4F46E5] rounded-lg cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, c)}
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

      {/* Customer Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100 font-sans">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center font-bold text-xs text-slate-700">
              <span>{editingCustomer ? 'Edit Customer Details' : 'Add New Customer'}</span>
              <button onClick={() => setShowModal(false)} className="text-slate-450 hover:text-slate-700 text-base font-extrabold cursor-pointer">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-semibold text-slate-600">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer Name</label>
                <input
                  type="text"
                  required
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GSTIN Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 07AAAAA1111A1Z1"
                    value={customerForm.gstin}
                    onChange={(e) => setCustomerForm({ ...customerForm, gstin: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">State Location</label>
                  <input
                    type="text"
                    required
                    value={customerForm.state}
                    onChange={(e) => setCustomerForm({ ...customerForm, state: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Postal Address</label>
                <textarea
                  required
                  rows="2"
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
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
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
