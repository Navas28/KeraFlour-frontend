"use client";

import Link from "next/link";
import { Truck, Calendar, ShoppingBag, Settings, ArrowRight } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-wide">About Kera Flour</h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                    Custom grinding flour mill service—where user convenience, modern technology, and care meet.
                </p>
            </div>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-6 border border-gray-100">
                    <div className="flex items-center gap-4 mb-2">
                        <Settings size={32} className="text-emerald-600" />
                        <h2 className="text-2xl font-bold text-gray-800">Advanced Grinding</h2>
                    </div>
                    <p className="text-gray-700 text-lg">
                        We use the latest flour milling technologies ensuring your grains are milled with precision,
                        hygiene, and consistency. Our equipment preserves nutrition and taste.
                    </p>
                </div>
                <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-6 border border-gray-100">
                    <div className="flex items-center gap-4 mb-2">
                        <Calendar size={32} className="text-emerald-600" />
                        <h2 className="text-2xl font-bold text-gray-800">Effortless Slot Booking</h2>
                    </div>
                    <p className="text-gray-700 text-lg">
                        Book your grinding slot online—no more waiting in long lines. Choose your preferred date, time, and
                        optional add-ons for a completely personalized flour grinding experience.
                    </p>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">How Kera Flour Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                    <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center shadow border border-gray-100">
                        <ShoppingBag size={32} className="text-yellow-600 mb-3" />
                        <h3 className="text-lg font-semibold mb-2">Bring Your Grains</h3>
                        <p className="text-gray-600 text-base">
                            Rice, wheat, or millets—bring high quality grains of your choice.
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center shadow border border-gray-100">
                        <Calendar size={32} className="text-blue-600 mb-3" />
                        <h3 className="text-lg font-semibold mb-2">Book Your Slot</h3>
                        <p className="text-gray-600 text-base">
                            Select a date and time to avoid queueing and get instant service.
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center shadow border border-gray-100">
                        <Settings size={32} className="text-emerald-600 mb-3" />
                        <h3 className="text-lg font-semibold mb-2">Modern Grinding</h3>
                        <p className="text-gray-600 text-base">
                            Our team grinds and packs your flour using hygienic, precise methods.
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center shadow border border-gray-100">
                        <Truck size={32} className="text-orange-600 mb-3" />
                        <h3 className="text-lg font-semibold mb-2">Pickup & Delivery</h3>
                        <p className="text-gray-600 text-base">
                            Choose pickup, delivery, or both. Delivered fresh and securely to your address.
                        </p>
                    </div>
                </div>
            </section>
            <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white rounded-2xl shadow p-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Affordable Service</h3>
                    <p className="text-gray-700 text-lg">
                        Kera Flour charges a <span className="font-bold text-emerald-700">small service fee</span> for
                        grinding and add-ons like delivery or pickup. Add-ons are optional—you pay only for what you use.
                    </p>
                </div>
                <div className="bg-white rounded-2xl shadow p-8 border border-gray-100 flex flex-col gap-4 justify-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Why Choose Us?</h3>
                    <ul className="text-lg text-gray-700 space-y-2">
                        <li>• Fast, online booking—no waiting</li>
                        <li>• Modern, hygienic mill equipment</li>
                        <li>• Flexible pickup or delivery</li>
                        <li>• Transparent & affordable charges</li>
                        <li>• Locally trusted, customer-focused</li>
                    </ul>
                </div>
            </section>
            <div className="text-center mt-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-dark1 hover:bg-green-700 text-white rounded-xl text-xl font-bold shadow-lg transition"
                >
                    Explore Products <ArrowRight size={24} />
                </Link>
            </div>
        </div>
    );
}
