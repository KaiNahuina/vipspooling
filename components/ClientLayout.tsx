"use client";

import { Amplify } from "aws-amplify";
import awsconfig from "../src/aws-exports";
Amplify.configure(awsconfig);

import { getCurrentUser } from "@aws-amplify/auth";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import Background from "@/components/Background";



function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const noAuthRequired = ["/Login"];

  useEffect(() => {
    let isMounted = true; // Prevent memory leaks

    async function checkAuth() {
      try {
        await getCurrentUser();
        if (isMounted) setIsAuthenticated(true);
      } catch (error) {
        if (isMounted) {
          setIsAuthenticated(false);
          if(!noAuthRequired.includes(pathname)){          
            router.replace("/Login");
          }
        }
      }
    }

    checkAuth();
    
    return () => {
      isMounted = false; // Cleanup function
    };
  }, [pathname]);

  if (isAuthenticated === null) return <p>Loading</p>;

  if (isAuthenticated && pathname === "/Login") {
    router.push("/Dashboard");
    return null;
  }

  if(!isAuthenticated && pathname === "/Login"){
    return <>{children}</>
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

export default ClientLayout;