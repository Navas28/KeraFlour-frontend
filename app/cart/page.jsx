"use client";

import { useCart } from "@/context/CartContext";
import React, { useState } from "react";
import Loading from "../components/UI/Loading";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { cart, loading, removeFromCart, clearCart, createOrder } = useCart();

    const [addOn, setAddOn] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [pickupAddress, setPickupAddress] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const router = useRouter();

    const totalAmount = cart.reduce((acc, item) => acc + item.pricePerKg * item.quantityKg, 0);

    const addOnPrices = {
        delivery: 40,
        pickup: 40,
        both: 60,
    };

    const addOnCharge = addOn ? addOnPrices[addOn] : 0;
    const finalAmount = totalAmount + addOnCharge;

    const handleCheckout = async () => {
        if(finalAmount < 50){
              return toast.error("Minimum order amount is ₹50. Please add more products.");
        }
        if (addOn === "delivery" && !deliveryAddress.trim()) {
            return toast.error("Enter delivery address");
        }
        if (addOn === "pickup" && !pickupAddress.trim()) {
            return toast.error("Enter pickup address");
        }
        if (addOn === "both" && (!deliveryAddress.trim() || !pickupAddress.trim())) {
            return toast.error("Enter both pickup and delivery addresses");
        }
        if (!date || !time) return toast.error("Select slot date and time");
        const orderData = {
            items: cart.map((item) => ({
                product: item.product,
                name: item.name,
                qty: item.quantityKg,
                price: item.pricePerKg,
            })),
            addOn: addOn || undefined,
            address:
                addOn === "delivery"
                    ? deliveryAddress
                    : addOn === "pickup"
                    ? pickupAddress
                    : addOn === "both"
                    ? `${pickupAddress} / ${deliveryAddress}`
                    : undefined,
            addOnCharge: addOn ? addOnCharge : undefined,
            slotDate: new Date(date),
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
            <div className="text-center min-h-screen justify-center items-center">
                <h2 className="text-xl font-semibold">🛒 Your cart is empty</h2>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">🛍️ Your Cart</h2>
            <div className="space-y-4">
                {cart.map((item) => (
                    <div
                        key={item.product || item.id}
                        className="flex items-center justify-between border p-4 rounded-lg shadow-sm bg-white"
                    >
                        <div className="flex items-center gap-4">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                            <div>
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-gray-600">₹{item.pricePerKg} / kg</p>
                                <p className="text-gray-800">Qty: {item.quantityKg.toFixed(2)} kg</p>
                                <p className="text-green-600 font-semibold">
                                    Total: ₹{(item.pricePerKg * item.quantityKg).toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => removeFromCart(item.product || item.id)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            <div className="border p-4 rounded-lg bg-white space-y-3 mt-6">
                <h3 className="font-semibold">Choose Add-on (Optional)</h3>
                <div className="flex gap-3 flex-wrap">
                    {Object.entries(addOnPrices).map(([opt, price]) => (
                        <button
                            key={opt}
                            type="button"
                            className={`px-4 py-2 rounded-lg border ${
                                addOn === opt ? "bg-green-600 text-white" : "bg-gray-100"
                            }`}
                            onClick={() => setAddOn(addOn === opt ? "" : opt)}
                        >
                            {opt.toUpperCase()} (+₹{price})
                        </button>
                    ))}
                </div>
                {addOn === "delivery" && (
                    <input
                        type="text"
                        placeholder="Enter delivery address"
                        className="w-full border p-2 rounded mt-2"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                )}
                {addOn === "pickup" && (
                    <input
                        type="text"
                        placeholder="Enter pickup address"
                        className="w-full border p-2 rounded mt-2"
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                    />
                )}
                {addOn === "both" && (
                    <div className="space-y-2 mt-2">
                        <input
                            type="text"
                            placeholder="Enter pickup address"
                            className="w-full border p-2 rounded"
                            value={pickupAddress}
                            onChange={(e) => setPickupAddress(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Enter delivery address"
                            className="w-full border p-2 rounded"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                        />
                    </div>
                )}
            </div>
            <div className="border p-4 rounded-lg bg-white space-y-3 mt-6">
                <h3 className="font-semibold">Choose Slot</h3>
                <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <input
                    type="time"
                    min="09:00"
                    max="18:00"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full border p-2 rounded"
                />
            </div>
            <div className="border p-4 rounded-lg bg-white space-y-3 mt-6">
                <h3 className="font-semibold">Payment Method</h3>
                <div className="flex gap-4">
                    <label>
                        <input
                            type="radio"
                            name="payment"
                            value="COD"
                            checked={paymentMethod === "COD"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span className="ml-2">Cash on Delivery</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="payment"
                            value="stripe"
                            checked={paymentMethod === "stripe"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span className="ml-2">Stripe <i className="text-red-600 text-xs">* above 50</i></span>
                    </label>
                </div>
            </div>
            <div className="mt-6 flex justify-between items-center border-t pt-4">
                <h3 className="text-xl font-bold">Final Total: ₹{finalAmount.toFixed(2)}</h3>
                <div className="flex gap-3">
                    <button onClick={clearCart} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">
                        Clear Cart
                    </button>
                    <button
                        onClick={handleCheckout}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}
