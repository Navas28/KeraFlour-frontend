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
        className={`flex items-center space-x-2.5 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
          isActive
            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
        }`}
      >
        <Icon size={16} strokeWidth={isActive ? 3 : 2} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="mx-auto max-w-screen-2xl flex items-center justify-between px-8 h-20">
          <Link href="/" className="flex items-center gap-4">
            <div className="flex flex-col leading-tight">
              <span className="font-black text-lg text-slate-900 tracking-tighter leading-none">
                KeraFlour
              </span>
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] leading-none mt-1">
                Mill Admin Center
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            <NavItem href="/" icon={LayoutDashboard} label="Dashboard" />
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center space-x-3 pl-4 pr-2 py-2 bg-slate-50 rounded-[1.25rem] border border-slate-100 hover:bg-slate-100/50 transition-all shadow-sm"
                >
                  <span className="hidden sm:block text-slate-900 font-black text-xs uppercase tracking-widest">
                    {user?.name || "Admin"}
                  </span>
                  <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md">
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 py-3 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="px-6 py-4 border-b border-slate-50">
                      <p className="text-sm font-black text-slate-900 lowercase">
                        {user?.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link
                        href="/settings"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-xl transition-colors gap-3"
                      >
                        <Settings size={16} className="text-emerald-500" />
                        Account Control
                      </Link>
                      <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center px-4 py-3 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-xl transition-colors gap-3"
                      >
                        <LogOut size={16} />
                        Exit Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-600/20"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-900 rounded-xl transition-colors"
            >
              <Menu size={22} strokeWidth={3} />
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-6 left-6 right-6 bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="font-black text-slate-900 text-lg tracking-tight">
                    KeraFlour
                  </span>
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                    Admin Hub
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-900"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>
            <nav className="space-y-2">
              <NavItem href="/" icon={LayoutDashboard} label="Dashboard" />
              <div className="border-t border-slate-50 mt-6 pt-6">
                {user ? (
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 text-rose-500 font-extrabold bg-rose-50 rounded-[1.5rem] border border-rose-100 uppercase tracking-widest text-xs"
                  >
                    <LogOut size={18} strokeWidth={3} />
                    Exit Session
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="block px-6 py-4 bg-emerald-600 text-white text-center font-black rounded-[1.5rem] shadow-lg shadow-emerald-600/20 uppercase tracking-widest text-xs"
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
