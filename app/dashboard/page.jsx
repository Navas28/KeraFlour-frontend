"use client";

import { useAuth } from "@/context/AuthContext";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";
import Loading from "../components/UI/Loading";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function Dashboard() {
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
            console.error(err);
            toast.error("Failed to update product");
        }
    };

    const handleDelete = async (slug) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/products/${slug}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Delet failed");
            toast.success("Product Deleted");
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete product");
        }
    };
    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Dashboard – Product Management</h1>
                <Link
                    href="/dashboard/create-product"
                    className="bg-dark1 text-white px-5 py-2 rounded-lg font-semibold hover:bg-dark2 transition"
                >
                    + Create Product
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loading />
                </div>
            ) : products.length === 0 ? (
                <p className="text-gray-600">No products found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="border rounded-xl p-4 shadow-sm bg-white">
                            <img src={product.image} alt={product.name} className="h-40 w-full object-cover rounded-md" />
                            <h2 className="mt-3 font-semibold text-lg">{product.name}</h2>
                            <p className="text-gray-600">₹ {product.pricePerKg}/Kg</p>

                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => setEditingProduct(product)}
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product.slug)}
                                    // disabled
                                     // remove disabled for development
                                    className="px-3 py-1 text-sm bg-red-600 flex text-white rounded"
                                >
                                    <Trash2 size={18} /> (Disabled)
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!loading && (
                <p className="mt-8 text-sm text-black rounded-md py-2 bg-yellow-100 text-center tracking-wide">
                    ⚠️ Note: Delete and Update features are disabled to prevent misuse.
                </p>
            )}
            {editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <input
                                type="text"
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                className="w-full border p-2 rounded"
                                placeholder="Product Name"
                                required
                            />
                            <input
                                type="number"
                                value={editingProduct.pricePerKg}
                                onChange={(e) => setEditingProduct({ ...editingProduct, pricePerKg: e.target.value })}
                                className="w-full border p-2 rounded"
                                placeholder="Price Per Kg"
                                required
                            />
                            <input
                                type="file"
                                onChange={(e) => setEditingProduct({ ...editingProduct, imageFile: e.target.files[0] })}
                                className="w-full"
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="px-3 py-1 text-sm bg-gray-400 text-white rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    // disabled
                                     // remove disabled for development
                                    className="px-3 py-1 text-sm bg-green-600 text-white rounded"
                                >
                                    Update (Disabled)
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
