"use client";

import Link from "next/link";
import React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronRight, Package, Upload, AlertTriangle, Loader2 } from "lucide-react";

export default function CreateProduct() {
    const [name, setName] = useState("");
    const [pricePerKg, setPricePerKg] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

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
            setImagePreview(null);
        } catch (error) {
            console.error(error);
            toast.error("Error creating product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10">
            <nav className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Link href="/dashboard" className="hover:text-emerald-600 transition">
                        Dashboard
                    </Link>
                    <ChevronRight size={16} />
                    <Link href="/dashboard/products" className="hover:text-emerald-600 transition">
                        Products
                    </Link>
                    <ChevronRight size={16} />
                    <span className="text-gray-800 font-medium">Add Product</span>
                </div>
            </nav>

            <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <Package size={32} className="text-emerald-600" />
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Add New Product</h1>
                </div>
                <p className="text-lg text-gray-600">Create a new flour product for your inventory</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
                <div className="flex items-center gap-3">
                    <AlertTriangle size={20} className="text-red-600" />
                    <p className="text-red-800 font-medium">
                        ⚠️ Product creation is disabled in demo mode to prevent misuse.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-2">
                                Product Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="e.g., Premium Rice Flour"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-lg font-semibold text-gray-700 mb-2">
                                Price per Kg (₹)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                                    ₹
                                </span>
                                <input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={pricePerKg}
                                    onChange={(e) => setPricePerKg(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-4 pl-8 text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-lg font-semibold text-gray-700 mb-2">Product Image</label>
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-400 transition">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                                        <p className="text-gray-600 mb-1">Click to upload product image</p>
                                        <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                                    </label>
                                </div>
                                {imagePreview && (
                                    <div className="border border-gray-200 rounded-xl p-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-32 h-32 object-cover rounded-lg mx-auto"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={true} // Change to {loading} for development
                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Creating Product...
                                    </>
                                ) : (
                                    <>
                                        <Package size={20} />
                                        Create Product
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
