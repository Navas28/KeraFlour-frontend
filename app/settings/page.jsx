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
    <main className="min-h-screen bg-amber-50/30 p-5 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-amber-900">
            Account Settings
          </h1>
          <p className="text-amber-500 text-sm mt-1 font-medium">
            Manage your administrator account credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-7 text-center">
              <div className="w-18 h-18 bg-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md w-[72px] h-[72px]">
                <ShieldCheck className="text-white" size={32} />
              </div>
              <h2 className="text-lg font-bold text-amber-900 mb-0.5">
                {user?.name}
              </h2>
              <p className="text-sm text-amber-400 font-medium mb-4 break-all">
                {user?.email}
              </p>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest border border-amber-200">
                <User size={11} />
                Administrator
              </span>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-7">
              <div className="flex items-center gap-3 mb-7">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <KeyRound size={18} className="text-amber-700" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-amber-900">
                    Update Password
                  </h2>
                  <p className="text-xs text-amber-400 mt-0.5">
                    Change your access credentials
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">
                    Current Password
                  </label>
                  <PasswordInput
                    value={passwords.oldPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        oldPassword: e.target.value,
                      })
                    }
                    placeholder="Type your current password"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">
                      New Password
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
                    <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">
                      Confirm Password
                    </label>
                    <PasswordInput
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-50 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-11 px-8 bg-amber-700 text-white rounded-xl font-bold flex items-center justify-center gap-2.5 hover:bg-amber-800 transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm text-sm"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Save size={16} />
                    )}
                    <span>Update Credentials</span>
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
