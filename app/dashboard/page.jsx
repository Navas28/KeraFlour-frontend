import Link from "next/link";
import { ChevronRight, Package, ShoppingCart, BarChart3, Settings } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
            <nav className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Link href="/" className="hover:text-emerald-600 transition">
                        Home
                    </Link>
                    <ChevronRight size={16} />
                    <span className="text-gray-800 font-medium">Dashboard</span>
                </div>
            </nav>
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-lg text-gray-600">Manage your flour mill business operations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
                <Link
                    href="/dashboard/products"
                    className="group p-6 md:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
                            <Package size={24} className="text-emerald-600" />
                        </div>
                        <ChevronRight size={20} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-900 transition-colors">
                        Manage Products
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Add, edit, or delete flour products. Update pricing and inventory.
                    </p>
                </Link>
                <Link
                    href="/dashboard/orders"
                    className="group p-6 md:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
                            <ShoppingCart size={24} className="text-emerald-600" />
                        </div>
                        <ChevronRight size={20} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-900 transition-colors">
                        Manage Orders
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        View customer orders, update status, track deliveries and payments.
                    </p>
                </Link>
            </div>
        </div>
    );
}
