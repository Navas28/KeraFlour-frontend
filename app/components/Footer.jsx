import { Facebook, Linkedin, Instagram, MessageCircle, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="flex flex-col space-y-8 justify-center items-center mt-10 mb-6 px-4">
            <nav className="flex justify-center flex-wrap gap-8 text-gray-500 font-medium text-base">
                <Link href="/" className="hover:text-emerald-700 transition">
                    Home
                </Link>
                <Link href="about" className="hover:text-emerald-700 transition" >
                    About
                </Link>
            </nav>

            <div className="flex justify-center gap-5">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <Facebook size={28} className="text-gray-400 hover:text-emerald-700 transition" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin size={28} className="text-gray-400 hover:text-emerald-700 transition" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram size={28} className="text-gray-400 hover:text-emerald-700 transition" />
                </a>
                <a href="https://messenger.com" target="_blank" rel="noopener noreferrer" aria-label="Messenger">
                    <MessageCircle size={28} className="text-gray-400 hover:text-emerald-700 transition" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <Twitter size={28} className="text-gray-400 hover:text-emerald-700 transition" />
                </a>
            </div>
            <p className="text-center text-gray-600 font-medium text-sm">&copy; 2025 KeraFlour Ltd. All rights reserved.</p>
        </footer>
    );
}
