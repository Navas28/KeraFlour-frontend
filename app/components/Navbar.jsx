"use client";

import { useAuth } from "@/context/AuthContext";
import {
  ShieldUser,
  Menu,
  X,
  LayoutDashboard,
  UtensilsCrossed,
  Calendar,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ConfirmModal from "./UI/ConfirmModal";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading || !user) return null;

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    setMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const NavItem = ({ href, icon: Icon, label }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
          isActive
            ? "bg-amber-700 text-white shadow-sm"
            : "text-amber-900/70 hover:text-amber-900 hover:bg-amber-50"
        }`}
      >
        <Icon size={17} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-amber-100 shadow-sm">
        <div className="mx-auto max-w-screen-2xl flex items-center justify-between px-6 h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-base text-amber-900 tracking-tight leading-none">
                KeraFlour
              </span>
              <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest leading-none mt-0.5">
                Mill Admin
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center space-x-2.5 pl-3 pr-1.5 py-1.5 bg-amber-50 rounded-2xl border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <span className="hidden sm:block text-amber-900 font-semibold text-sm">
                    {user?.name || "Admin"}
                  </span>
                  <div className="w-8 h-8 bg-amber-700 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-xl border border-amber-100 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="px-5 py-3 border-b border-amber-50">
                      <p className="text-sm font-bold text-amber-900">
                        {user?.name}
                      </p>
                      <p className="text-[11px] text-amber-500 font-medium mt-0.5 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        href="/settings"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-amber-800 font-semibold hover:bg-amber-50 rounded-xl transition-colors gap-3"
                      >
                        <Settings size={16} className="text-amber-500" />
                        Account Settings
                      </Link>
                      <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors gap-3"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-amber-700 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-amber-800 transition-all active:scale-95 shadow-sm"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-amber-800 hover:bg-amber-50 rounded-xl transition-colors"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[100] bg-amber-950/40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-4 left-4 right-4 bg-white rounded-3xl shadow-2xl p-6 border border-amber-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-amber-200">
                  <Image
                    src="/images/logo.png"
                    alt="KeraFlour Logo"
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
                <span className="font-bold text-amber-900 text-base">
                  Mill Navigation
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-amber-50 rounded-full text-amber-700"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="space-y-1.5">
              <NavItem href="/" icon={LayoutDashboard} label="Dashboard Hub" />
              <div className="border-t border-amber-50 mt-4 pt-4">
                {user ? (
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-red-600 font-bold bg-red-50 rounded-2xl border border-red-100"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="block px-4 py-3.5 bg-amber-700 text-white text-center font-bold rounded-2xl shadow-md shadow-amber-200"
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      <ConfirmModal
        show={showLogoutModal}
        title="Signing Out?"
        message="Are you sure you want to end your administrative session?"
        confirmText="Confirm Sign Out"
        type="logout"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}
