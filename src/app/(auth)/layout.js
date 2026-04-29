import Link from "next/link";
import { Manrope, Inter } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function AuthLayout({ children }) {
  return (
    <div className={`${manrope.variable} ${inter.variable}`}>
      {/* Minimal auth header — replaces the main Navbar */}
      <header className="fixed top-0 w-full z-50 bg-[#f7f9fb]/80 backdrop-blur-lg">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link
            href="/login"
            className="text-xl font-bold tracking-tight text-[#1D9E75] font-[family-name:var(--font-manrope)] antialiased hover:opacity-80 transition-opacity"
          >
            SmartBudol
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
