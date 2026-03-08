"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, ChevronRight, Loader2, LogIn } from "lucide-react";
import PasswordInput from "../components/UI/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";

export default function LoginPage() {
  const { fetchUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");
    if (!password) return toast.error("Password is required");

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);

      if (data.user.role !== "admin") {
        localStorage.removeItem("token");
        toast.error("Access denied. Admin credentials required.");
        return;
      }

      toast.success(`Welcome back, ${data.user.name || "Admin"}!`);
      await fetchUser();
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-6">
      <div className="max-w-md w-full">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 shadow-slate-200/50">
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-600/20">
              <LogIn className="text-white" size={36} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Admin Gateway
            </h1>
            <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.25em] mt-1">
              Secure access to KeraFlour Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Administrator Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-emerald-500 transition-colors">
                  <Mail size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="email"
                  placeholder="admin@keraflour.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-6 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-900 font-black text-sm placeholder:text-slate-200 focus:bg-white focus:border-emerald-400 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Secret Access Key
              </label>
              <PasswordInput
                placeholder="Enter your key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  <span>Enter Dashboard</span>
                  <ChevronRight size={18} strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-xs text-slate-400 font-bold">
              New administrator?{" "}
              <Link
                href="/signup"
                className="text-emerald-600 font-black hover:text-emerald-700 transition-colors uppercase tracking-widest text-[10px]"
              >
                Create Master Account
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
