import { Edit2, Trash2, Clock, IndianRupee } from "lucide-react";
import React from "react";

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-amber-100 flex flex-col">
      <div className="relative h-32 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-amber-300 italic text-xs">No image</div>
        )}
        <div className="absolute top-2 right-2 bg-white/95 text-amber-800 text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm flex items-center border border-amber-50">
          <IndianRupee size={10} className="mr-0.5" />
          {product.pricePerKg}
        </div>
        <div className="absolute top-2 left-2 bg-amber-700/90 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
          {product.machineType || "grain"}
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="text-sm font-black text-amber-900 leading-tight mb-1">
            {product.name}
          </h3>
          <div className="flex items-center text-amber-400 text-[11px]">
            <Clock size={11} className="mr-1" />
            <span className="font-bold uppercase tracking-widest">
              {product.grindingTimePerKg || 10} min/kg
            </span>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-700 hover:text-white font-black text-[11px] transition-all duration-200 border border-amber-100"
          >
            <Edit2 size={12} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-300 hover:bg-red-500 hover:text-white transition-all duration-200 border border-red-50"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
