"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const CartContext = createContext(null);

export default function CartProvider({ children }) {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    const authHeader = () => {
        const token = localStorage.getItem("token");
        return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
    };

    const fetchCart = async () => {
        if (!user) {
            setCart([]);
            return;
        }
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/cart`, {
                headers: authHeader(),
            });
            if (!res.ok) throw new Error("Failed to load cart");
            const data = await res.json();
            setCart(data.items || []);
        } catch (error) {
            console.error("Cart fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (product, quantityKg) => {
        if (!user) {
            toast.error("⚠️ Please login to add items to cart");
            return;
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/cart/items`, {
                method: "POST",
                headers: authHeader(),
                body: JSON.stringify({ productId: product._id, quantityKg }),
            });
            if (!res.ok) throw new Error("Failed to add item");
            const data = await res.json();
            setCart(data.items);
            toast.success(`🛒 ${product.name} added to cart`);
        } catch (err) {
            console.error(err);
            toast.error("❌ Could not add item");
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/cart/items/${productId}`, {
                method: "DELETE",
                headers: authHeader(),
            });
            if (!res.ok) throw new Error("Failed to remove item");
            const data = await res.json();
            setCart(data.items);
            toast.info("🗑️ Item removed from cart");
        } catch (err) {
            console.error(err);
            toast.error("❌ Could not remove item");
        }
    };

    const clearCart = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/cart`, {
                method: "DELETE",
                headers: authHeader(),
            });
            if (!res.ok) throw new Error("Failed to clear cart");
            const data = await res.json();
            setCart(data.items);
            toast.info("🧹 Cart cleared");
        } catch (err) {
            console.error(err);
            toast.error("❌ Could not clear cart");
        }
    };

    return (
        <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
