"use client";

import { useAuth } from "@/context/AuthContext";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/UI/Loading";
import Link from "next/link";
import { Trash2, Edit3, Plus, ChevronRight, Package, AlertTriangle, X } from "lucide-react";

export default function ProductPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/products`);
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", editingProduct.name);
            formData.append("pricePerKg", editingProduct.pricePerKg);
            if (editingProduct.imageFile) {
                formData.append("image", editingProduct.imageFile);
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/products/${editingProduct.slug}`, {
                method: "PUT",
                body: formData,
            });

            if (!res.ok) throw new Error("Update failed");

            toast.success("Product updated successfully");
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update product");
        }
    };

    const handleDelete = async (slug) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/products/${slug}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Delete failed");
            toast.success("Product Deleted");
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete product");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
            <nav className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Link href="/" className="hover:text-emerald-600 transition">
                        Home
                    </Link>
                    <ChevronRight size={16} />
                    <Link href="/dashboard" className="hover:text-emerald-600 transition">
                        Dashboard
                    </Link>
                    <ChevronRight size={16} />
                    <span className="text-gray-800 font-medium">Products</span>
                </div>
            </nav>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Product Management</h1>
                    <p className="text-lg text-gray-600">Manage your flour products and inventory</p>
                </div>
                <Link
                    href="/dashboard/products/create-product"
                    className="inline-flex items-center gap-2 bg-dark1 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-xl text-lg"
                >
                    <Plus size={20} />
                    Create Product
                </Link>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
                <div className="flex items-center gap-3">
                    <AlertTriangle size={20} className="text-yellow-600" />
                    <p className="text-yellow-800 font-medium">
                        ⚠️ Note: Delete and Update features are disabled to prevent misuse during demo.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loading />
                </div>
            ) : products.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">Start by creating your first flour product.</p>
                    <Link
                        href="/dashboard/products/create-product"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                        <Plus size={18} />
                        Create First Product
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                        >
                            <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain rounded-lg"
                                />
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                                <p className="text-green-700 font-bold text-xl mb-4 tracking-wider">₹{product.pricePerKg}/kg</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setEditingProduct(product)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-dark1  text-white rounded-lg font-medium transition text-sm"
                                    >
                                        <Edit3 size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.slug)}
                                        disabled
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editingProduct && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
                            <button
                                onClick={() => setEditingProduct(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    value={editingProduct.name}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Kg (₹)</label>
                                <input
                                    type="number"
                                    value={editingProduct.pricePerKg}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, pricePerKg: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                    placeholder="Enter price per kg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditingProduct({ ...editingProduct, imageFile: e.target.files[0] })}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                />
                                <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled
                                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Update Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
