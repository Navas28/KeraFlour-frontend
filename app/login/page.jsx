"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function LoginPage() {
  const { fetchUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", data.token);

      if (data.user.role !== "admin") {
        localStorage.removeItem("token");
        setError("Access denied. Admin only.");
        return;
      }

      setSuccess("Admin Login successful!");
      await fetchUser();
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
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
              Admin Panel
            </h2>
            <p className="text-gray-500">
              Secure entry for KeraFlour Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@keraflour.com"
                required
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-dark1 text-white rounded-xl font-bold flex items-center justify-center hover:bg-emerald-800 transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Sign In"}
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
        </div>
      </div>
    </div>
  );
}
