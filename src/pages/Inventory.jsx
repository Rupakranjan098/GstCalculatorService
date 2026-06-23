import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import StatusPill from '../components/StatusPill';

export default function Inventory() {
  const {
    products,
    setProducts,
    setActivityLogs,
    currentUser
  } = useOutletContext();

  const [showAdjustStockModal, setShowAdjustStockModal] = useState(false);
  const [adjustingProductId, setAdjustingProductId] = useState(null);
  const [adjustStockQty, setAdjustStockQty] = useState('');
  const [adjustStockReason, setAdjustStockReason] = useState('Manual Correction');

  const handleOpenAdjust = (p) => {
    setAdjustingProductId(p.id);
    setAdjustStockQty('');
    setAdjustStockReason('Manual Correction');
    setShowAdjustStockModal(true);
  };

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    const qtyVal = parseInt(adjustStockQty, 10);
    if (isNaN(qtyVal)) return;

    const product = products.find(p => p.id === adjustingProductId);
    if (!product) return;

    const newStock = Math.max(0, product.stock + qtyVal);
    const isAddition = qtyVal >= 0;

    // Update product stock and last restocked date
    setProducts(prev => prev.map(p => 
      p.id === adjustingProductId 
        ? { 
            ...p, 
            stock: newStock,
            lastRestocked: isAddition ? new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : p.lastRestocked
          } 
        : p
    ));

    // Log the manual operation
    const log = {
      id: `log-${Date.now()}`,
      user: currentUser.name,
      role: currentUser.role,
      action: `${isAddition ? 'Stock Inward' : 'Stock Outward'} (Manual)`,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      details: `${isAddition ? 'Added' : 'Removed'} ${Math.abs(qtyVal)} units of ${product.name} (Reason: ${adjustStockReason})`
    };
    setActivityLogs(prev => [log, ...prev]);

    setShowAdjustStockModal(false);
  };

  const selectedProduct = products.find(p => p.id === adjustingProductId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs">
        <h3 className="font-extrabold text-slate-800 text-sm">Inventory Levels</h3>
        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Audit quantities and manually log inward/outward adjustments.</p>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC]/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Current Stock</th>
                <th className="px-5 py-3.5">Low Stock Threshold</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Last Restocked</th>
                <th className="px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
              {products.map((p, idx) => {
                const isLowStock = p.stock <= p.minStock;
                return (
                  <tr key={idx} className="hover:bg-slate-50/20">
                    <td className="px-5 py-3 font-bold text-slate-800">
                      <div>{p.name}</div>
                      <div className="text-[9px] text-slate-400 font-semibold mt-0.5">{p.sku}</div>
                    </td>
                    <td className="px-5 py-3 font-bold text-slate-700">{p.stock} {p.unit}</td>
                    <td className="px-5 py-3 text-slate-400">{p.minStock} {p.unit}</td>
                    <td className="px-5 py-3">
                      <StatusPill value={isLowStock ? 'Low Stock' : 'In Stock'} />
                    </td>
                    <td className="px-5 py-3 text-slate-500 font-medium">{p.lastRestocked || 'N/A'}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleOpenAdjust(p)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {showAdjustStockModal && selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100 font-sans">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center font-bold text-xs text-slate-700">
              <span>Adjust Inventory Stock</span>
              <button 
                onClick={() => setShowAdjustStockModal(false)} 
                className="text-slate-450 hover:text-slate-700 text-base font-extrabold cursor-pointer"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAdjustSubmit} className="p-5 space-y-4 text-xs font-semibold text-slate-600">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Product to Adjust
                </label>
                <p className="text-slate-800 font-bold text-xs">
                  {selectedProduct.name} ({selectedProduct.sku})
                </p>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Current Stock: {selectedProduct.stock} {selectedProduct.unit}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quantity Adjustment (+/-)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 10 or -5"
                  value={adjustStockQty}
                  onChange={(e) => setAdjustStockQty(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
                <span className="text-[9px] text-slate-400 font-medium block">Use positive value to add stock, negative to subtract.</span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Reason for Adjustment
                </label>
                <select
                  value={adjustStockReason}
                  onChange={(e) => setAdjustStockReason(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-750 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                >
                  <option value="Manual Correction">Manual Correction</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustStockModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#4F46E5] hover:bg-[#3F37C9] text-white rounded-xl font-bold shadow-md transition-colors cursor-pointer"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
