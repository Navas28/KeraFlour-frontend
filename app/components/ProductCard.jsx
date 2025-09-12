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
        <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-[500px] flex flex-col px-2 py-3 sm:px-2 sm:py-4">
            <div className="relative h-60 flex items-center justify-center overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-60 object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-green-700 text-white tracking-wider text-xs font-bold px-2 py-1 rounded-lg">
                    ₹{product.pricePerKg}/kg
                </div>
            </div>
            <div className="flex-1 p-4 flex flex-col justify-between">
                <div className="text-center mb-3">
                   <h3 className="text-sm sm:text-lg font-bold text-gray-800 leading-tight">{product.name}</h3>
                </div>
                <div className="mb-3">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                            type="number"
                            min="0"
                            value={kg}
                            onChange={(e) => setKg(Number(e.target.value))}
                            className="h-9 px-3 border border-gray-300 rounded-lg text-center text-sm font-medium focus:border-green-700 focus:ring-1 focus:ring-green-700"
                            placeholder="0 Kg"
                        />
                        <input
                            type="number"
                            min="0"
                            max="999"
                            value={grams}
                            onChange={(e) => setGrams(Number(e.target.value))}
                            className="h-9 px-3 border border-gray-300 rounded-lg text-center text-sm font-medium focus:border-green-700 focus:ring-1 focus:ring-green-700"
                            placeholder="0 G"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-6 flex items-center justify-center">
                        {totalKg > 0 ? (
                            <span className="text-base font-bold text-dark1">Total: ₹{totalPrice.toFixed(2)}</span>
                        ) : (
                            <span className="text-xs text-gray-400">Select quantity</span>
                        )}
                    </div>
                    <button
                        disabled={totalKg <= 0}
                        onClick={handleAdd}
                        className={`w-full h-10 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                            totalKg > 0
                                ? "bg-dark1 text-white transform hover:scale-105 shadow-lg"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
