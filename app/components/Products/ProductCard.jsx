"use client";

import { useCart } from "@/context/CartContext";
import React, { useState } from "react";

export default function ProductCard({ product }) {
    const [kg, setKg] = useState(0);
    const [grams, setGrams] = useState(0);
    const { addToCart } = useCart();

    const totalKg = kg + grams / 1000;
    const totalPrice = totalKg * product.pricePerKg;

    const handleAdd = () => {
        if (totalKg <= 0) return;
        addToCart(product, totalKg);
        setKg(0);
        setGrams(0);
    };

    return (
        <div className="border rounded-xl shadow-md p-4 flex flex-col items-center bg-white">
            <img src={product.image} alt={product.name} className="w-40 h-40 object-cover mb-4 rounded-lg" />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">₹{product.pricePerKg} / kg</p>

            <div className="mt-4 flex flex-col items-center gap-3">
                <div className="flex gap-2">
                    <input
                        type="number"
                        min="0"
                        value={kg}
                        onChange={(e) => setKg(Number(e.target.value))}
                        className="w-20 p-2 border rounded-md text-center"
                        placeholder="Kg"
                    />
                    <input
                        type="number"
                        min="0"
                        max="999"
                        value={grams}
                        onChange={(e) => setGrams(Number(e.target.value))}
                        className="w-24 p-2 border rounded-md text-center"
                        placeholder="Grams"
                    />
                </div>

                {totalKg > 0 && (
                    <p className="font-medium">
                        Total: <span className="text-green-600">₹{totalPrice.toFixed(2)}</span>
                    </p>
                )}

                <button
                    disabled={totalKg <= 0}
                    onClick={handleAdd}
                    className={`px-4 py-2 rounded-lg text-white ${
                        totalKg > 0 ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
