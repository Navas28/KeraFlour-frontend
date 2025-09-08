"use client";

import Link from "next/link";
import React from "react";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateProduct() {
    const [name, setName] = useState("");
    const [pricePerKg, setPricePerKg] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !pricePerKg) {
            toast.error("Please fill all fields");
            return;
        }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("pricePerKg", pricePerKg);
        if (image) formData.append("image", image);

        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/products`, {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("Failed to create product");

            const data = await res.json();
            toast.success(`${data.name} created successfully`);
            setName("");
            setPricePerKg("");
            setImage(null);
        } catch (error) {
            console.error(error);
            toast.error("Error creating product");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="p-6 max-w-xl mx-auto">
            <nav className="text-sm mb-4">
                <ul className="flex items-center gap-2 text-gray-600">
                      <li>
                        <Link href="/dashboard" className="hover:underline text-blue-600">
                            Dashboard
                        </Link>
                    </li>
                    <li>/</li>
                    <li>
                        <Link href="/dashboard/products" className="hover:underline text-blue-600">
                            Products
                        </Link>
                    </li>
                    <li>/</li>
                    <li className="text-gray-800 font-medium">Add Product</li>
                </ul>
            </nav>
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-3 rounded-lg"
                />

                <input
                    type="number"
                    placeholder="Price per Kg"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(e.target.value)}
                    className="w-full border p-3 rounded-lg"
                />

                <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full border p-3 rounded-lg" />

                <button
                    type="submit"
                    disabled={loading} 
                    // disabled={true} 
                    // make to loading in development. true after deployment
                    className="w-full bg-dark1 text-white py-3 rounded-lg font-semibold hover:bg-dark2"
                >
                    {loading ? "Saving..." : "Create Product"}
                </button>
                <p className="text-sm text-red-500 mt-2 text-center">⚠️ Product creation is disabled in demo mode</p>
            </form>
        </div>
    );
}
