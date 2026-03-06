"use client";

import { useAuth } from "@/context/AuthContext";
import {
  ShieldUser,
  Menu,
  X,
  User,
  LayoutDashboard,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // If not logged in or not admin, we might want to hide most things,
  // but for now let's just show a simplified version.

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 p-6">
        <div className="mx-auto max-w-screen-2xl flex items-center justify-between px-4 lg:px-6 h-16">
          <Link href="/" className="flex items-center group">
            <img
              className="h-16 w-auto sm:h-25 transition-transform group-hover:scale-105"
              src="/images/logo.png"
              alt="Kera Flour Logo"
            />
            <span className="ml-3 font-bold text-xl text-dark1 tracking-tight hidden sm:block">
              Admin Panel
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-2">
            <Link
              href="/"
              className="flex items-center space-x-2 px-5 py-3 text-lg font-semibold text-dark1 hover:text-green-700 transition"
            >
              <LayoutDashboard size={20} />
              <span>Overview</span>
            </Link>
            <Link
              href="/products"
              className="flex items-center space-x-2 px-5 py-3 text-lg font-semibold text-dark1 hover:text-green-700 transition"
            >
              <UtensilsCrossed size={20} />
              <span>Products</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                  <span className="hidden sm:block text-gray-700 font-medium text-sm">
                    Admin
                  </span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || "Admin"}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/settings"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <ShieldUser size={16} className="mr-2 text-gray-400" />
                        Account Settings
                      </Link>
                    </div>
                    <div className="border-t border-gray-50 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-dark1 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                Admin Login
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute top-24 left-4 right-4 bg-white rounded-xl shadow-xl border border-gray-100 p-4">
            <nav className="space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-green-100 rounded-lg font-medium"
              >
                Overview
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-green-100 rounded-lg font-medium"
              >
                Products
              </Link>
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-green-100 rounded-lg font-medium"
              >
                Settings
              </Link>

              {!user && (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-dark1 text-white text-center rounded-lg font-medium"
                >
                  Admin Login
                </Link>
              )}

              {user && (
                <>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-100 rounded-lg"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
