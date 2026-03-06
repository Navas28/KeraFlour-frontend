"use client";

import { useAuth } from "@/context/AuthContext";
import ProductCard from "../components/ProductCard";
import Loading from "../components/UI/Loading";
import DeleteModal from "../components/UI/DeleteModal";
import {
  Plus,
  X,
  Upload,
  Save,
  Loader2,
  IndianRupee,
  Clock,
  Package,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    pricePerKg: "",
    grindingTimePerKg: "",
    image: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/api/products");
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      pricePerKg: "",
      grindingTimePerKg: "",
      image: null,
    });
    setPreviewUrl(null);
    setEditingProduct(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) return toast.error("Grain Name is required");
    if (!formData.pricePerKg) return toast.error("Price is required");
    if (!formData.grindingTimePerKg)
      return toast.error("Grinding time is required");
    if (!editingProduct && !formData.image)
      return toast.error("An image is required for new grains");

    setIsSaving(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("pricePerKg", formData.pricePerKg);
    data.append("grindingTimePerKg", formData.grindingTimePerKg);
    if (formData.image) data.append("image", formData.image);

    try {
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct.slug}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/api/products", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success(
        editingProduct
          ? "Product updated successfully"
          : "Product added successfully",
      );
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      pricePerKg: product.pricePerKg,
      grindingTimePerKg: product.grindingTimePerKg || 5,
      image: null,
    });
    setPreviewUrl(product.image);
    setIsModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const product = products.find((p) => p._id === deletingId);
      await api.delete(`/api/products/${product.slug}`);
      toast.success("Product deleted successfully");
      setIsDeleteModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 lg:p-10">
      <div className="max-w-screen-2xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Service Catalog
            </h1>
            <p className="text-gray-500">
              Manage the grains and grinding prices for your mill.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-dark1 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/10"
          >
            <Plus size={20} />
            Add New Grain
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={() => handleEdit(product)}
              onDelete={() => openDeleteModal(product._id)}
            />
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">
                No products found. Add your first grain type!
              </p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? "Edit Product" : "Add New Grain"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                      Grain Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Matta Rice"
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                        Price (₹/kg)
                      </label>
                      <div className="relative">
                        <IndianRupee
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="number"
                          value={formData.pricePerKg}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pricePerKg: e.target.value,
                            })
                          }
                          placeholder="0.00"
                          className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                        Time (min/kg)
                      </label>
                      <div className="relative">
                        <Clock
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="number"
                          value={formData.grindingTimePerKg}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              grindingTimePerKg: e.target.value,
                            })
                          }
                          placeholder="5"
                          className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                    Representative Image
                  </label>
                  <div className="relative h-44 w-full bg-gray-100 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden group">
                    {previewUrl ? (
                      <>
                        <img
                          src={previewUrl}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer bg-white text-dark1 px-4 py-2 rounded-lg font-bold text-sm">
                            Change Image
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                      </>
                    ) : (
                      <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                        <Upload className="text-gray-400 mb-2" size={32} />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                          Click to upload
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-14 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-[2] h-14 rounded-2xl font-bold bg-dark1 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}
                  {editingProduct ? "Update Grain" : "Save Grain"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Grain Type?"
        message={`Are you sure you want to delete "${products.find((p) => p._id === deletingId)?.name}"? This action will remove it from the catalog permanently.`}
        isLoading={isDeleting}
      />
    </main>
  );
}
