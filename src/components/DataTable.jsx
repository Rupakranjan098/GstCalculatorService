import React from 'react';

export default function DataTable({ title, extraHeader, headers = [], children, emptyMessage = 'No records found.' }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {(title || extraHeader) && (
        <div className="p-4.5 border-b border-slate-50 flex justify-between items-center bg-white">
          {title && <h3 className="font-extrabold text-slate-800 text-sm">{title}</h3>}
          {extraHeader}
        </div>
      )}

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {headers.map((h, idx) => (
                <th 
                  key={idx} 
                  className={`px-5 py-3.5 ${h.align === 'right' ? 'text-right' : h.align === 'center' ? 'text-center' : ''}`}
                >
                  {h.label || h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}
