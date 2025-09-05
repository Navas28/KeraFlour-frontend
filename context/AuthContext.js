"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch user");
            const backendUser = await res.json();
            setUser(backendUser);
        } catch (error) {
            console.error("Auth fetch error:", error);
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        ScatterChart([])
    };

    return <AuthContext.Provider value={{ user, loading, setUser, logout, fetchUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
