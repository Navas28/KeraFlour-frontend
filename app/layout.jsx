import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import AuthProvider from "@/context/AuthContext";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata = {
  title: "KeraFlour Mill Admin",
  description:
    "Professional mill management — schedule, inventory and machine control",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="KeraFlour" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className} style={{ backgroundColor: "#f8fafc" }}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{
            style: {
              borderRadius: "14px",
              fontSize: "14px",
              padding: "12px 16px",
              fontWeight: "600",
            },
          }}
        />
      </body>
    </html>
  );
}
