import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, color = 'indigo' }) {
  const colorMaps = {
    indigo: {
      bg: 'bg-indigo-50/70',
      text: 'text-[#4F46E5]',
      border: 'border-indigo-100/50'
    },
    emerald: {
      bg: 'bg-emerald-50/70',
      text: 'text-emerald-600',
      border: 'border-emerald-100/50'
    },
    amber: {
      bg: 'bg-amber-50/70',
      text: 'text-amber-600',
      border: 'border-amber-100/50'
    },
    rose: {
      bg: 'bg-rose-50/70',
      text: 'text-rose-600',
      border: 'border-rose-100/50'
    },
    slate: {
      bg: 'bg-slate-50',
      text: 'text-slate-500',
      border: 'border-slate-100'
    }
  };

  const selectedColor = colorMaps[color] || colorMaps.indigo;

  return (
    <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between transition-all hover:shadow-sm">
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{title}</span>
        <span className="text-[17px] font-black text-slate-850 tracking-tight block mt-0.5 truncate leading-tight">
          {value}
        </span>
        {subtext && (
          <span className="text-[9.5px] text-slate-400 font-semibold block mt-1 truncate">
            {subtext}
          </span>
        )}
      </div>
      {Icon && (
        <div className={`w-9.5 h-9.5 rounded-xl ${selectedColor.bg} ${selectedColor.text} flex items-center justify-center shrink-0 ml-3`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
