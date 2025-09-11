"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ShieldUser, ShoppingBag, Menu, X, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cart } = useCart();
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
                    </Link>
                    <nav className="hidden lg:flex items-center space-x-2">
                        <Link
                            href="/"
                            className="relative px-5 py-3 text-lg font-semibold text-dark1
      hover:text-green-700 transition
      after:content-[''] after:absolute after:left-4 after:right-4 after:-bottom-1
      after:h-[3px] after:rounded after:scale-x-0 hover:after:scale-x-100
      after:bg-emerald-600 after:transition-transform after:duration-300"
                        >
                            Home
                        </Link>
                        <Link
                            href="/about"
                            className="relative px-5 py-3 text-lg font-semibold text-dark1
      hover:text-green-700 transition
      after:content-[''] after:absolute after:left-4 after:right-4 after:-bottom-1
      after:h-[3px] after:rounded after:scale-x-0 hover:after:scale-x-100
      after:bg-emerald-600 after:transition-transform after:duration-300"
                        >
                            About
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-3">
                        {user && (
                            <Link href="/cart" className="relative p-2 hover:bg-green-100 rounded-lg transition-colors">
                                <ShoppingBag size={28} className="text-gray-700" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        {user ? (
                            <>
                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={() => setMenuOpen(!menuOpen)}
                                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                            {user?.name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                        <span className="hidden sm:block text-gray-700 font-medium text-sm">
                                            {user?.name?.split(" ")[0] || "User"}
                                        </span>
                                    </button>
                                    {menuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                            <div className="px-4 py-2 border-b border-gray-50">
                                                <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
                                                <p className="text-xs text-gray-500">{user?.email}</p>
                                            </div>
                                            <Link
                                                href="/orders"
                                                onClick={() => setMenuOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-100"
                                            >
                                                <User size={16} className="mr-3 text-gray-400" />
                                                My Orders
                                            </Link>
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setMenuOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-100"
                                            >
                                                <ShieldUser size={16} className="mr-3 text-gray-400" />
                                                Dashboard
                                            </Link>

                                            <div className="border-t border-gray-50 mt-2 pt-2">
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
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-dark1 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                            >
                                Sign In
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
                    <div className="absolute top-30 left-4 right-4 bg-white rounded-xl shadow-xl border border-gray-100 p-4">
                        <nav className="space-y-2">
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-3 text-gray-700 hover:bg-green-100 rounded-lg font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                href="/about"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-3 text-gray-700 hover:bg-green-100 rounded-lg font-medium"
                            >
                                About
                            </Link>

                            {!user && (
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 bg-dark1 text-white text-center rounded-lg font-medium"
                                >
                                    Sign In
                                </Link>
                            )}

                            {user && (
                                <>
                                    <Link
                                        href="/orders"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-3 text-gray-700 hover:bg-green-100 rounded-lg"
                                    >
                                        My Orders
                                    </Link>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-3 text-gray-700 hover:bg-green-100 rounded-lg"
                                    >
                                        Dashboard
                                    </Link>
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
