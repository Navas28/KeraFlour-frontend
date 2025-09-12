"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Loading from "../components/UI/Loading";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { CheckCircle, CreditCard, Receipt } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("session_id");

    const [sessionDetails, setSessionDetails] = useState(null);
    const { clearCart } = useCart();
    const clearedRef = useRef(false);

    useEffect(() => {
        async function fetchSession() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/payments/stripe-session/${sessionId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                setSessionDetails(data);

                if (data.payment_status === "paid") {
                    if (!clearedRef.current) {
                        clearCart();
                        toast.success("Payment successful!");
                        clearedRef.current = true;
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to verify payment.");
            }
        }

        if (sessionId) fetchSession();

        const timer = setTimeout(() => {
            router.push("/");
        }, 6000);

        return () => clearTimeout(timer);
    }, [sessionId, router, clearCart]);

    if (!sessionDetails) return <Loading />;

    return (
        <div className="max-w-xl mx-auto flex flex-col items-center pt-12 pb-20 px-4">
            <CheckCircle size={70} className="text-emerald-600 mb-5 animate-bounce" strokeWidth={1.5} />
            <h2 className="text-3xl font-extrabold text-emerald-700 mb-2">Payment Successful!</h2>
            <p className="text-lg text-gray-700 mb-8">
                Thank you for trusting <span className="font-bold text-emerald-800">Kera Flour</span>
                <br />
                Your payment has been processed successfully.
            </p>

            <div className="bg-white border border-emerald-100 rounded-2xl shadow p-6 w-full mb-6">
                <div className="flex items-center gap-3 mb-4 text-gray-500">
                    <Receipt size={20} />
                    <span className="font-semibold text-gray-800">Transaction ID:</span>
                    <span className="text-blue-700 font-mono font-bold tracking-wide">#{sessionDetails.id.slice(-8)}</span>
                </div>
                <div className="flex flex-col md:flex-row md:gap-5 text-lg">
                    <div className="flex items-center gap-2 mb-2 md:mb-0">
                        <CreditCard size={18} className="text-gray-400" />
                        <span className="font-medium">Stripe Payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-gray-400" />
                        <span>
                            {sessionDetails.payment_status.charAt(0).toUpperCase() + sessionDetails.payment_status.slice(1)}
                        </span>
                    </div>
                </div>
                <div className="mt-4 text-2xl font-bold text-emerald-700">
                    Amount Paid: ₹{(sessionDetails.amount_total / 100).toFixed(2)}
                </div>
            </div>

            <Link
                href="/"
                className="inline-block px-7 py-3 bg-dark1 text-white rounded-xl text-lg font-semibold shadow hover:bg-green-700 transition mb-3"
            >
                Home
            </Link>
            <p className="mt-1 text-sm text-gray-500">Redirecting to home in a few seconds…</p>
        </div>
    );
}
