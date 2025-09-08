"use client";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
        <nav className="text-sm mb-4">
                <ul className="flex items-center gap-2 text-gray-600">
                      <li>
                        <Link href="/" className="hover:underline text-blue-600">
                            Home
                        </Link>
                    </li>
                    <li>/</li>
                    <li className="text-gray-800 font-medium"> Dashboard</li>
                </ul>
            </nav>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/products"
          className="p-6 bg-white border rounded-xl shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold">📦 Manage Products</h2>
          <p className="text-gray-600 mt-2">Add, edit, or delete products.</p>
        </Link>

        <Link
          href="/dashboard/orders"
          className="p-6 bg-white border rounded-xl shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold">🛒 Manage Orders</h2>
          <p className="text-gray-600 mt-2">View, update status (delivered, canceled, etc).</p>
        </Link>
      </div>
    </div>
  );
}
