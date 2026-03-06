"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { ShieldCheck, Lock, Save, Loader2, KeyRound } from "lucide-react";
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
    <main className="min-h-screen bg-gray-50/50 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Account Settings
          </h1>
          <p className="text-gray-500">
            Secure your administrator account and update credentials.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10" />
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                  <ShieldCheck className="text-white" size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user?.name}
                </h2>
                <p className="text-sm text-gray-500 font-medium mb-4">
                  {user?.email}
                </p>
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest border border-emerald-100">
                  Administrator
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <KeyRound size={22} className="text-gray-900" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Update Password
                </h2>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
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
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                        Confirm New Password
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
                </div>

                <div className="pt-6 border-t border-gray-50 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-14 px-10 bg-dark1 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-800 hover:shadow-xl hover:shadow-emerald-900/10 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Save size={20} />
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
