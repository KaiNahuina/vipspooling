"use client";
import { Amplify } from "aws-amplify";
import awsconfig from "../src/aws-exports";
Amplify.configure(awsconfig);

import { getCurrentUser } from "@aws-amplify/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import Background from "@/components/Background";

const AuthContext = createContext<{ isAuthenticated: boolean | null }>({
  isAuthenticated: null,
});

export const useAuth = () => useContext(AuthContext);

function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const noAuthRequired = ["/Login"];

  useEffect(() => {
    let isMounted = true; 

    async function checkAuth() {
      try {
        await getCurrentUser();
        if (isMounted) setIsAuthenticated(true);
      } catch (error) {
        if (isMounted) {
          setIsAuthenticated(false);
          if (!noAuthRequired.includes(pathname)) {
            router.replace("/Login");
          }
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  useEffect(() => {
    if (isAuthenticated && pathname === "/Login") {
      router.push("/Dashboard");
    }
  }, [isAuthenticated, pathname, router]);

  if (isAuthenticated === null) return (/* From Uiverse.io by Javierrocadev */ 
  <div className="flex flex-row gap-2">
    <div className="w-4 h-4 rounded-full bg-gold-100 animate-bounce"></div>
    <div className="w-4 h-4 rounded-full bg-gold-100 animate-bounce [animation-delay:-.3s]"></div>
    <div className="w-4 h-4 rounded-full bg-gold-100 animate-bounce [animation-delay:-.5s]"></div>
  </div>);

  // **Handle login page separately (without navbar & background)**
  if (!isAuthenticated && pathname === "/Login") {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        {children}
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{isAuthenticated}}>
      <div className="min-h-screen min-w-full">
        {pathname !== "/Login" && (
            <div className="fixed top-0 left-0 right-0 z-50">
              <Navbar />
            </div>
          )}
        <div className="mt-10 relative w-full min-h-screen">
          <Background />
          <div className="relative inset-0 z-10 flex flex-col justify-center items-center px-5 md:px-20 w-full mt-40 mb-40">
            {children}
          </div>
        </div>
      </div>
    </AuthContext.Provider>
  );
}

export default ClientLayout;
