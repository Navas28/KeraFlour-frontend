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

  const InputField = ({
    type = "text",
    placeholder,
    value,
    onChange,
    icon: Icon,
  }) => (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-400 group-focus-within:text-amber-600 transition-colors">
        <Icon size={16} />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-12 pl-11 pr-4 rounded-xl border border-amber-200 bg-amber-50/50 text-amber-900 placeholder-amber-300 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all font-medium text-sm"
      />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50/50 p-6">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md">
              <ShieldAlert className="text-white" size={30} />
            </div>
            <h1 className="text-2xl font-extrabold text-amber-900 mb-1.5">
              Admin Registry
            </h1>
            <p className="text-amber-500 font-medium text-sm">
              Create your secure administrator account
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">
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
              <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">
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
              <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <PasswordInput
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">
                Admin Master Key
              </label>
              <PasswordInput
                placeholder="Enter security secret"
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
              className="w-full h-12 bg-amber-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-800 active:scale-[0.98] transition-all disabled:opacity-50 mt-2 shadow-sm text-sm"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <span>Create Account</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 pt-6 border-t border-amber-50 text-center">
            <p className="text-sm text-amber-400 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-amber-700 font-bold hover:text-amber-800 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
