"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const CartContext = createContext(null);

export default function CartProvider({ children }) {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem("cart");
        if (stored) {
            setCart(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantityKg) => {
        if (!user) {
            toast.error("⚠️ Please login to add items to cart", {
                description: "You need to be logged in before adding products.",
            });
            return;
        }

        const exists = cart.find((item) => item._id === product._id);

        setCart((prev) => {
            if (exists) {
                return prev.map((item) =>
                    item._id === product._id ? { ...item, quantityKg: item.quantityKg + quantityKg } : item
                );
            } else {
                return [...prev, { ...product, quantityKg }];
            }
        });

        if (exists) {
            toast.success("✅ Cart Updated", {
                description: `${product.name} quantity increased.`,
            });
        } else {
            toast.success("🛒 Item Added", {
                description: `${product.name} added to your cart.`,
            });
        }
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item._id !== id));
        toast.info("🗑️ Item Removed", {
            description: "Product removed from your cart.",
        });
    };

    const clearCart = () => {
        setCart([]);
        toast.info("🧹 Cart Cleared", {
            description: "All items removed from cart.",
        });
    };

    return <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>{children}</CartContext.Provider>;
}

export function useCart() {
    return useContext(CartContext);
}
