import { Edit2, Trash2, Clock, IndianRupee } from "lucide-react";
import React from "react";

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
      <div className="relative h-48 flex items-center justify-center overflow-hidden bg-gray-50">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-gray-300 italic">No image</div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-dark1 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center">
          <IndianRupee size={12} className="mr-1" />
          {product.pricePerKg}/kg
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1">
            {product.name}
          </h3>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock size={14} className="mr-1.5 text-emerald-600" />
            <span>{product.grindingTimePerKg || 10} mins / kg</span>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-gray-100 text-gray-700 hover:bg-emerald-600 hover:text-white font-semibold transition-all duration-200"
          >
            <Edit2 size={16} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
