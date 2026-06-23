import React from 'react';

export default function GradientHeroCard({ title, subtitle, actionText, onActionClick }) {
  return (
    <div className="bg-gradient-to-r from-[#4F46E5] to-[#818CF8] rounded-3xl p-6.5 text-white shadow-lg shadow-indigo-100/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="space-y-1">
        <h2 className="text-xl font-black tracking-tight">{title}</h2>
        <p className="text-xs text-indigo-100 font-medium max-w-xl">{subtitle}</p>
      </div>
      {actionText && (
        <button
          onClick={onActionClick}
          className="bg-white hover:bg-indigo-50 text-[#4F46E5] px-4.5 py-2.5 rounded-xl text-xs font-black transition-all self-start md:self-auto shrink-0 shadow-md shadow-indigo-900/10 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
