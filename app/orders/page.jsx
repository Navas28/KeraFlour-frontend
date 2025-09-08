"use client";

import { useEffect, useState } from "react";
import Loading from "../components/UI/Loading";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/orders/my`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const data = await res.json();

                const ordersArray = Array.isArray(data) ? data : [];

                const formattedOrders = ordersArray.map((o) => ({
                    _id: typeof o._id === "object" && o._id.$oid ? o._id.$oid : o._id,
                    status: o.status,
                    paymentStatus: o.paymentStatus,
                    paymentMethod: o.paymentMethod,
                    addOnCharge: o.addOnCharge || 0,
                    items: (o.items || []).map((i) => ({
                        name: i.name,
                        qty: i.qty,
                        price: i.price,
                    })),
                    slotDate:
                        typeof o.slotDate === "object" && o.slotDate.$date
                            ? new Date(o.slotDate.$date).toLocaleDateString()
                            : new Date(o.slotDate).toLocaleDateString(),
                    slotTime: o.slotTime,
                    totalAmount: o.totalAmount,
                }));

                setOrders(formattedOrders);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">My Orders</h1>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul className="space-y-6">
                    {orders.map((order) => (
                        <li key={order._id} className="p-6 border rounded-lg shadow-sm bg-white">
                            <p>
                                <strong>Order ID:</strong> {order._id}
                            </p>
                            <p>
                                <strong>Status:</strong> {order.status}
                            </p>
                            <p>
                                <strong>Payment Status:</strong> {order.paymentStatus}
                            </p>
                            <p>
                                <strong>Payment Method:</strong> {order.paymentMethod}
                            </p>
                            <p>
                                <strong>Slot Date:</strong> {order.slotDate}
                            </p>
                            <p>
                                <strong>Slot Time:</strong> {order.slotTime}
                            </p>
                            <p>
                                <strong>Add-On Charges:</strong> ₹{order.addOnCharge.toFixed(2)}
                            </p>
                            <p>
                                <strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}
                            </p>

                            <div className="mt-4">
                                <h3 className="font-semibold mb-2">Ordered Items:</h3>
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            {item.name} — Quantity: {item.qty} kg Price ₹{item.price.toFixed(2)} / kg = ₹
                                            {(item.qty * item.price).toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
