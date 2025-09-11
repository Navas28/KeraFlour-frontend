"use client";

import { useEffect, useState } from "react";
import Loading from "../components/UI/Loading";
import Link from "next/link";
import { ChevronRight, Calendar, Clock, MapPin, CreditCard, Package } from "lucide-react";

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

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
                    _id: o._id?.toString(),
                    user: {
                        name: o.user?.name || "N/A",
                    },
                    status: o.status,
                    paymentStatus: o.paymentStatus,
                    paymentMethod: o.paymentMethod,
                    addOn: o.addOn || "none",
                    addOnCharge: o.addOnCharge || 0,
                    deliveryAddress: o.deliveryAddress || null,
                    pickupAddress: o.pickupAddress || null,
                    items: (o.items || []).map((i) => ({
                        product: i.product?._id?.toString() || i.product,
                        name: i.name,
                        qty: i.qty,
                        price: i.price,
                    })),
                    slotDate: new Date(o.slotDate).toLocaleDateString(),
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

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "confirmed":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "delivered":
                return "bg-green-100 text-green-800 border-green-200";
            case "canceled":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    function formatTo12Hour(timeStr) {
        if (!timeStr) return "";
        const [hourStr, minuteStr] = timeStr.split(":");
        let hour = parseInt(hourStr, 10);
        const minute = minuteStr || "00";
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    }

    const renderAddress = (title, addr, icon) => {
        if (!addr) return null;
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                    {icon}
                    <h4 className="font-semibold text-gray-800">{title}</h4>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                    <p>
                        <span className="font-medium">Place:</span> {addr.place}
                    </p>
                    <p>
                        <span className="font-medium">City:</span> {addr.city}
                    </p>
                    <p>
                        <span className="font-medium">State:</span> {addr.state}
                    </p>
                    <p>
                        <span className="font-medium">Pincode:</span> {addr.pincode}
                    </p>
                </div>
            </div>
        );
    };

    if (loading) return <Loading />;

    const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
            <nav className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Link href="/" className="hover:text-emerald-600 transition">
                        Home
                    </Link>
                    <ChevronRight size={16} />
                    <span className="text-gray-800 font-medium">My Orders</span>
                </div>
            </nav>

            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
                <p className="text-gray-600">Track and manage your flour orders</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="text-lg font-medium text-gray-700">Filter by Status:</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="delivered">Delivered</option>
                        <option value="canceled">Canceled</option>
                    </select>
                </div>
            </div>
            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
                    <p className="text-gray-600">You haven't placed any orders yet.</p>
                    <Link
                        href="/"
                        className="inline-block mt-6 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Order #{order._id.slice(-8)}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                        </span>
                                    </div>
                                    <div className="text-lg font-bold text-emerald-600">
                                        ₹{order.totalAmount.toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-lg">
                                    <div className="flex items-center gap-2">
                                        <CreditCard size={20} className="text-gray-400" />
                                        <span className="text-gray-600">Payment:</span>
                                        <span className="font-medium">{order.paymentMethod}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={20} className="text-gray-400" />
                                        <span className="text-gray-600">Date:</span>
                                        <span className="font-medium">{order.slotDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={20} className="text-gray-400" />
                                        <span className="text-gray-600">Time:</span>
                                        <span className="font-medium">{formatTo12Hour(order.slotTime)}</span>
                                    </div>
                                    {order.addOn !== "none" && (
                                        <div className="flex items-center gap-2">
                                            <Package size={20} className="text-gray-400" />
                                            <span className="text-gray-600">Add-on:</span>
                                            <span className="font-medium">
                                                {order.addOn} (+₹{order.addOnCharge.toFixed(2)})
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Ordered Items</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b">
                                                        Product
                                                    </th>
                                                    <th className="text-center px-4 py-3 font-semibold text-gray-700 border-b">
                                                        Qty (Kg)
                                                    </th>
                                                    <th className="text-center px-4 py-3 font-semibold text-gray-700 border-b">
                                                        Price/Kg
                                                    </th>
                                                    <th className="text-center px-4 py-3 font-semibold text-gray-700 border-b">
                                                        Subtotal
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.items.map((item, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 border-b text-gray-900">{item.name}</td>
                                                        <td className="px-4 py-3 border-b text-center text-gray-700">
                                                            {item.qty}
                                                        </td>
                                                        <td className="px-4 py-3 border-b text-center text-gray-700">
                                                            ₹{item.price.toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-3 border-b text-center font-semibold text-gray-900">
                                                            ₹{(item.qty * item.price).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {(order.pickupAddress || order.deliveryAddress) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {renderAddress(
                                            "Pickup Address",
                                            order.pickupAddress,
                                            <MapPin size={18} className="text-gray-500" />
                                        )}
                                        {renderAddress(
                                            "Delivery Address",
                                            order.deliveryAddress,
                                            <MapPin size={18} className="text-gray-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
