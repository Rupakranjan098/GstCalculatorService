import React from 'react';
import { useOutletContext, useLocation, useNavigate } from 'react-router-dom';

export default function Settings() {
  const { businessProfile, setBusinessProfile } = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();

  const isTax = location.pathname.includes('/tax');

  return (
    <div className="space-y-6">
      {/* Header tabs */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs flex justify-between items-center">
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm">System configuration</h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Customize business identities, billing states, and tax brackets.</p>
        </div>
        <div className="flex bg-slate-50 p-1 border border-slate-150 rounded-xl text-xs">
          <button
            onClick={() => navigate('/settings/profile')}
            className={`px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              !isTax ? 'bg-white text-[#4F46E5] shadow-xs' : 'text-slate-450 hover:text-slate-700'
            }`}
          >
            Business Profile
          </button>
          <button
            onClick={() => navigate('/settings/tax')}
            className={`px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              isTax ? 'bg-white text-[#4F46E5] shadow-xs' : 'text-slate-450 hover:text-slate-700'
            }`}
          >
            Tax Slabs
          </button>
        </div>
      </div>

      {/* Forms content card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-2xl">
        {!isTax ? (
          <form className="space-y-4 text-xs font-semibold text-slate-655" onSubmit={(e) => e.preventDefault()}>
            <h4 className="font-extrabold text-slate-800 text-sm pb-2 border-b border-slate-50">Business Identity</h4>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company Name</label>
              <input
                type="text"
                value={businessProfile.name}
                onChange={(e) => setBusinessProfile({ ...businessProfile, name: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-slate-800 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GSTIN Identification</label>
                <input
                  type="text"
                  value={businessProfile.gstin}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, gstin: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-slate-800 font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billing State</label>
                <input
                  type="text"
                  value={businessProfile.state}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, state: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-slate-800 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billing State Code</label>
                <input
                  type="text"
                  value={businessProfile.stateCode}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, stateCode: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-slate-800 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billing Currency</label>
                <input
                  type="text"
                  value={businessProfile.currency}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, currency: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-slate-800 font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Physical Address</label>
              <textarea
                value={businessProfile.address}
                onChange={(e) => setBusinessProfile({ ...businessProfile, address: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-slate-800 font-medium"
              />
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm pb-2 border-b border-slate-50">Active Tax Slabs</h4>
            <div className="space-y-3">
              {[
                { rate: '0%', description: 'Exempted goods, raw food grains, books items' },
                { rate: '5%', description: 'Sugar, tea, coffee, edible oils, coal spares' },
                { rate: '12%', description: 'Butter, cheese, cell phones, processed foods, Qi lamps' },
                { rate: '18%', description: 'Wireless monitors, gaming headsets, standard services' },
                { rate: '28%', description: 'Luxury items, automobiles, luxury goods, pan masala' }
              ].map((slab, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-655">
                  <div>
                    <span className="font-black text-[#4F46E5] text-sm block">{slab.rate} Rate Slab</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{slab.description}</span>
                  </div>
                  <span className="bg-emerald-55/10 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase">Active</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
