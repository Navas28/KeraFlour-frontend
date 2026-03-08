"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function PasswordInput({
  value,
  onChange,
  onBlur,
  placeholder,
  name,
  icon: Icon = Lock,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-emerald-500 transition-colors">
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        placeholder={placeholder}
        className="w-full h-14 pl-12 pr-12 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-900 placeholder:text-slate-200 focus:bg-white focus:border-emerald-400 outline-none transition-all font-black text-sm"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-300 hover:text-slate-900 transition-colors"
        tabIndex="-1"
      >
        {showPassword ? (
          <EyeOff size={18} strokeWidth={2.5} />
        ) : (
          <Eye size={18} strokeWidth={2.5} />
        )}
      </button>
    </div>
  );
}
