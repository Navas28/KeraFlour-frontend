"use client";

import Loading from "@/app/components/UI/Loading";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Calendar, Clock, Receipt, CreditCard } from "lucide-react";
import Link from "next/link";

function formatTo12Hour(timeStr) {
    if (!timeStr) return "";
    const [hourStr, minuteStr] = timeStr.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr || "00";
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
}

export default function OrderSuccessPage() {
    const router = useRouter();
    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/orders/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                if (!res.ok) throw new Error(`Error fetching order: ${res.status}`);
                const data = await res.json();
                setOrderDetails(data);
            } catch (error) {
                console.error(error);
            }
        }
        if (id) fetchOrder();

        const timer = setTimeout(() => {
            router.push("/");
        }, 6000);
        return () => clearTimeout(timer);
    }, [id, router]);

    if (!orderDetails) return <Loading />;

    return (
        <div className="max-w-xl mx-auto flex flex-col items-center pt-12 pb-20 px-4">
            <CheckCircle size={70} className="text-emerald-600 mb-5 animate-bounce" strokeWidth={1.5} />
            <h2 className="text-3xl font-extrabold text-emerald-700 mb-2">Order Placed Successfully!</h2>
            <p className="text-lg text-gray-700 mb-8">
                Thank you for trusting <span className="font-bold text-emerald-800">Kera Flour</span>
                <br />
                We’re processing your order with care.
            </p>

            <div className="bg-white border border-emerald-100 rounded-2xl shadow p-6 w-full mb-6">
                <div className="flex items-center gap-3 mb-4 text-gray-500">
                    <Receipt size={20} />
                    <span className="font-semibold text-gray-800">Order ID:</span>
                    <span className="text-blue-700 font-mono font-bold tracking-wide">#{orderDetails._id.slice(-8)}</span>
                </div>
                <div className="flex flex-col md:flex-row md:gap-5 text-lg">
                    <div className="flex items-center gap-2 mb-2 md:mb-0">
                        <CreditCard size={18} className="text-gray-400" />
                        <span className="font-medium">{orderDetails.paymentMethod}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2 md:mb-0">
                        <Calendar size={18} className="text-gray-400" />
                        <span>{orderDetails.slotDate.split("T")[0]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={18} className="text-gray-400" />
                        <span>{formatTo12Hour(orderDetails.slotTime)}</span>
                    </div>
                </div>
                <div className="mt-4 text-2xl font-bold text-emerald-700">Total Paid: ₹{orderDetails.totalAmount}</div>
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
