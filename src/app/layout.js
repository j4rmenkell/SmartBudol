import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "SmartBudol",
  description: "Find the best value for savvy shoppers",
};

import Navbar from "../components/Navbar";
import { ToastProvider } from '@/components/ui/toast';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${inter.variable} min-h-screen flex flex-col bg-[#f7f9fb] text-[#191c1e] font-sans antialiased`}>
        <ToastProvider>
          <Navbar />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
