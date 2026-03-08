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
    <div className="min-h-screen flex items-center justify-center bg-amber-50/50 p-6">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 relative mx-auto mb-5 rounded-2xl overflow-hidden  p-1">
             <div className="w-16 h-16 bg-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md">
              <LogIn className="text-white" size={30} />
            </div>
            </div>
            <h1 className="text-2xl font-extrabold text-amber-900 mb-1.5">
              Admin Login
            </h1>
            <p className="text-amber-500 font-medium text-sm">
              Secure access to KeraFlour Mill Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  placeholder="admin@keraflour.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-amber-200 bg-amber-50/50 text-amber-900 placeholder-amber-300 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all font-medium text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <PasswordInput
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-amber-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-800 active:scale-[0.98] transition-all disabled:opacity-50 mt-2 shadow-sm text-sm"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <span>Enter Dashboard</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 pt-6 border-t border-amber-50 text-center">
            <p className="text-sm text-amber-400 font-medium">
              New administrator?{" "}
              <Link
                href="/signup"
                className="text-amber-700 font-bold hover:text-amber-800 transition-colors"
              >
                Create Master Account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-amber-400 text-xs font-medium mt-5">
          &copy; 2026 KeraFlour Mill Management System
        </p>
      </div>
    </div>
  );
}
