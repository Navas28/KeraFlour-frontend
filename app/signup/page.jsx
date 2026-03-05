"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminSecret: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/signup", formData);
      setSuccess("Admin account created successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Admin
            </h2>
            <p className="text-gray-500">
              Add a new administrator to KeraFlour
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-5 py-3 rounded-xl border-2 border-gray-100 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-5 py-3 rounded-xl border-2 border-gray-100 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-5 py-3 rounded-xl border-2 border-gray-100 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="pt-2">
              <label className="block text-sm font-bold text-emerald-700 mb-2 ml-1">
                Admin Master Key
              </label>
              <input
                type="password"
                required
                value={formData.adminSecret}
                onChange={(e) =>
                  setFormData({ ...formData, adminSecret: e.target.value })
                }
                placeholder="Required for admin role"
                className="w-full px-5 py-3 rounded-xl border-2 border-emerald-100 bg-emerald-50/30 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-dark1 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all disabled:opacity-50 mt-4"
            >
              {loading ? "Creating..." : "Create Admin Account"}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-center text-red-500 font-medium text-sm">
              {error}
            </p>
          )}
          {success && (
            <p className="mt-4 text-center text-emerald-500 font-medium text-sm">
              {success}
            </p>
          )}

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-emerald-600 font-bold hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
