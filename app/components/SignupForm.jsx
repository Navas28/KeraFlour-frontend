"use client";

import { auth } from "@/firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useState } from "react";

export default function SignupForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!name || !email || !password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            const token = await userCredential.user.getIdToken();

            await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/auth/sync-user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, name }),
            });

            setSuccess("Signup successful! You can now log in");
            setName("");
            setEmail("");
            setPassword("");
        } catch (err) {
            if (err.code === "auth/email-already-in-use") {
                setError("This email is already registered. Try logging in.");
            } else if (err.code === "auth/invalid-email") {
                setError("Please enter a valid email address.");
            } else if (err.code === "auth/weak-password") {
                setError("Password should be at least 6 characters.");
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="relative z-10 max-w-md w-full mx-4">
                <div
                    className="backdrop-blur-sm bg-white/95 p-10 rounded-3xl shadow-2xl border border-white/20"
                    style={{ boxShadow: "0 25px 50px -12px rgba(16, 52, 43, 0.25)" }}
                >
                    <div className="space-y-8">
                        <div className="text-center">
                            <div
                                className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                                style={{ backgroundColor: "var(--color-light1)" }}
                            >
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--color-dark1)" }}>
                                Join Us Today
                            </h2>
                            <p className="text-sm" style={{ color: "var(--color-light2)" }}>
                                Create your account to get started
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Full Name"
                                    required
                                    className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-gray-50/50 placeholder-gray-400"
                                    style={{
                                        borderColor: "var(--color-light1)",
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "var(--color-dark2)";
                                        e.target.style.backgroundColor = "white";
                                        e.target.style.boxShadow = `0 0 0 3px rgba(52, 87, 78, 0.1)`;
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "var(--color-light1)";
                                        e.target.style.backgroundColor = "rgba(249, 250, 251, 0.5)";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <svg
                                        className="w-5 h-5"
                                        style={{ color: "var(--color-light1)" }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    required
                                    className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-gray-50/50 placeholder-gray-400"
                                    style={{
                                        borderColor: "var(--color-light1)",
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "var(--color-dark2)";
                                        e.target.style.backgroundColor = "white";
                                        e.target.style.boxShadow = `0 0 0 3px rgba(52, 87, 78, 0.1)`;
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "var(--color-light1)";
                                        e.target.style.backgroundColor = "rgba(249, 250, 251, 0.5)";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <svg
                                        className="w-5 h-5"
                                        style={{ color: "var(--color-light1)" }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create Password"
                                    required
                                    className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-gray-50/50 placeholder-gray-400"
                                    style={{
                                        borderColor: "var(--color-light1)",
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "var(--color-dark2)";
                                        e.target.style.backgroundColor = "white";
                                        e.target.style.boxShadow = `0 0 0 3px rgba(52, 87, 78, 0.1)`;
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "var(--color-light1)";
                                        e.target.style.backgroundColor = "rgba(249, 250, 251, 0.5)";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <svg
                                        className="w-5 h-5"
                                        style={{ color: "var(--color-light1)" }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSignup}
                            disabled={loading}
                            className="w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:transform-none disabled:hover:scale-100 flex items-center justify-center"
                            style={{
                                backgroundColor: loading ? "var(--color-light2)" : "var(--color-dark2)",
                                boxShadow: loading ? "none" : "0 10px 20px rgba(52, 87, 78, 0.3)",
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.target.style.backgroundColor = "var(--color-dark1)";
                                    e.target.style.boxShadow = "0 15px 30px rgba(16, 52, 43, 0.4)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.target.style.backgroundColor = "var(--color-dark2)";
                                    e.target.style.boxShadow = "0 10px 20px rgba(52, 87, 78, 0.3)";
                                }
                            }}
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Creating Account...</span>
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        {error && (
                            <div className="p-4 rounded-xl border-l-4 bg-red-50 border-red-400 animate-pulse">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <p className="text-red-700 font-medium">{error}</p>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="p-4 rounded-xl border-l-4 bg-green-50 border-green-400 animate-pulse">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <p className="text-green-700 font-medium">{success}</p>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-gray-600 mb-4">Already have an account?</p>
                                <Link
                                    href="/login"
                                    className="text-lg font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:underline"
                                    style={{ color: "var(--color-dark2)" }}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = "var(--color-dark1)";
                                        e.target.style.backgroundColor = "rgba(134, 166, 159, 0.1)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = "var(--color-dark2)";
                                        e.target.style.backgroundColor = "transparent";
                                    }}
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                        <div className="text-center text-xs text-gray-500 leading-relaxed">
                            By creating an account, you agree to our{" "}
                            <button
                                className="underline hover:no-underline transition-all duration-200"
                                style={{ color: "var(--color-light2)" }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = "var(--color-dark2)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = "var(--color-light2)";
                                }}
                            >
                                Terms of Service
                            </button>{" "}
                            and{" "}
                            <button
                                className="underline hover:no-underline transition-all duration-200"
                                style={{ color: "var(--color-light2)" }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = "var(--color-dark2)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = "var(--color-light2)";
                                }}
                            >
                                Privacy Policy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
