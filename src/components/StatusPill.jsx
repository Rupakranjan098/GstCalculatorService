import React from 'react';

export default function StatusPill({ value }) {
  const normValue = String(value).trim().toLowerCase();

  let styles = 'bg-slate-50 text-slate-600 border border-slate-200/50';

  if (normValue === 'paid' || normValue === 'in stock' || normValue === 'settled') {
    styles = 'bg-emerald-55/10 text-emerald-600 border border-emerald-500/10';
  } else if (normValue === 'unpaid' || normValue === 'low stock' || normValue === 'pending') {
    styles = 'bg-amber-55/10 text-amber-600 border border-amber-500/10';
  } else if (normValue === 'out of stock' || normValue === 'damaged') {
    styles = 'bg-rose-55/10 text-rose-600 border border-rose-500/10';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${styles}`}>
      {value}
    </span>
  );
}
