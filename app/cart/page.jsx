"use client";

import { useCart } from "@/context/CartContext";
import React, { useState } from "react";
import Loading from "../components/UI/Loading";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { cart, loading, removeFromCart, clearCart, createOrder } = useCart();
    const router = useRouter();

    const [addOn, setAddOn] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState({ place: "", city: "", state: "", pincode: "" });
    const [pickupAddress, setPickupAddress] = useState({ place: "", city: "", state: "", pincode: "" });
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");

    const totalAmount = cart.reduce((acc, item) => acc + item.pricePerKg * item.quantityKg, 0);
    const addOnPrices = { delivery: 40, pickup: 40, both: 60 };
    const addOnCharge = addOn ? addOnPrices[addOn] : 0;
    const finalAmount = totalAmount + addOnCharge;

    const handleCheckout = async () => {
        const validateAddress = (addr) => Object.values(addr).every((v) => v.trim() !== "");
        if (addOn === "delivery" && !validateAddress(deliveryAddress))
            return toast.error("Enter complete delivery address");
        if (addOn === "pickup" && !validateAddress(pickupAddress)) return toast.error("Enter complete pickup address");
        if (addOn === "both" && (!validateAddress(deliveryAddress) || !validateAddress(pickupAddress)))
            return toast.error("Enter both pickup and delivery addresses");

        if (!date || !time) return toast.error("Select slot date and time");

        const orderData = {
            items: cart.map((item) => ({
                product: item.product,
                name: item.name,
                qty: item.quantityKg,
                price: item.pricePerKg,
            })),
            addOn: addOn || undefined,
            deliveryAddress: addOn === "delivery" || addOn === "both" ? deliveryAddress : undefined,
            pickupAddress: addOn === "pickup" || addOn === "both" ? pickupAddress : undefined,
            addOnCharge: addOn ? addOnCharge : undefined,
            slotDate: date,
            slotTime: time,
            paymentMethod,
            totalAmount: finalAmount,
        };

        if (paymentMethod === "COD") {
            const newOrder = await createOrder(orderData);
            if (newOrder) {
                toast.success("Order placed successfully!");
                router.push(`/order-success/${newOrder._id}`);
            }
        } else if (paymentMethod === "stripe") {
            if (finalAmount < 50) return toast.error("Minimum order amount for Stripe is ₹50. Please add more products.");

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/payments/stripe-checkout`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ orderData }),
                });

                const { url } = await res.json();
                window.location.href = url;
            } catch (error) {
                console.error("Stripe error", error);
                toast.error("Stripe payment failed");
            }
        }
    };

    if (loading) {
        return <Loading />;
    }
    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] py-20">
                <h2 className="text-2xl font-semibold text-gray-800">🛒 Your cart is empty</h2>
                <a
                    href="/"
                    className="mt-6 px-6 py-3 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg font-medium transition"
                >
                    Go to Products
                </a>
            </div>
        );
    }
    const renderAddressInputs = (addr, setAddr) => (
        <div className="grid grid-cols-1 gap-2 mt-2">
            <input
                placeholder="Place"
                value={addr.place}
                onChange={(e) => setAddr({ ...addr, place: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
            <input
                placeholder="City"
                value={addr.city}
                onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
            <input
                placeholder="State"
                value={addr.state}
                onChange={(e) => setAddr({ ...addr, state: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
            <input
                placeholder="Pincode"
                value={addr.pincode}
                onChange={(e) => setAddr({ ...addr, pincode: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-3 sm:p-6">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Your Cart</h2>

            <section className="bg-white rounded-xl shadow mb-6">
                <div className="divide-y divide-gray-200">
                    {cart.map((item) => (
                        <div
                            key={item.product || item.id}
                            className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 px-4"
                        >
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-27 h-18 object-cover rounded-lg border bg-gray-100"
                                />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-lg text-gray-900">{item.name}</span>
                                    <span className="text-sm text-gray-500">₹{item.pricePerKg} / kg</span>
                                    <span className="text-sm text-gray-700">Qty: {item.quantityKg.toFixed(2)} kg</span>
                                    <span className="text-green-600 font-semibold text-sm">
                                        Total: ₹{(item.pricePerKg * item.quantityKg).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.product || item.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full sm:w-auto mt-2 sm:mt-0"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-white rounded-xl shadow p-5 mb-6">
                <h3 className="font-semibold mb-3 text-gray-800">
                    Choose Add-on <span className="text-sm text-gray-400">(Optional)</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                    {Object.entries(addOnPrices).map(([opt, price]) => (
                        <button
                            key={opt}
                            type="button"
                            className={`px-5 py-2 rounded-lg border transition ${
                                addOn === opt
                                    ? "bg-emerald-600 text-white border-emerald-700"
                                    : "bg-gray-100 border-gray-300 text-gray-800"
                            }`}
                            onClick={() => setAddOn(addOn === opt ? "" : opt)}
                        >
                            {opt.charAt(0).toUpperCase() + opt.slice(1)} <span className="text-sm">(+₹{price})</span>
                        </button>
                    ))}
                </div>
                {addOn === "delivery" && renderAddressInputs(deliveryAddress, setDeliveryAddress)}
                {addOn === "pickup" && renderAddressInputs(pickupAddress, setPickupAddress)}
                {addOn === "both" && (
                    <div className="grid sm:grid-cols-2 gap-6 mt-4">
                        <div>
                            <h4 className="font-semibold text-sm mb-2">Pickup Address</h4>
                            {renderAddressInputs(pickupAddress, setPickupAddress)}
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-2">Delivery Address</h4>
                            {renderAddressInputs(deliveryAddress, setDeliveryAddress)}
                        </div>
                    </div>
                )}
            </section>

            {/* Slot Section */}
            <section className="bg-white rounded-xl shadow p-5 mb-6">
                <h3 className="font-semibold mb-3 text-gray-800">Choose Slot</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full sm:w-1/2 border border-gray-300 rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                    <input
                        type="time"
                        min="09:00"
                        max="18:00"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full sm:w-1/2 border border-gray-300 rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                </div>
            </section>

            <section className="bg-white rounded-xl shadow p-5 mb-6">
                <h3 className="font-semibold mb-3 text-gray-800">Payment Method</h3>
                <div className="flex gap-6">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="payment"
                            value="COD"
                            checked={paymentMethod === "COD"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="accent-emerald-600"
                        />
                        <span className="ml-2 text-gray-700">Cash on Delivery</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="payment"
                            value="stripe"
                            checked={paymentMethod === "stripe"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="accent-blue-600"
                        />
                        <span className="ml-2 text-gray-700">
                            Stripe <span className="text-red-500 text-xs ml-1">* above 50</span>
                        </span>
                    </label>
                </div>
            </section>

            <section className="bg-white rounded-xl shadow p-5 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-t">
                <h3 className="text-xl font-bold text-gray-900">
                    Final Total: <span className="text-emerald-700">₹{finalAmount.toFixed(2)}</span>
                </h3>
                <div className="flex gap-4">
                    <button
                        onClick={clearCart}
                        className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                    >
                        Clear Cart
                    </button>
                    <button
                        onClick={handleCheckout}
                        className="px-5 py-2 bg-dark1 text-white rounded-lg hover:bg-emerald-700 shadow-md transition font-semibold"
                    >
                        Place Order
                    </button>
                </div>
            </section>
        </div>
    );
}
