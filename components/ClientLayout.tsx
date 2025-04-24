"use client";
import { Amplify } from "aws-amplify";
import awsconfig from "../src/aws-exports";
Amplify.configure(awsconfig);

import { getCurrentUser, decodeJWT, fetchAuthSession } from "@aws-amplify/auth";
import * as Auth from '@aws-amplify/auth';
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import Background from "@/components/Background";

interface Permissions {
  groups: string[];
  preferredRole: string | null;
  sub: string | null;
  username: string | null;
}
interface TokenPayload{
  sub?: string;
  "cognito:groups"?: string[];
  "cognito:preferred_role"?: string;
  "cognito:username"?: string;
  [key: string]: any;
}

const AuthContext = createContext<{ 
  isAuthenticated: boolean | null;
  permissions: Permissions | null; 
}>({
  isAuthenticated: null,
  permissions: null,
});

export const useAuth = () => useContext(AuthContext);



function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [permissions, setPermissions] = useState<Permissions | null>(null);
  const [role, setRole] = useState<String | null>();
  const router = useRouter();
  const pathname = usePathname();

  const noAuthRequired = ["/Login"];

  useEffect(() => {
    let isMounted = true; 

    async function checkAuth() {
      try {
        await getCurrentUser();
        if (isMounted) return; //Maybe check this to ensure proper permissions

        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if(!idToken) throw console.error("No ID token found");

        const decoded = decodeJWT(idToken);
        const payload = decoded.payload as TokenPayload;
        const perms: Permissions = {
          groups: payload["cognito:groups"] || [],
          preferredRole: payload["cognito:preferred_role"] || null,
          sub: payload.sub || null,
          username: payload["cognito:username"] || null,
        }

        if(!session.credentials){
          throw new Error("No credentials found in session");
        }
        console.log("Credentials initialized:", session.credentials);


        setIsAuthenticated(true);
        setPermissions(perms);
        setRole(perms.preferredRole);

      } catch (error) {
        console.error("Auth check error:", error);
        if (isMounted) {
          setIsAuthenticated(false);
          setPermissions(null);
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
    <AuthContext.Provider value={{isAuthenticated, permissions}}>
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
