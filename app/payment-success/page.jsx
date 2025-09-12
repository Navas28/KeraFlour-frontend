"use client";

import { Suspense } from "react";
import PaymentSuccessContent from "./PaymentSuccessContent";
import Loading from "../components/UI/Loading";

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<Loading />}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
