import React from 'react';
import { X } from 'lucide-react';

export default function SlideOverPanel({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px] transition-opacity duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-100 flex flex-col justify-between h-full">
          
          {/* Header */}
          <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
            <h3 className="font-extrabold text-slate-800 text-sm">
              {title}
            </h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form / Scrollable Body */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}
