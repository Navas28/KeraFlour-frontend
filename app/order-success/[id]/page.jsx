"use client";

import Loading from "@/app/components/UI/Loading";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderSuccessPage() {
    const router = useRouter();
    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!res.ok) {
                    throw new Error(`Error fetching order: ${res.status}`);
                }
                const data = await res.json();
                setOrderDetails(data);
            } catch (error) {
                console.error(error);
            }
        }
        if (id) fetchOrder();

        const timer = setTimeout(() => {
            router.push("/");
        }, 5000);
        return () => clearTimeout(timer);
    }, [id, router]);

    if (!orderDetails) return <Loading />;

    return (
        <div className="max-w-2xl mx-auto text-center p-6">
            <h2 className="text-2xl font-bold text-green-600">✅ Order Placed Successfully!</h2>
            <p className="mt-2 text-gray-600">Thank you for your order.</p>

            <div className="border rounded-lg p-4 mt-4 text-left bg-white shadow">
                <p>
                    <span className="font-semibold">Order ID:</span> #{orderDetails._id.slice(-6)}
                </p>
                <p>
                    <span className="font-semibold">Total:</span> ₹{orderDetails.totalAmount}
                </p>
                <p>
                    <span className="font-semibold">Slot:</span> {orderDetails.slotDate.split("T")[0]} at{" "}
                    {orderDetails.slotTime}
                </p>
                <p>
                    <span className="font-semibold">Payment Method:</span> {orderDetails.paymentMethod}
                </p>
            </div>

            <p className="mt-4 text-sm text-gray-500">Redirecting to cart in 5 seconds...</p>
        </div>
    );
}
