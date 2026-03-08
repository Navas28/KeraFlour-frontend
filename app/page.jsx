"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Package,
  Zap,
  Plus,
  Trash2,
  X,
  Upload,
  Save,
  Loader2,
  IndianRupee,
  Clock,
  Calendar as CalendarIcon,
  AlertTriangle,
  Settings,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "./components/UI/Loading";
import DeleteModal from "./components/UI/DeleteModal";
import ProductCard from "./components/ProductCard";
import api from "@/lib/api";
import { toast } from "sonner";

const STATUS_LEVELS = [
  {
    id: "free",
    label: "Free",
    color: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    active: "bg-emerald-600 text-white border-emerald-600",
  },
  {
    id: "busy",
    label: "Busy",
    color: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    active: "bg-amber-600 text-white border-amber-600",
  },
  {
    id: "packed",
    label: "Packed",
    color: "bg-red-500",
    text: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    active: "bg-red-600 text-white border-red-600",
  },
  {
    id: "maintenance",
    label: "Service",
    color: "bg-slate-500",
    text: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
    active: "bg-slate-700 text-white border-slate-700",
  },
];

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  // Products State
  const [products, setProducts] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: "",
    pricePerKg: "",
    grindingTimePerKg: "10",
    machineType: "grain",
    image: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  // Schedule State
  const [configs, setConfigs] = useState([]);
  const [machineStatuses, setMachineStatuses] = useState([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleModalType, setScheduleModalType] = useState("holiday");
  const [scheduleFormData, setScheduleFormData] = useState({
    type: "holiday",
    date: new Date().toISOString().split("T")[0],
    dayOfWeek: 0,
    isClosed: true,
    machineType: "both",
    reason: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, configRes, statusRes] = await Promise.all([
        api.get("/api/products"),
        api.get("/api/admin/mill-config"),
        api.get("/api/admin/machine-status"),
      ]);
      setProducts(prodRes.data);
      setConfigs(configRes.data);
      setMachineStatuses(statusRes.data);
    } catch (error) {
      toast.error("Failed to fetch mill data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // --- Product Functions ---
  const resetProductForm = () => {
    setProductFormData({
      name: "",
      pricePerKg: "",
      grindingTimePerKg: "10",
      machineType: "grain",
      image: null,
    });
    setPreviewUrl(null);
    setEditingProduct(null);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productFormData.name || !productFormData.pricePerKg)
      return toast.error("Please fill required fields");

    setIsSavingProduct(true);
    const data = new FormData();
    Object.keys(productFormData).forEach((key) => {
      if (productFormData[key] !== null) data.append(key, productFormData[key]);
    });

    try {
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct.slug}`, data);
      } else {
        await api.post("/api/products", data);
      }
      toast.success("Catalog updated");
      setIsProductModalOpen(false);
      resetProductForm();
      fetchData();
    } catch (error) {
      toast.error("Failed to save product");
    } finally {
      setIsSavingProduct(false);
    }
  };

  const confirmDeleteProduct = async () => {
    setIsDeletingProduct(true);
    try {
      const product = products.find((p) => p._id === deletingProductId);
      await api.delete(`/api/products/${product.slug}`);
      toast.success("Product removed");
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setIsDeletingProduct(false);
    }
  };

  // --- Schedule Functions ---
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/mill-config", scheduleFormData);
      toast.success("Schedule updated");
      setIsScheduleModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to save schedule");
    }
  };

  const handleDeleteConfig = async (id) => {
    try {
      await api.delete(`/api/admin/mill-config/${id}`);
      toast.success("Removed");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const updateMachineStatus = async (machineType, statusId) => {
    try {
      const { data } = await api.post("/api/admin/machine-status", {
        machineType,
        status: statusId,
      });
      setMachineStatuses((prev) =>
        prev.map((s) => (s.machineType === machineType ? data : s)),
      );
      toast.success(`${machineType.toUpperCase()} status updated`);
    } catch (error) {
      toast.error("Failed to update pulse");
    }
  };

  if (authLoading || loading) return <Loading />;

  return (
    <main className="min-h-screen bg-amber-50/20 p-5 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-amber-900 tracking-tight">
              Mill Management Hub
            </h1>
            <p className="text-amber-500 font-medium mt-1">
              Control your products, machine pulse, and schedule in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                resetProductForm();
                setIsProductModalOpen(true);
              }}
              className="flex items-center gap-2 bg-amber-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-800 transition-all shadow-md active:scale-95"
            >
              <Plus size={18} /> Add Product
            </button>
            <button
              onClick={() => {
                setScheduleModalType("holiday");
                setScheduleFormData({ ...scheduleFormData, type: "holiday" });
                setIsScheduleModalOpen(true);
              }}
              className="flex items-center gap-2 bg-white text-amber-800 px-5 py-2.5 rounded-xl font-bold text-sm border-2 border-amber-100 hover:bg-amber-50 transition-all shadow-sm"
            >
              <CalendarIcon size={18} /> Mark Holiday
            </button>
          </div>
        </div>

        {/* Pulse & Stats Control Area */}
        <div className="bg-white rounded-3xl border border-amber-100 shadow-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-amber-50 bg-amber-50/30 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-amber-900">
                Live Pulse Control
              </h2>
              <p className="text-sm text-amber-400 font-medium whitespace-nowrap">
                Instant status updates for customers
              </p>
            </div>
            <div className="h-10 w-10 bg-amber-100 rounded-2xl flex items-center justify-center">
              <Zap size={20} className="text-amber-700" fill="currentColor" />
            </div>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {["grain", "spice"].map((type) => {
              const curStatus =
                machineStatuses.find((s) => s.machineType === type)?.status ||
                "free";
              const level = STATUS_LEVELS.find((l) => l.id === curStatus);
              return (
                <div
                  key={type}
                  className="bg-amber-50/40 rounded-2xl p-6 border border-amber-100/50"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-1 block">
                        {type} Machine
                      </span>
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${level?.color} animate-pulse`}
                        />
                        <span className="text-base font-black text-amber-900 capitalize">
                          {level?.label}
                        </span>
                      </div>
                    </div>
                    <Clock size={22} className="text-amber-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {STATUS_LEVELS.map((lvl) => (
                      <button
                        key={lvl.id}
                        onClick={() => updateMachineStatus(type, lvl.id)}
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-black text-xs transition-all ${
                          curStatus === lvl.id
                            ? lvl.active
                            : `bg-white ${lvl.border} ${lvl.text} hover:${lvl.bg}`
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${curStatus === lvl.id ? "bg-white" : lvl.color}`}
                        />
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Management Tabs/Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Service Catalog - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-amber-900 flex items-center gap-3">
                <Package className="text-amber-500" /> Service Catalog
              </h2>
              <span className="text-xs font-black text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                {products.length} ITEMS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onEdit={() => {
                    setEditingProduct(product);
                    setProductFormData({
                      name: product.name,
                      pricePerKg: product.pricePerKg.toString(),
                      grindingTimePerKg: (
                        product.grindingTimePerKg || 10
                      ).toString(),
                      machineType: product.machineType || "grain",
                      image: null,
                    });
                    setPreviewUrl(product.image);
                    setIsProductModalOpen(true);
                  }}
                  onDelete={() => {
                    setDeletingProductId(product._id);
                    setIsDeleteModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-black text-amber-900 flex items-center gap-3">
              <CalendarIcon className="text-amber-500" /> Planned Closures
            </h2>

            <div className="bg-white rounded-3xl border border-amber-100 p-6 space-y-4 shadow-sm">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setScheduleModalType("holiday");
                    setScheduleFormData({
                      ...scheduleFormData,
                      type: "holiday",
                    });
                    setIsScheduleModalOpen(true);
                  }}
                  className="flex-1 bg-amber-50 text-amber-800 py-3 rounded-2xl font-black text-xs border border-amber-100 hover:bg-amber-100 transition-all"
                >
                  Holiday
                </button>
                <button
                  onClick={() => {
                    setScheduleModalType("schedule");
                    setScheduleFormData({
                      ...scheduleFormData,
                      type: "weekly_schedule",
                    });
                    setIsScheduleModalOpen(true);
                  }}
                  className="flex-1 bg-amber-50 text-amber-800 py-3 rounded-2xl font-black text-xs border border-amber-100 hover:bg-amber-100 transition-all"
                >
                  Weekly Off
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {configs
                  .filter((c) => c.type === "holiday" || c.isClosed)
                  .map((config) => (
                    <div
                      key={config._id}
                      className="flex items-center justify-between p-4 bg-amber-50/50 rounded-2xl border border-amber-100/30 group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-xl ${config.type === "holiday" ? "bg-amber-700" : "bg-amber-200"}`}
                        >
                          <CalendarIcon
                            size={14}
                            className={
                              config.type === "holiday"
                                ? "text-white"
                                : "text-amber-700"
                            }
                          />
                        </div>
                        <div>
                          <p className="text-sm font-black text-amber-900 leading-tight">
                            {config.type === "holiday"
                              ? config.date
                              : `Every ${DAYS[config.dayOfWeek]}`}
                          </p>
                          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mt-0.5">
                            {config.reason || "Closed"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteConfig(config._id)}
                        className="p-2 text-amber-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                {configs.filter((c) => c.type === "holiday" || c.isClosed)
                  .length === 0 && (
                  <div className="py-10 text-center">
                    <p className="text-amber-300 font-black text-xs ">
                      NO SCHEDULED OFF-DAYS
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-amber-100">
            <div className="px-10 py-8 bg-amber-50/50 border-b border-amber-50 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-amber-900">
                  {editingProduct ? "Edit Product" : "New Catalog Item"}
                </h2>
                <p className="text-sm text-amber-400 font-bold tracking-wide uppercase mt-0.5">
                  Grain details & pricing
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-2xl border border-amber-100 text-amber-400 hover:text-amber-900 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleProductSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-2 block">
                      Name
                    </label>
                    <input
                      type="text"
                      value={productFormData.name}
                      onChange={(e) =>
                        setProductFormData({
                          ...productFormData,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-amber-50/50 border-2 border-amber-100 rounded-2xl px-5 py-3.5 font-bold text-amber-900 focus:border-amber-400 focus:bg-white outline-none transition-all"
                      placeholder="e.g. Matta Rice"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-2 block">
                        Price (₹/kg)
                      </label>
                      <input
                        type="number"
                        value={productFormData.pricePerKg}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            pricePerKg: e.target.value,
                          })
                        }
                        className="w-full bg-amber-50/50 border-2 border-amber-100 rounded-2xl px-5 py-3.5 font-bold text-amber-900 focus:border-amber-400 focus:bg-white outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-2 block">
                        Min/kg
                      </label>
                      <input
                        type="number"
                        value={productFormData.grindingTimePerKg}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            grindingTimePerKg: e.target.value,
                          })
                        }
                        className="w-full bg-amber-50/50 border-2 border-amber-100 rounded-2xl px-5 py-3.5 font-bold text-amber-900 focus:border-amber-400 focus:bg-white outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-2 block">
                      Machine
                    </label>
                    <select
                      value={productFormData.machineType}
                      onChange={(e) =>
                        setProductFormData({
                          ...productFormData,
                          machineType: e.target.value,
                        })
                      }
                      className="w-full bg-amber-50/50 border-2 border-amber-100 rounded-2xl px-5 py-3.5 font-bold text-amber-900 focus:border-amber-400 focus:bg-white outline-none transition-all appearance-none"
                    >
                      <option value="grain">Grain Machine</option>
                      <option value="spice">Spice Machine</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-2 block">
                    Image
                  </label>
                  <label className="relative h-full min-h-[160px] w-full bg-amber-50 rounded-[2rem] border-3 border-dashed border-amber-100 flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-white overflow-hidden group transition-all">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload
                        size={32}
                        className="text-amber-200 group-hover:text-amber-500 transition-colors"
                      />
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setProductFormData({
                            ...productFormData,
                            image: file,
                          });
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-4 font-black text-amber-400 border-2 border-amber-50 rounded-2xl hover:bg-amber-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="flex-[2] bg-amber-700 text-white font-black py-4 rounded-2xl hover:bg-amber-800 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {isSavingProduct ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : editingProduct ? (
                    "Update Catalog"
                  ) : (
                    "Save Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-amber-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-amber-900">
                  {scheduleModalType === "holiday"
                    ? "Mark Holiday"
                    : "Weekly Schedule"}
                </h3>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mt-1">
                  Calendar & Off-Days
                </p>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-amber-200 hover:text-amber-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="space-y-6">
              {scheduleModalType === "holiday" ? (
                <div>
                  <label className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2 block">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-amber-50 border-2 border-amber-100 rounded-2xl px-5 py-3.5 font-bold text-amber-900 outline-none focus:border-amber-400 transition-all"
                    value={scheduleFormData.date}
                    onChange={(e) =>
                      setScheduleFormData({
                        ...scheduleFormData,
                        date: e.target.value,
                      })
                    }
                  />
                </div>
              ) : (
                <div>
                  <label className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2 block">
                    Day of Week
                  </label>
                  <select
                    className="w-full bg-amber-50 border-2 border-amber-100 rounded-2xl px-5 py-3.5 font-bold text-amber-900 outline-none focus:border-amber-400 transition-all"
                    value={scheduleFormData.dayOfWeek}
                    onChange={(e) =>
                      setScheduleFormData({
                        ...scheduleFormData,
                        dayOfWeek: parseInt(e.target.value),
                      })
                    }
                  >
                    {DAYS.map((d, i) => (
                      <option key={i} value={i}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2 block">
                  Reason / Info
                </label>
                <input
                  type="text"
                  placeholder="e.g. Festival Closure"
                  className="w-full bg-amber-50 border-2 border-amber-100 rounded-2xl px-5 py-3.5 font-bold text-amber-900 outline-none focus:border-amber-400 transition-all"
                  value={scheduleFormData.reason}
                  onChange={(e) =>
                    setScheduleFormData({
                      ...scheduleFormData,
                      reason: e.target.value,
                    })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full bg-amber-700 text-white font-black py-4 rounded-2xl hover:bg-amber-800 transition-all shadow-lg shadow-amber-900/10 active:scale-95"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteProduct}
        isLoading={isDeletingProduct}
        title="Remove Item?"
        message="This product will be permanently deleted from the catalog and mobile app."
      />
    </main>
  );
}
