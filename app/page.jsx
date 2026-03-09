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
    id: "maintenance",
    label: "Service",
    color: "bg-slate-400",
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

  // Pulse Modal State
  const [isPulseModalOpen, setIsPulseModalOpen] = useState(false);
  const [pulseData, setPulseData] = useState({
    machineType: "grain",
    statusId: "free",
    minutes: "30",
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

  const updateMachineStatus = async (machineType, statusId, minutes = null) => {
    try {
      let estimatedFreeAt = null;
      if (minutes) {
        estimatedFreeAt = new Date(Date.now() + parseInt(minutes) * 60000);
      }

      const { data } = await api.post("/api/admin/machine-status", {
        machineType,
        status: statusId,
        estimatedFreeAt,
      });
      setMachineStatuses((prev) =>
        prev.map((s) => (s.machineType === machineType ? data : s)),
      );
      toast.success(`${machineType.toUpperCase()} status updated`);
      setIsPulseModalOpen(false);
    } catch (error) {
      toast.error("Failed to update pulse");
    }
  };

  if (authLoading || loading) return <Loading />;

  return (
    <main className="min-h-screen bg-slate-50/50 p-5 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Mill Management Hub
            </h1>
            <p className="text-emerald-600 font-bold uppercase tracking-widest text-[10px] mt-1">
              Control your products, machine pulse, and schedule.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                resetProductForm();
                setIsProductModalOpen(true);
              }}
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
            >
              <Plus size={18} strokeWidth={3} /> Add Product
            </button>
            <button
              onClick={() => {
                setScheduleModalType("holiday");
                setScheduleFormData({ ...scheduleFormData, type: "holiday" });
                setIsScheduleModalOpen(true);
              }}
              className="flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-2xl font-black text-xs border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
            >
              <CalendarIcon size={18} strokeWidth={3} /> Mark Holiday
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Live Pulse Control
              </h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                Instant status updates for customers
              </p>
            </div>
            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
              <Zap size={22} className="text-emerald-600" fill="currentColor" />
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
                  className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-1 block">
                        {type} Machine
                      </span>
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-3 w-3 rounded-full ${level?.color} shadow-sm animate-pulse`}
                        />
                        <span className="text-lg font-black text-slate-900 capitalize">
                          {level?.label}
                        </span>
                      </div>
                    </div>
                    <div className="h-10 w-10 items-center justify-center flex bg-white rounded-xl shadow-sm border border-slate-100">
                      <Clock
                        size={20}
                        className="text-slate-300"
                        strokeWidth={3}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {STATUS_LEVELS.map((lvl) => (
                      <button
                        key={lvl.id}
                        onClick={() => {
                          if (lvl.id === "busy") {
                            setPulseData({
                              machineType: type,
                              statusId: lvl.id,
                              minutes: "30",
                            });
                            setIsPulseModalOpen(true);
                          } else {
                            updateMachineStatus(type, lvl.id);
                          }
                        }}
                        className={`flex items-center justify-center gap-2 py-4 px-4 rounded-[1.25rem] border-2 font-black text-xs transition-all ${
                          curStatus === lvl.id
                            ? lvl.active
                            : `bg-white ${lvl.border} ${lvl.text} hover:${lvl.bg}`
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${curStatus === lvl.id ? "bg-white" : lvl.color}`}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                <Package
                  className="text-emerald-500"
                  size={28}
                  strokeWidth={3}
                />{" "}
                Service Catalog
              </h2>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest">
                {products.length} Items
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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

          <div className="space-y-8">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
              <CalendarIcon
                className="text-emerald-500"
                size={28}
                strokeWidth={3}
              />{" "}
              Planned Closures
            </h2>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 space-y-6 shadow-xl">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setScheduleModalType("holiday");
                    setScheduleFormData({
                      ...scheduleFormData,
                      type: "holiday",
                    });
                    setIsScheduleModalOpen(true);
                  }}
                  className="flex-1 bg-slate-50 text-slate-700 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-all"
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
                  className="flex-1 bg-slate-50 text-slate-700 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-all"
                >
                  Weekly Off
                </button>
              </div>

              <div className="space-y-4 pt-2">
                {configs
                  .filter((c) => c.type === "holiday" || c.isClosed)
                  .map((config) => (
                    <div
                      key={config._id}
                      className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2.5 rounded-xl ${config.type === "holiday" ? "bg-emerald-600" : "bg-emerald-100"}`}
                        >
                          <CalendarIcon
                            size={16}
                            strokeWidth={3}
                            className={
                              config.type === "holiday"
                                ? "text-white"
                                : "text-emerald-700"
                            }
                          />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-tight">
                            {config.type === "holiday"
                              ? config.date
                              : `Every ${DAYS[config.dayOfWeek]}`}
                          </p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                            {config.reason || "Closed"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteConfig(config._id)}
                        className="p-2 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}

                {configs.filter((c) => c.type === "holiday" || c.isClosed)
                  .length === 0 && (
                  <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                    <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.2em] ">
                      No Scheduled Off-Days
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className="px-12 py-10 bg-slate-50/50 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  {editingProduct ? "Edit Product" : "New Catalog Item"}
                </h2>
                <p className="text-[10px] text-emerald-600 font-black tracking-[0.2em] uppercase mt-1">
                  Grain details & pricing
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-slate-900 transition-all shadow-sm"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>
            <form onSubmit={handleProductSubmit} className="p-12 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">
                      Product Name
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
                      className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 focus:border-emerald-400 focus:bg-white outline-none transition-all placeholder:text-slate-200"
                      placeholder="e.g. Matta Rice"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">
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
                        className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 focus:border-emerald-400 focus:bg-white outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">
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
                        className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 focus:border-emerald-400 focus:bg-white outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">
                      Processing Machine
                    </label>
                    <div className="relative">
                      <select
                        value={productFormData.machineType}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            machineType: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 focus:border-emerald-400 focus:bg-white outline-none transition-all appearance-none"
                      >
                        <option value="grain">Grain Machine</option>
                        <option value="spice">Spice Machine</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">
                    Catalog Image
                  </label>
                  <label className="relative h-full min-h-[220px] w-full bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 overflow-hidden group transition-all shadow-inner">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="items-center flex flex-col gap-3">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                          <Upload
                            size={28}
                            className="text-slate-300 group-hover:text-emerald-500 transition-colors"
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          Select Image
                        </span>
                      </div>
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
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-5 font-black text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={true}
                  className="flex-[2] bg-emerald-600 text-white font-black py-5 rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-[11px]"
                >
                  {isSavingProduct ? (
                    <Loader2 className="animate-spin mx-auto text-white" />
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {scheduleModalType === "holiday"
                    ? "Mark Holiday"
                    : "Weekly Schedule"}
                </h3>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">
                  Calendar & Off-Days
                </p>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-300 hover:text-slate-900 transition-colors"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="space-y-8">
              {scheduleModalType === "holiday" ? (
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                    Holiday Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 outline-none focus:border-emerald-400 transition-all font-mono"
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                    Day of Week
                  </label>
                  <select
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 outline-none focus:border-emerald-400 transition-all appearance-none"
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
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                  Closed Reason
                </label>
                <input
                  type="text"
                  placeholder="e.g. Festival Closure"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 outline-none focus:border-emerald-400 transition-all placeholder:text-slate-200"
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
                className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-[11px]"
              >
                Save Schedule
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

      {isPulseModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-12 shadow-2xl border border-slate-100">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Set Manual Time
            </h3>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-8 block">
              Estimated Finish Time
            </p>
            <div className="space-y-10">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">
                  Minutes to complete
                </label>
                <div className="flex items-center gap-5">
                  <input
                    type="number"
                    className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 outline-none focus:border-emerald-400 transition-all text-center text-xl"
                    value={pulseData.minutes}
                    onChange={(e) =>
                      setPulseData({ ...pulseData, minutes: e.target.value })
                    }
                  />
                  <span className="font-black text-slate-300 text-sm uppercase">
                    Min
                  </span>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsPulseModalOpen(false)}
                  className="flex-1 py-5 font-black text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    updateMachineStatus(
                      pulseData.machineType,
                      pulseData.statusId,
                      pulseData.minutes,
                    )
                  }
                  disabled={true}
                  className="flex-[2] bg-emerald-600 text-white font-black py-5 rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-[10px]"
                >
                  Set Pulse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
