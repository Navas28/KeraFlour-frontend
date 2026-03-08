"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { ShieldCheck, Save, Loader2, KeyRound, User } from "lucide-react";
import PasswordInput from "../components/UI/PasswordInput";

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwords.oldPassword)
      return toast.error("Current password is required");
    if (passwords.newPassword.length < 6)
      return toast.error("New password must be at least 6 characters");
    if (passwords.newPassword !== passwords.confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);
    try {
      await api.put("/auth/change-password", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      toast.success("Password updated successfully!");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 p-5 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Account Management
          </h1>
          <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.25em] mt-1">
            Secure your administrator access center.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-10 text-center">
              <div className="w-[100px] h-[100px] bg-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-600/20">
                <ShieldCheck
                  className="text-white"
                  size={48}
                  strokeWidth={2.5}
                />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-1">
                {user?.name}
              </h2>
              <p className="text-sm text-slate-400 font-bold mb-6 break-all lowercase">
                {user?.email}
              </p>
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
                <User size={12} strokeWidth={3} />
                Administrator
              </span>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-10">
              <div className="flex items-center gap-5 mb-10 pb-6 border-b border-slate-50">
                <div className="h-14 w-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center">
                  <KeyRound
                    size={24}
                    className="text-emerald-600"
                    strokeWidth={2.5}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Credentials & Access
                  </h2>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                    Update your secure portal password
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Your Current Password
                  </label>
                  <PasswordInput
                    value={passwords.oldPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        oldPassword: e.target.value,
                      })
                    }
                    placeholder="Type current password"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      New Secret Key
                    </label>
                    <PasswordInput
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Min 6 characters"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      Verify New Key
                    </label>
                    <PasswordInput
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Repeat new key"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-14 px-10 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-emerald-600/20"
                  >
                    {loading ? (
                      <Loader2
                        className="animate-spin text-white"
                        size={18}
                        strokeWidth={3}
                      />
                    ) : (
                      <Save size={18} strokeWidth={3} />
                    )}
                    <span>Apply Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
