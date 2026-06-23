import React, { useState, useEffect, useMemo } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Outlet,
  Link,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Package,
  Users,
  Truck,
  Warehouse,
  BarChart3,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  MoreVertical,
  AlertCircle,
  PlusCircle,
  FolderPlus,
  X,
  Download,
  Calendar
} from 'lucide-react';

import { apiService } from './services/api';

// Pages
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<LayoutShell />}>
          <Route index element={<Dashboard />} />
          <Route path="billing" element={<Billing />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />}>
            <Route path="profile" element={<Settings />} />
            <Route path="tax" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

function LayoutShell() {
  const location = useLocation();
  const navigate = useNavigate();

  // Route guarding: check active authentication session
  const activeSessionUser = apiService.getCurrentUser();
  if (!activeSessionUser) {
    return <Navigate to="/login" replace />;
  }

  // Root States loaded from localStorage (via apiService)
  const [currentUser, setCurrentUser] = useState(() => activeSessionUser);
  const [businessProfile, setBusinessProfile] = useState(() => apiService.getBusinessProfile());
  const [products, setProducts] = useState(() => apiService.getProducts());
  const [customers, setCustomers] = useState(() => apiService.getCustomers());
  const [suppliers, setSuppliers] = useState(() => apiService.getSuppliers());
  const [invoices, setInvoices] = useState(() => apiService.getInvoices());
  const [activityLogs, setActivityLogs] = useState(() => apiService.getActivityLogs());
  const [selectedInvoiceForSummary, setSelectedInvoiceForSummary] = useState(null);

  // Alerts state
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Low Stock: USB-C Fast Charging Hub (8 left)' },
    { id: 2, type: 'info', message: 'GST Filing Deadline for GSTR-1 is in 4 days.' }
  ]);

  // Sync back to localStorage
  useEffect(() => { apiService.saveBusinessProfile(businessProfile); }, [businessProfile]);
  useEffect(() => { apiService.saveProducts(products); }, [products]);
  useEffect(() => { apiService.saveCustomers(customers); }, [customers]);
  useEffect(() => { apiService.saveSuppliers(suppliers); }, [suppliers]);
  useEffect(() => { apiService.saveInvoices(invoices); }, [invoices]);
  useEffect(() => { apiService.saveActivityLogs(activityLogs); }, [activityLogs]);

  // Sync default invoice summary selected on invoices update
  const activeInvoice = useMemo(() => {
    if (selectedInvoiceForSummary) return selectedInvoiceForSummary;
    return invoices[0] || null;
  }, [invoices, selectedInvoiceForSummary]);

  // Calculate Title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/billing')) return 'Billing';
    if (path.startsWith('/products')) return 'Products';
    if (path.startsWith('/customers')) return 'Customers';
    if (path.startsWith('/suppliers')) return 'Suppliers';
    if (path.startsWith('/inventory')) return 'Inventory';
    if (path.startsWith('/reports')) return 'Reports';
    if (path.startsWith('/settings')) return 'Settings';
    return 'Dashboard';
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Billing', path: '/billing', icon: Receipt },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Suppliers', path: '/suppliers', icon: Truck },
    { name: 'Inventory', path: '/inventory', icon: Warehouse },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings/profile', icon: SettingsIcon },
  ];

  return (
    <div className="h-screen w-screen bg-white flex overflow-hidden select-none font-sans">
      
      {/* ==========================================
          COLUMN 1: RESPONSIVE SIDEBAR
          - Collapses to 72px rail below 1024px
          - Full width 260px at 1024px (lg) and above
          ========================================== */}
      <aside className="w-[72px] lg:w-[260px] h-full bg-white flex flex-col justify-between border-r border-slate-100 shrink-0 transition-all duration-300">
        <div>
          {/* Logo Area */}
          <div className="p-4 lg:p-6 pb-8 flex items-center gap-3 justify-center lg:justify-start">
            <div className="w-9 h-9 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
              <span className="font-extrabold text-sm">%</span>
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="font-black text-slate-800 tracking-tight text-base leading-none">GST BILL</span>
              <span className="text-[9px] font-bold text-[#4F46E5] tracking-widest mt-0.5">INVENTORY</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-2 lg:px-3 space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              // Handle active checks for setting subroutes
              const isSettingsItem = item.name === 'Settings';
              const isPathActive = location.pathname === item.path || 
                (isSettingsItem && location.pathname.startsWith('/settings'));

              return (
                <div key={item.name} className="space-y-1">
                  <Link
                    to={item.path}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all relative ${
                      isPathActive
                        ? 'text-[#4F46E5] bg-[#F1F3FF]'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    } justify-center lg:justify-start`}
                  >
                    {isPathActive && (
                      <div className="absolute left-0 top-3 bottom-3 w-[3.5px] rounded-r-full bg-[#4F46E5]" />
                    )}
                    <IconComponent className={`w-4.5 h-4.5 ${isPathActive ? 'text-[#4F46E5]' : 'text-slate-400'}`} />
                    <span className="hidden lg:inline">{item.name}</span>
                  </Link>

                  {/* Settings submenus nested - visible only on LG screens */}
                  {isSettingsItem && isPathActive && (
                    <div className="hidden lg:block pl-11.5 space-y-2 pt-1 pb-2">
                      {[
                        { key: 'profile', label: 'Business Profile', path: '/settings/profile' },
                        { key: 'tax', label: 'Tax Settings', path: '/settings/tax' }
                      ].map(sub => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <Link
                            key={sub.key}
                            to={sub.path}
                            className={`w-full text-left text-[11px] font-bold block transition-all ${
                              isSubActive ? 'text-[#4F46E5]' : 'text-slate-450 hover:text-slate-700'
                            }`}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* User Selector Block */}
        <div className="p-3 lg:p-4 border-t border-slate-50 bg-[#F8FAFC]/55 m-2 lg:m-3 rounded-2xl text-left">
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <div className="w-9 h-9 rounded-full bg-[#E0E7FF] flex items-center justify-center text-[#4F46E5] font-extrabold text-xs shrink-0">
              {currentUser ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'VM'}
            </div>
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-[11px] font-extrabold text-slate-800 leading-none truncate">{currentUser?.name}</p>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] font-bold text-[#4F46E5]">{currentUser?.role} Role</span>
                <button
                  onClick={() => {
                    apiService.logout();
                    navigate('/login');
                    window.location.reload();
                  }}
                  className="text-[9.5px] font-extrabold text-rose-500 hover:text-rose-700 hover:underline cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ==========================================
          COLUMN 2: MAIN PANEL CONTENT
          ========================================== */}
      <main className="flex-1 h-full bg-[#F8FAFC]/40 p-6 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[26px] font-black text-slate-900 tracking-tight">{getPageTitle()}</h1>
        </div>

        {/* Outlet routing rendering */}
        <div className="flex-1">
          <Outlet context={{
            currentUser,
            setCurrentUser,
            businessProfile,
            setBusinessProfile,
            products,
            setProducts,
            customers,
            setCustomers,
            suppliers,
            setSuppliers,
            invoices,
            setInvoices,
            activityLogs,
            setActivityLogs,
            selectedInvoiceForSummary,
            setSelectedInvoiceForSummary
          }} />
        </div>
      </main>



      {/* Invoice PDF Print Template (A4 Layout) */}
      {activeInvoice && (() => {
        const invoiceCustomer = customers.find(c => c.id === activeInvoice.customerId) || {
          name: activeInvoice.customerName,
          phone: '',
          gstin: '',
          state: 'Delhi',
          address: 'Walk-in Retail Customer'
        };
        return (
          <div className="print-area hidden print:block bg-white text-slate-850 font-sans w-[210mm] min-h-[297mm] p-12 mx-auto text-[11px] leading-relaxed">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-5 mb-5">
              {/* Logo Left */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white font-extrabold text-lg">
                  %
                </div>
                <div>
                  <p className="font-black text-slate-900 text-xs tracking-tight">APEX GST</p>
                  <p className="text-[8px] font-bold text-[#4F46E5] uppercase tracking-widest">Billing & Inventory</p>
                </div>
              </div>

              {/* Company Info Right */}
              <div className="text-right space-y-0.5">
                <h2 className="font-extrabold text-slate-900 text-xs">{businessProfile.name}</h2>
                <p className="text-slate-500 text-[9.5px]"><span className="font-bold text-slate-700">GSTIN:</span> {businessProfile.gstin}</p>
                <p className="text-slate-500 text-[9.5px] max-w-[240px] ml-auto">{businessProfile.address}</p>
                <p className="text-slate-500 text-[9.5px]">{businessProfile.phone} | {businessProfile.email}</p>
              </div>
            </div>

            {/* Invoice Meta details */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">Bill To:</span>
                <p className="font-black text-slate-900 text-xs mt-1">{invoiceCustomer.name}</p>
                <p className="text-slate-550 text-[9.5px] max-w-[240px]">{invoiceCustomer.address}</p>
                {invoiceCustomer.phone && <p className="text-slate-500 text-[9.5px]"><span className="font-semibold text-slate-700">Phone:</span> {invoiceCustomer.phone}</p>}
                {invoiceCustomer.gstin ? (
                  <p className="text-slate-550 text-[9.5px] mt-0.5"><span className="font-bold text-slate-755">GSTIN:</span> {invoiceCustomer.gstin}</p>
                ) : (
                  <p className="text-slate-400 italic text-[9px] mt-0.5">Retail Cash Sale (Unregistered)</p>
                )}
              </div>

              <div className="text-right space-y-1">
                <div>
                  <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">Invoice Details</span>
                  <p className="font-black text-slate-950 text-xs mt-0.5">{activeInvoice.invoiceNumber}</p>
                </div>
                <p className="text-slate-500 text-[9.5px]"><span className="font-semibold text-slate-700">Date:</span> {activeInvoice.date}</p>
                
                <div className="mt-1">
                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-[8.5px] font-black uppercase ${
                    activeInvoice.status === 'Paid' ? 'bg-emerald-55/10 text-emerald-700 border border-emerald-200/20' : 'bg-amber-55/10 text-amber-700 border border-amber-200/20'
                  }`}>
                    {activeInvoice.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-left border-collapse mb-6 text-[10.5px]">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-50/50 text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-2 px-2.5">Product Description</th>
                  <th className="py-2 px-2.5">HSN</th>
                  <th className="py-2 px-2.5 text-right">Qty</th>
                  <th className="py-2 px-2.5 text-right">Rate</th>
                  <th className="py-2 px-2.5 text-right">GST%</th>
                  <th className="py-2 px-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {activeInvoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/10">
                    <td className="py-2.5 px-2.5 font-bold text-slate-800">
                      {item.name}
                    </td>
                    <td className="py-2.5 px-2.5 font-mono text-slate-500 text-[9.5px]">{item.hsn}</td>
                    <td className="py-2.5 px-2.5 text-right">{item.quantity}</td>
                    <td className="py-2.5 px-2.5 text-right">₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2.5 px-2.5 text-right">{item.gstRate}%</td>
                    <td className="py-2.5 px-2.5 text-right font-bold text-slate-900">₹{item.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals & Notes */}
            <div className="flex justify-between items-start pt-2">
              <div className="w-[48%] text-[9.5px] text-slate-400 space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <p className="font-extrabold text-slate-500 uppercase tracking-wider text-[8.5px] mb-1">Terms & Conditions</p>
                <p>1. Goods once sold will not be taken back or exchanged.</p>
                <p>2. Subject to local state jurisdiction regulations only.</p>
                <p>3. Standard payment modes: Bank Transfer, UPI, Credit Card.</p>
              </div>

              <div className="w-[38%] space-y-1.5 text-slate-600 text-[10px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-800">₹{activeInvoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Discount:</span>
                  <span>₹0.00</span>
                </div>
                {activeInvoice.cgstTotal > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>CGST:</span>
                    <span>₹{activeInvoice.cgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {activeInvoice.sgstTotal > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>SGST:</span>
                    <span>₹{activeInvoice.sgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {activeInvoice.igstTotal > 0 && (
                  <div className="flex justify-between text-[#4F46E5] font-semibold">
                    <span>IGST:</span>
                    <span>₹{activeInvoice.igstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-2 text-slate-900 font-black text-xs leading-none">
                  <span>Grand Total:</span>
                  <span>₹{activeInvoice.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Footer Centered */}
            <div className="mt-14 pt-5 border-t border-slate-100 text-center">
              <p className="font-black text-slate-800 text-[10px] mb-0.5">Thank you for your business!</p>
              <p className="text-slate-400 text-[8.5px]">If you have any questions about this invoice, please contact us at {businessProfile.email}</p>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
