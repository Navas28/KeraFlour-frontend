"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  User,
  Mail,
  Key,
  ChevronRight,
  Loader2,
} from "lucide-react";
import PasswordInput from "../components/UI/PasswordInput";
import api from "@/lib/api";
import { toast } from "sonner";

const InputField = ({
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
}) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-emerald-500 transition-colors">
      <Icon size={18} strokeWidth={2.5} />
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full h-14 pl-12 pr-6 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-900 font-black text-sm placeholder:text-slate-200 focus:bg-white focus:border-emerald-400 outline-none transition-all"
    />
  </div>
);

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminSecret: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Full Name is required");
    if (!formData.email) return toast.error("Email Address is required");
    if (!formData.password) return toast.error("Password is required");
    if (!formData.adminSecret)
      return toast.error("Admin Master Key is required");

    setLoading(true);
    try {
      await api.post("/auth/signup", formData);
      toast.success("Admin account created successfully!");
      router.push("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Signup failed. Please check the Master Key.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-6">
      <div className="max-w-lg w-full">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 shadow-slate-200/50">
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-rose-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-600/20">
              <ShieldAlert className="text-white" size={36} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Admin Registry
            </h1>
            <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.25em] mt-1">
              Create your secure administrator account
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Full Name
              </label>
              <InputField
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                icon={User}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Email Address
              </label>
              <InputField
                type="email"
                placeholder="admin@keraflour.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                icon={Mail}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Access Key
              </label>
              <PasswordInput
                placeholder="Create a strong key"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Admin Master Secret
              </label>
              <PasswordInput
                placeholder="Enter security key"
                value={formData.adminSecret}
                onChange={(e) =>
                  setFormData({ ...formData, adminSecret: e.target.value })
                }
                icon={Key}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50 mt-4 shadow-xl shadow-emerald-600/20 uppercase tracking-widest text-xs"
            >
              {loading ? (
                <Loader2
                  className="animate-spin text-white"
                  size={20}
                  strokeWidth={3}
                />
              ) : (
                <>
                  <span>Create Account</span>
                  <ChevronRight size={18} strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-xs text-slate-400 font-bold">
              Already a master?{" "}
              <Link
                href="/login"
                className="text-emerald-600 font-black hover:text-emerald-700 transition-colors uppercase tracking-widest text-[10px]"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
        <p className="text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] mt-8">
          &copy; 2026 KeraFlour Mill • All Rights Reserved
        </p>
      </div>
    </div>
  );
}
