"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Loading from "./UI/Loading";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/products`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching products:", err);
                setLoading(false);
            });
    }, []);
    if (loading) return <Loading />;
    return (
        <div>
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
}
