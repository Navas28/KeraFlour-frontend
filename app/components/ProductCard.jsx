import { Edit2, Trash2, Clock, IndianRupee } from "lucide-react";
import React from "react";

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="group bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-slate-100 flex flex-col">
      <div className="relative h-40 flex items-center justify-center overflow-hidden bg-slate-50/50">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="text-slate-200 italic font-black text-[10px] uppercase tracking-widest">
            No image
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/95 text-slate-900 text-[11px] font-black px-3 py-1.5 rounded-xl shadow-sm flex items-center border border-slate-50">
          <IndianRupee
            size={10}
            className="mr-0.5 text-emerald-600"
            strokeWidth={3}
          />
          {product.pricePerKg}
        </div>
        <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-[0.1em] shadow-lg shadow-emerald-600/20">
          {product.machineType || "grain"}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="text-base font-black text-slate-900 leading-tight mb-1">
            {product.name}
          </h3>
          <div className="flex items-center text-emerald-600 text-[10px]">
            <Clock size={12} className="mr-1.5" strokeWidth={3} />
            <span className="font-black uppercase tracking-widest">
              {product.grindingTimePerKg || 10} min/kg
            </span>
          </div>
        </div>

        <div className="mt-auto flex gap-3">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-slate-50 text-slate-600 hover:bg-emerald-600 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all duration-300 border border-slate-100 shadow-sm"
          >
            <Edit2 size={12} strokeWidth={3} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-300 hover:bg-rose-500 hover:text-white transition-all duration-300 border border-rose-100"
          >
            <Trash2 size={14} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
