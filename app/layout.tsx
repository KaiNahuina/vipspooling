import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vip Spooling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative bg-transparent flex justify-center items-center flex-col gap-10 min-h-screen`}>
        <Navbar />
        <div className="mt-10 relative w-full h-screen">
          <Hero />
          {/* Content rendered over the Hero */}
          <div className="relative inset-0 z-10 flex flex-col justify-center items-center px-5 md:px-20 w-full mb-40"
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
