"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ShieldUser, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(e) {
            if(menuRef.current && !menuRef.current.contains(e.target)){
                setMenuOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <header className="z-40 mx-auto w-full max-w-screen-md py-3 md:top-6 md:rounded-3xl lg:max-w-screen-xl bg-white">
            <div className="px-4">
                <div className="flex items-center justify-between">
                    <div className="flex shrink-0">
                        <a aria-current="page" className="flex items-center" href="/">
                            <img className="h-24 md:h-28 w-auto" src="/images/logo.png" alt="" />
                        </a>
                    </div>
                    <div className="hidden md:flex md:items-center md:justify-center md:gap-15">
                        <Link
                            aria-current="page"
                            className="inline-block rounded-lg px-7 py-2 tracking-wider text-lg font-bold transition-all duration-200 bg-dark1 text-white"
                            href="/"
                        >
                            Home
                        </Link>
                        <Link
                            aria-current="page"
                            className="inline-block rounded-lg px-7 py-2 tracking-wider text-lg font-bold transition-all duration-200 bg-dark1 text-white"
                            href="/about"
                        >
                            About
                        </Link>
                    </div>
                    <div className="flex items-center justify-end gap-6">
                        {user && (
                            <Link href="/cart" className="relative">
                                <ShoppingBag size={34} />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-2 py-.5 rounded-full">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center gap-6">
                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={() => setMenuOpen(!menuOpen)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-dark1 font-semibold text-white focus:outline-none"
                                    >
                                        {user?.name?.charAt(0).toUpperCase() || "U"}
                                    </button>

                                    {menuOpen && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                                            <Link
                                                href="/orders"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                My Orders
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <Link href="/dashboard">
                                    <ShieldUser size={36} />
                                </Link>

                                <button
                                    onClick={logout}
                                    className="rounded-xl bg-red-500 px-8 py-2 text-lg font-bold text-white hover:bg-red-600 tracking-wider"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                className="inline-flex items-center justify-center rounded-xl bg-dark1 px-8 py-2 text-lg font-bold tracking-wider text-white transition-all duration-150 hover:bg-dark2"
                                href="/login"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
