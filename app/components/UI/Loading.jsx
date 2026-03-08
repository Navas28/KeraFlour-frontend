"use client";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="relative w-12 h-12 mb-6">
        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>

      <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest animate-pulse">
        {message}
      </p>
    </div>
  );
}
