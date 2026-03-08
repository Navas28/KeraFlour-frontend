"use client";

import { X, Trash2, LogOut, AlertCircle } from "lucide-react";

export default function ConfirmModal({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  loading = false,
}) {
  if (!show) return null;

  const isLogout = type === "logout";
  const isDanger = type === "danger";

  const iconBg = isLogout
    ? "bg-emerald-50 border-emerald-100"
    : isDanger
      ? "bg-rose-50 border-rose-100"
      : "bg-emerald-50 border-emerald-100";
  const Icon = isLogout ? LogOut : isDanger ? Trash2 : AlertCircle;
  const iconColor = isLogout
    ? "text-emerald-600"
    : isDanger
      ? "text-rose-500"
      : "text-emerald-600";
  const btnClass = isLogout
    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
    : isDanger
      ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
      : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20";

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all duration-300">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <div
            className={`w-14 h-14 rounded-2xl ${iconBg} border flex items-center justify-center shadow-sm`}
          >
            <Icon className={iconColor} size={28} strokeWidth={2.5} />
          </div>
          <button
            onClick={onCancel}
            className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-slate-300 hover:text-slate-900"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-slate-400 mb-8 leading-relaxed text-sm font-medium">
          {message}
        </p>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black transition-all hover:bg-slate-100 border border-slate-100 text-[10px] uppercase tracking-widest"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-4 text-white rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50 shadow-xl text-[10px] uppercase tracking-widest ${btnClass}`}
          >
            {loading ? "..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
