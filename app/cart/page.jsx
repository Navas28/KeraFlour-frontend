"use client";

import { useCart } from "@/context/CartContext";
import React from "react";
import Loading from "../components/UI/Loading";

export default function CartPage() {
    const { cart, loading, removeFromCart, clearCart } = useCart();

    const totalAmount = cart.reduce((acc, item) => acc + item.pricePerKg * item.quantityKg, 0);
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
                {cart.map((item, index) => (
                    <div
                        key={item.product || index}
                        className="flex items-center justify-between border p-4 rounded-lg shadow-sm bg-white"
                    >
                        <div className="flex items-center gap-4">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                            <div>
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-gray-600">₹{item.pricePerKg} / kg</p>
                                <p className="text-gray-800">
                                    Quantity: <span className="font-medium">{item.quantityKg.toFixed(2)} kg</span>
                                </p>
                                <p className="text-green-600 font-semibold">
                                    Total: ₹{(item.pricePerKg * item.quantityKg).toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => removeFromCart(item.id)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-between items-center border-t pt-4">
                <h3 className="text-xl font-bold">Total: ₹{totalAmount.toFixed(2)}</h3>
                <div className="flex gap-3">
                    <button onClick={clearCart} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">
                        Clear Cart
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Checkout</button>
                </div>
            </div>
        </div>
    );
}
