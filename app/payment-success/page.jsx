"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Loading from "../components/UI/Loading";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("session_id");

    const [sessionDetails, setSessionDetails] = useState(null);
    const {clearCart} = useCart();
    const clearedRef = useRef(false)

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
                    clearCart();
                    toast.success("Payment successful!");
                    clearedRef.current = true
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to verify payment.");
            }
        }
        if (sessionId) fetchSession();

        const timer = setTimeout(() => {
            router.push("/");
        }, 5000);
        return () => clearTimeout(timer);
    }, [sessionId, router]);

    if (!sessionDetails) return <Loading />;
    return (
        <div className="max-w-2xl mx-auto text-center p-6">
            <h2 className="text-2xl font-bold text-green-600">✅ Payment Successful!</h2>
            <p className="mt-2 text-gray-600">Thank you for your purchase.</p>

            <div className="border rounded-lg p-4 mt-4 text-left bg-white shadow">
                <p>
                    <span className="font-semibold">Stripe Session:</span> {sessionDetails.id}
                </p>
                <p>
                    <span className="font-semibold">Amount Paid:</span> ₹{sessionDetails.amount_total / 100}
                </p>
                <p>
                    <span className="font-semibold">Payment Status:</span> {sessionDetails.payment_status}
                </p>
            </div>

            <p className="mt-4 text-sm text-gray-500">Redirecting to home in 5 seconds...</p>
        </div>
    );
}
