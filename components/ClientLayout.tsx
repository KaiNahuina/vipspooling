"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Background from "@/components/Background";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If user is on the login page, do not show Navbar and Background
  if (pathname === "/Login") {
    return <div>
      {children}
      </div>;
  }

  return (
    <div className="min-h-screen min-w-full">
      <Navbar />
      <div className="mt-10 relative w-full min-h-screen">
        <Background />
        <div className="relative inset-0 z-10 flex flex-col justify-center items-center px-5 md:px-20 w-full mb-40">
          {children}
        </div>
      </div>
    </div>
  );
}
