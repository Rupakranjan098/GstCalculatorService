import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus } from 'lucide-react';
import StatusPill from '../components/StatusPill';
import SlideOverPanel from '../components/SlideOverPanel';

export default function Products() {
  const {
    products,
    setProducts,
    setActivityLogs,
    currentUser
  } = useOutletContext();

  const [showProductSlideOver, setShowProductSlideOver] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [productForm, setProductForm] = useState({ 
    name: '', 
    sku: '', 
    hsn: '', 
    basePrice: 0, 
    gstRate: 18, 
    stock: 0, 
    minStock: 5, 
    unit: 'PCS', 
    category: 'Electronics', 
    image: '' 
  });

  const handleOpenAdd = () => {
    setEditingProductId(null);
    setProductForm({ name: '', sku: '', hsn: '', basePrice: 0, gstRate: 18, stock: 0, minStock: 5, unit: 'PCS', category: 'Electronics', image: '' });
    setShowProductSlideOver(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProductId(p.id);
    setProductForm({ ...p });
    setShowProductSlideOver(true);
  };

  const handleDelete = (p) => {
    if (confirm("Delete " + p.name + "?")) {
      setProducts(prev => prev.filter(item => item.id !== p.id));
      const log = {
        id: `log-${Date.now()}`,
        user: currentUser.name,
        role: currentUser.role,
        action: `Deleted Product ${p.sku}`,
        timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        details: `Removed ${p.name} from product records.`
      };
      setActivityLogs(prev => [log, ...prev]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProductId) {
      setProducts(prev => prev.map(p => p.id === editingProductId ? { ...p, ...productForm } : p));
      const log = {
        id: `log-${Date.now()}`,
        user: currentUser.name,
        role: currentUser.role,
        action: `Modified Product ${productForm.sku}`,
        timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        details: `Updated details for ${productForm.name}`
      };
      setActivityLogs(prev => [log, ...prev]);
    } else {
      const newProd = {
        ...productForm,
        id: `p-${Date.now()}`,
        image: productForm.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80&fit=crop"
      };
      setProducts(prev => [...prev, newProd]);
      const log = {
        id: `log-${Date.now()}`,
        user: currentUser.name,
        role: currentUser.role,
        action: `Added Product ${productForm.sku}`,
        timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        details: `Registered ${productForm.name} under ${productForm.category}`
      };
      setActivityLogs(prev => [log, ...prev]);
    }
    setShowProductSlideOver(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex justify-between items-center bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm">Product Registry</h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Manage base pricing, HSN codes, and tax parameters.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-150 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Product
        </button>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC]/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3.5">Image</th>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">HSN Code</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Stock Status</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">GST Rate</th>
                <th className="px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
              {products.map((p, idx) => {
                const isLowStock = p.stock <= p.minStock;
                return (
                  <tr key={idx} className="hover:bg-slate-50/20">
                    <td className="px-5 py-3">
                      <img 
                        src={p.image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=80&q=80&fit=crop"} 
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                      />
                    </td>
                    <td className="px-5 py-3 font-bold text-slate-800">
                      <div>{p.name}</div>
                      <div className="text-[9px] text-slate-400 font-semibold mt-0.5">{p.sku}</div>
                    </td>
                    <td className="px-5 py-3 font-mono">{p.hsn}</td>
                    <td className="px-5 py-3">
                      <span className="bg-indigo-50/50 text-[#4F46E5] text-[10px] px-2 py-0.5 rounded-md font-bold">
                        {p.category || "General"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <StatusPill value={isLowStock ? 'Low Stock' : 'In Stock'} />
                      <span className="text-[10px] font-semibold text-slate-400 ml-1.5">({p.stock})</span>
                    </td>
                    <td className="px-5 py-3 font-bold text-slate-800">
                      ₹{p.basePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3 text-slate-700">{p.gstRate}%</td>
                    <td className="px-5 py-3 text-slate-400">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="px-2 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SlideOver form */}
      <SlideOverPanel
        isOpen={showProductSlideOver}
        onClose={() => setShowProductSlideOver(false)}
        title={editingProductId ? 'Edit Product Parameters' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-semibold text-slate-655">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Name</label>
            <input
              type="text"
              required
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-slate-800 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SKU Code</label>
              <input
                type="text"
                required
                value={productForm.sku}
                onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-slate-800 font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">HSN Code</label>
              <input
                type="text"
                required
                value={productForm.hsn}
                onChange={(e) => setProductForm({ ...productForm, hsn: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-slate-800 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
              <input
                type="text"
                required
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-slate-800 font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unit</label>
              <select
                value={productForm.unit}
                onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-slate-800 font-semibold"
              >
                <option value="PCS">PCS (Pieces)</option>
                <option value="BOX">BOX (Boxes)</option>
                <option value="KGS">KGS (Kilograms)</option>
                <option value="MTR">MTR (Meters)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Base Price (₹)</label>
              <input
                type="number"
                required
                min="0"
                value={productForm.basePrice}
                onChange={(e) => setProductForm({ ...productForm, basePrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-slate-800 font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GST Rate (%)</label>
              <select
                value={productForm.gstRate}
                onChange={(e) => setProductForm({ ...productForm, gstRate: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-slate-800 font-semibold"
              >
                <option value="0">0% Slab</option>
                <option value="5">5% Slab</option>
                <option value="12">12% Slab</option>
                <option value="18">18% Slab</option>
                <option value="28">28% Slab</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Stock</label>
              <input
                type="number"
                min="0"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-slate-800 font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Safety Threshold</label>
              <input
                type="number"
                min="0"
                value={productForm.minStock}
                onChange={(e) => setProductForm({ ...productForm, minStock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-slate-800 font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Image URL</label>
            <input
              type="text"
              value={productForm.image}
              placeholder="https://example.com/image.jpg"
              onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-slate-800 font-semibold"
            />
          </div>

          <div className="flex gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowProductSlideOver(false)}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl font-bold shadow-md shadow-indigo-100 transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </SlideOverPanel>
    </div>
  );
}
