import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from 'next/image';
import Link from "next/link";
import CartDrawer from "@/components/CartDrawer";
import { CartIconButton } from "@/components/CartIconButton";
import AuthButton from "@/components/AuthButton";
import { getSessionFromCookies } from "@/lib/auth";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneStopStore — Mini E‑Commerce",
  description: "OneStopStore — a minimal e‑commerce demo built with Next.js and FakeStore API",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSessionFromCookies();
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <header className="sticky top-0 z-20 backdrop-blur bg-white/80 border-b">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/fi_logo.png" alt="OneStopStore" width={36} height={36} />
                <span className="font-bold text-xl text-brand-600">OneStopStore</span>
              </Link>
              <div className="flex gap-6 text-sm items-center">
                <Link href="/" className="hover:text-sky-700">Products</Link>
                <Link href="/checkout" className="hover:text-sky-700">Checkout</Link>
                <Link href="/orders" className="hover:text-sky-700">Orders</Link>
                <AuthButton initialUser={session ? { id: session.id, username: session.username, role: session.role, name: undefined } : null} />
                <CartIconButton />
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-6">{children}<CartDrawer /></main>
          <footer className="mx-auto max-w-6xl px-4 pb-8 pt-12 text-center text-xs text-zinc-500">
            <p>&copy; {new Date().getFullYear()} OneStopStore Demo. Data via FakeStore API.</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
