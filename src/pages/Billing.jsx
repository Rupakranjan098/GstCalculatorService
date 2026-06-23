import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Trash2,
  PlusCircle,
  MoreVertical,
  Download
} from 'lucide-react';
import StatusPill from '../components/StatusPill';

export default function Billing() {
  const {
    products,
    setProducts,
    customers,
    setCustomers,
    invoices,
    setInvoices,
    setActivityLogs,
    businessProfile,
    currentUser,
    setSelectedInvoiceForSummary,
    selectedInvoiceForSummary
  } = useOutletContext();

  const [activeActionMenu, setActiveActionMenu] = useState(null);

  // Form states
  const [billingCustomer, setBillingCustomer] = useState('c1'); 
  const [billingItems, setBillingItems] = useState([{ productId: 'p1', quantity: 2 }]); 
  const [billingStatus, setBillingStatus] = useState('Paid');

  // Inline Customer Creation Modal States
  const [showCustModal, setShowCustModal] = useState(false);
  const [custForm, setCustForm] = useState({
    name: '',
    email: '',
    phone: '',
    gstin: '',
    state: 'Delhi',
    stateCode: '07',
    address: ''
  });

  // Calculations for billing fields
  const calculationSummary = useMemo(() => {
    if (!billingCustomer) return { subtotal: 0, cgst: 0, sgst: 0, igst: 0, total: 0, itemsBreakdown: [] };
    const customer = customers.find(c => c.id === billingCustomer);
    if (!customer) return { subtotal: 0, cgst: 0, sgst: 0, igst: 0, total: 0, itemsBreakdown: [] };

    const isIntrastate = customer.state.toLowerCase() === businessProfile.state.toLowerCase();
    
    let subtotal = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    const itemsBreakdown = billingItems.map(item => {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) return { subtotal: 0, cgst: 0, sgst: 0, igst: 0, total: 0, price: 0 };
      
      const itemSubtotal = prod.basePrice * item.quantity;
      subtotal += itemSubtotal;

      const itemTax = (itemSubtotal * prod.gstRate) / 100;
      let itemCgst = 0;
      let itemSgst = 0;
      let itemIgst = 0;

      if (isIntrastate) {
        itemCgst = itemTax / 2;
        itemSgst = itemTax / 2;
        cgst += itemCgst;
        sgst += itemSgst;
      } else {
        itemIgst = itemTax;
        igst += itemIgst;
      }

      return {
        productId: prod.id,
        name: prod.name,
        quantity: item.quantity,
        price: prod.basePrice,
        gstRate: prod.gstRate,
        cgst: itemCgst,
        sgst: itemSgst,
        igst: itemIgst,
        total: itemSubtotal + itemTax
      };
    });

    return {
      subtotal,
      cgst,
      sgst,
      igst,
      total: subtotal + cgst + sgst + igst,
      itemsBreakdown
    };
  }, [billingCustomer, billingItems, customers, businessProfile, products]);

  const activeInvoice = useMemo(() => {
    if (selectedInvoiceForSummary) return selectedInvoiceForSummary;
    return invoices[0] || null;
  }, [invoices, selectedInvoiceForSummary]);

  const handleGenerateInvoice = () => {
    if (!billingCustomer) return;
    const customer = customers.find(c => c.id === billingCustomer);
    if (!customer) return;
    
    const invoiceNum = `INV/2026/${1000 + invoices.length + 1}`;
    
    const stockUpdates = products.map(p => {
      const billItem = billingItems.find(bi => bi.productId === p.id);
      if (billItem) {
        return { ...p, stock: Math.max(0, p.stock - billItem.quantity) };
      }
      return p;
    });

    if (stockUpdates) {
      setProducts(stockUpdates);
    }

    const newInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invoiceNum,
      customerName: customer.name,
      customerId: customer.id,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      items: calculationSummary.itemsBreakdown,
      subtotal: calculationSummary.subtotal,
      cgstTotal: calculationSummary.cgst,
      sgstTotal: calculationSummary.sgst,
      igstTotal: calculationSummary.igst,
      grandTotal: calculationSummary.total,
      status: billingStatus
    };

    setInvoices(prev => [newInvoice, ...prev]);
    setSelectedInvoiceForSummary(newInvoice);

    const newLog = {
      id: `log-${Date.now()}`,
      user: currentUser.name,
      role: currentUser.role,
      action: `Created Invoice ${invoiceNum}`,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      details: `Invoice for ${customer.name} worth ₹${calculationSummary.total.toLocaleString('en-IN')}`
    };
    setActivityLogs(prev => [newLog, ...prev]);

    setBillingItems([{ productId: 'p1', quantity: 1 }]);
  };

  const handleCreateCustomerInline = (e) => {
    e.preventDefault();
    const newId = `c-${Date.now()}`;
    const newCust = {
      ...custForm,
      id: newId
    };

    setCustomers(prev => [...prev, newCust]);
    setBillingCustomer(newId); // auto select

    const log = {
      id: `log-${Date.now()}`,
      user: currentUser.name,
      role: currentUser.role,
      action: `Added Customer ${custForm.name} (Billing Screen)`,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      details: `Registered client profile inline during billing`
    };
    setActivityLogs(prev => [log, ...prev]);

    setShowCustModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Form Panel: Left Card */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-slate-800 text-sm">New GST Invoice</h3>
              <span className="text-[9px] font-bold text-[#4F46E5] bg-[#F1F3FF] px-2.5 py-1 rounded-full">
                Billed From: {businessProfile.state} ({businessProfile.stateCode})
              </span>
            </div>

            {/* Customer Selector */}
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Select Customer</label>
                <button
                  onClick={() => {
                    setCustForm({ name: '', email: '', phone: '', gstin: '', state: 'Delhi', stateCode: '07', address: '' });
                    setShowCustModal(true);
                  }}
                  className="text-[10px] font-bold text-[#4F46E5] hover:underline cursor-pointer"
                >
                  + Register Client
                </button>
              </div>
              <select
                value={billingCustomer}
                onChange={(e) => setBillingCustomer(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-705 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all"
              >
                <option value="">-- Choose Customer --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.gstin ? `(${c.gstin})` : ''} - {c.state}
                  </option>
                ))}
              </select>
            </div>

            {/* Line Items */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Line Items</label>
                <button
                  onClick={() => setBillingItems([...billingItems, { productId: '', quantity: 1 }])}
                  className="text-[10px] font-bold text-[#4F46E5] hover:underline flex items-center gap-0.5"
                >
                  + Add Row
                </button>
              </div>

              <div className="space-y-2">
                {billingItems.map((item, index) => {
                  const currentProd = products.find(p => p.id === item.productId);
                  return (
                    <div key={index} className="flex gap-2 items-center bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                      <select
                        value={item.productId}
                        onChange={(e) => {
                          const next = [...billingItems];
                          next[index].productId = e.target.value;
                          setBillingItems(next);
                        }}
                        className="flex-1 min-w-0 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
                      >
                        <option value="">-- Select Product --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.stock} left)</option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const next = [...billingItems];
                          next[index].quantity = Math.max(1, parseInt(e.target.value) || 1);
                          setBillingItems(next);
                        }}
                        className="w-12 px-1 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center text-slate-700 focus:outline-none"
                      />

                      <div className="w-20 text-right text-xs font-semibold text-slate-500">
                        ₹{currentProd ? currentProd.basePrice.toLocaleString('en-IN') : '0.00'}
                      </div>

                      <div className="w-24 text-right text-xs font-bold text-slate-800">
                        ₹{currentProd ? (currentProd.basePrice * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
                      </div>

                      <button
                        onClick={() => {
                          if (billingItems.length > 1) {
                            setBillingItems(billingItems.filter((_, idx) => idx !== index));
                          }
                        }}
                        className="p-1 hover:text-rose-500 text-slate-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cost cards breakdown */}
          <div className="space-y-5 mt-4">
            <div className="grid grid-cols-4 gap-2.5">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                <span className="text-[9px] font-bold text-slate-400 block uppercase">Subtotal</span>
                <span className="text-[11px] font-extrabold text-slate-700">
                  ₹{calculationSummary.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                <span className="text-[9px] font-bold text-slate-400 block uppercase">CGST</span>
                <span className="text-[11px] font-extrabold text-slate-700">
                  ₹{calculationSummary.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                <span className="text-[9px] font-bold text-slate-400 block uppercase">SGST / IGST</span>
                <span className="text-[11px] font-extrabold text-slate-700">
                  ₹{(calculationSummary.sgst + calculationSummary.igst).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-100 text-center">
                <span className="text-[9px] font-bold text-[#4F46E5] block uppercase">Total Amount</span>
                <span className="text-[11px] font-black text-[#4F46E5]">
                  ₹{calculationSummary.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Payment Status + Action buttons */}
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Payment Status:</span>
                <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-[10px]">
                  <button
                    onClick={() => setBillingStatus('Paid')}
                    className={`px-3 py-1 rounded-md font-bold transition-all ${
                      billingStatus === 'Paid' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-400'
                    }`}
                  >
                    Paid
                  </button>
                  <button
                    onClick={() => setBillingStatus('Unpaid')}
                    className={`px-3 py-1 rounded-md font-bold transition-all ${
                      billingStatus === 'Unpaid' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-400'
                    }`}
                  >
                    Unpaid
                  </button>
                </div>
              </div>

              <button
                onClick={handleGenerateInvoice}
                className="px-4 py-2 bg-[#4F46E5] hover:bg-[#3F37C9] text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-150 transition-all cursor-pointer"
              >
                Generate Invoice & Update Stock
              </button>
            </div>
          </div>

        </div>

        {/* Summary Panel: Right Card */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm mb-4">Invoice Summary</h3>
            
            {activeInvoice ? (
              <div className="space-y-2.5 text-xs pb-4 border-b border-slate-50">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Invoice No.</span>
                  <span className="font-bold text-slate-800">{activeInvoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Invoice Date</span>
                  <span className="font-bold text-slate-800">{activeInvoice.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Customer</span>
                  <span className="font-bold text-slate-800">{activeInvoice.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Total Amount</span>
                  <span className="font-bold text-slate-800">₹{activeInvoice.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">Payment Status</span>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                    activeInvoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/10' : 'bg-amber-50 text-amber-600 border border-amber-100/10'
                  }`}>
                    {activeInvoice.status}
                  </span>
                </div>
                <div className="pt-3.5 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print / Save PDF</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-center py-6">No invoices created.</div>
            )}
          </div>

          <div className="pt-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Past Invoices ({invoices.length})</span>
            <div className="space-y-2 max-h-[160px] overflow-y-auto">
              {invoices.slice(0, 3).map((inv, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedInvoiceForSummary(inv)}
                  className="p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50/50 cursor-pointer flex items-center justify-between text-xs transition-all"
                >
                  <div>
                    <p className="font-bold text-slate-800 leading-none">{inv.invoiceNumber}</p>
                    <p className="text-[9px] text-slate-400 mt-1">{inv.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-700">₹{inv.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{inv.customerName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Invoice list table at the bottom */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50">
          <h3 className="font-extrabold text-slate-805 text-sm">Recent Invoices</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3.5">Invoice No.</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
              {invoices.map((inv, idx) => (
                <tr key={idx} className="hover:bg-slate-50/20">
                  <td className="px-5 py-3 font-bold text-slate-800">{inv.invoiceNumber}</td>
                  <td className="px-5 py-3 text-slate-800">{inv.customerName}</td>
                  <td className="px-5 py-3">{inv.date}</td>
                  <td className="px-5 py-3 font-bold text-slate-800">
                    ₹{inv.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill value={inv.status} />
                  </td>
                  <td className="px-5 py-3 text-slate-400 relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveActionMenu(activeActionMenu === inv.id ? null : inv.id);
                      }}
                      className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {activeActionMenu === inv.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setActiveActionMenu(null)}
                        />
                        <div className="absolute right-5 mt-1 w-36 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 z-20 text-xs font-semibold text-slate-700">
                          <button
                            onClick={() => {
                              setSelectedInvoiceForSummary(inv);
                              setActiveActionMenu(null);
                              setTimeout(() => {
                                window.print();
                              }, 100);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-400" />
                            Print Invoice
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete invoice ${inv.invoiceNumber}?`)) {
                                setInvoices(prev => prev.filter(item => item.id !== inv.id));
                                const log = {
                                  id: `log-${Date.now()}`,
                                  user: currentUser.name,
                                  role: currentUser.role,
                                  action: `Deleted Invoice ${inv.invoiceNumber}`,
                                  timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
                                  details: `Invoice for ${inv.customerName} worth ₹${inv.grandTotal.toLocaleString('en-IN')} was deleted.`
                                };
                                setActivityLogs(prev => [log, ...prev]);
                                setActiveActionMenu(null);
                              }
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 hover:text-rose-700 flex items-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            Delete Invoice
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inline Customer Registration Modal */}
      {showCustModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100 font-sans">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center font-bold text-xs text-slate-700">
              <span>Register New Client</span>
              <button onClick={() => setShowCustModal(false)} className="text-slate-455 hover:text-slate-700 text-base font-extrabold cursor-pointer">×</button>
            </div>
            
            <form onSubmit={handleCreateCustomerInline} className="p-5 space-y-4 text-xs font-semibold text-slate-600">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer Name</label>
                <input
                  type="text"
                  required
                  value={custForm.name}
                  onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={custForm.email}
                    onChange={(e) => setCustForm({ ...custForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={custForm.phone}
                    onChange={(e) => setCustForm({ ...custForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GSTIN Identification</label>
                  <input
                    type="text"
                    placeholder="e.g. 07ABCDE1234A1Z1"
                    value={custForm.gstin}
                    onChange={(e) => setCustForm({ ...custForm, gstin: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">State Location</label>
                  <input
                    type="text"
                    required
                    value={custForm.state}
                    onChange={(e) => setCustForm({ ...custForm, state: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Postal Address</label>
                <textarea
                  required
                  rows="2"
                  value={custForm.address}
                  onChange={(e) => setCustForm({ ...custForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#4F46E5] hover:bg-[#3F37C9] text-white rounded-xl font-bold shadow-md transition-colors cursor-pointer"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
