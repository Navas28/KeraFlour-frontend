"use client";

import { useEffect, useState } from "react";
import Loading from "@/app/components/UI/Loading";
import Link from "next/link";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/orders`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch orders");
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/orders/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Failed to update status");
            await fetchOrders();
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const format12Hour = (time) => {
        const [hour, minute] = time.split(":").map(Number);
        let suffix = "AM";
        let h = hour;
        if (h >= 12) {
            suffix = "PM";
            if (h > 12) h -= 12;
        }
        if (h === 0) h = 12;
        return `${h}:${minute.toString().padStart(2, "0")} ${suffix}`;
    };

    if (loading) return <Loading />;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <nav className="text-sm mb-4">
                <ul className="flex items-center gap-2 text-gray-600">
                    <li>
                        <Link href="/dashboard" className="hover:underline text-blue-600">
                            Dashboard
                        </Link>
                    </li>
                    <li>/</li>
                    <li className="text-gray-800 font-medium">Orders</li>
                </ul>
            </nav>
            <h1 className="text-2xl font-bold mb-6">🛒 Order Management</h1>

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="grid gap-6 md:gap-4">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="border rounded-lg shadow-sm bg-white p-4 md:p-6"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                                <h2 className="font-semibold text-lg">Order #{order._id}</h2>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        order.paymentStatus === "paid"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {order.paymentStatus}
                                </span>
                            </div>

                            {/* Items */}
                            <div className="mb-3">
                                <h3 className="font-medium text-gray-700">Items:</h3>
                                <ul className="list-disc ml-5 text-gray-600">
                                    {order.items.map((item) => (
                                        <li key={item._id}>
                                            {item.name} × {item.qty} @ ₹{item.price}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Delivery / Pickup info */}
                            <div className="mb-3">
                                {order.address === "pickup" ? (
                                    <p className="text-gray-700">
                                        <span className="font-medium">Pickup Order</span> <br />
                                        Date: {new Date(order.slotDate).toLocaleDateString()} <br />
                                        Time: {format12Hour(order.slotTime)}
                                    </p>
                                ) : (
                                    <p className="text-gray-700">
                                        <span className="font-medium">Delivery Address:</span>{" "}
                                        {order.address}
                                        <br />
                                        Date: {new Date(order.slotDate).toLocaleDateString()} <br />
                                        Time: {format12Hour(order.slotTime)}
                                    </p>
                                )}
                            </div>

                            {/* Add-on & Amount */}
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-3">
                                <p className="text-gray-600">
                                    <span className="font-medium">AddOn:</span> {order.addOn} (
                                    ₹{order.addOnCharge})
                                </p>
                                <p className="text-lg font-bold">Total: ₹{order.totalAmount}</p>
                            </div>

                            {/* Payment method & status */}
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                                <p className="text-gray-600">
                                    Method: <span className="font-medium">{order.paymentMethod}</span>
                                </p>

                                <div className="flex items-center gap-3">
                                    <span className="text-gray-600">Status:</span>
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                        className="border rounded px-2 py-1"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="canceled">Canceled</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
