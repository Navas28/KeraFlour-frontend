import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthProvider from "@/context/AuthContext";
import CartProvider from "@/context/CartContext";
import { Toaster } from "sonner";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

export const metadata = {
    title: "KeraFlour",
    description: "Book slots easily with pickup & delivery options",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <meta name="apple-mobile-web-app-title" content="KeraFlour" />
                <link rel="manifest" href="/site.webmanifest" />
            </head>
            <body className={poppins.className}>
                <AuthProvider>
                    <CartProvider>
                        <Navbar />
                        {children}
                        <Footer />
                    </CartProvider>
                </AuthProvider>

                <Toaster
                    position="bottom-right"
                    richColors
                    toastOptions={{
                        style: {
                            borderRadius: "12px",
                            fontSize: "15px",
                            padding: "12px 16px",
                        },
                    }}
                />
            </body>
        </html>
    );
}
