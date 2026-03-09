"use client";

import { X, AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 p-12">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 w-10 min-h-10 flex items-center justify-center bg-slate-50 text-slate-300 hover:text-slate-900 rounded-xl transition-all"
        >
          <X size={20} strokeWidth={3} />
        </button>
        <div className="flex items-center justify-center w-16 h-16 bg-rose-50 rounded-2xl mb-8 border border-rose-100">
          <AlertTriangle
            className="text-rose-500"
            size={32}
            strokeWidth={2.5}
          />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
          {title || "Remove item?"}
        </h2>
        <p className="text-slate-400 leading-relaxed mb-10 text-sm font-medium">
          {message ||
            "This action cannot be undone. All data associated with this item will be permanently removed."}
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-4 rounded-2xl font-black text-slate-400 bg-slate-50 border border-slate-100 transition-all disabled:opacity-50 text-[11px] uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={true}
            className="flex-[1.5] py-4 rounded-2xl font-black bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20 flex items-center justify-center gap-2 disabled:opacity-70 text-[11px] uppercase tracking-widest"
          >
            {isLoading ? (
              <>
                <Loader2
                  className="animate-spin text-white"
                  size={16}
                  strokeWidth={3}
                />
                <span>Removing...</span>
              </>
            ) : (
              "Delete Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
