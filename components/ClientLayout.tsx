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
  role: string | null;
}>({
  isAuthenticated: null,
  permissions: null,
  role: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if(!context){
    throw new Error("useAuth must be used within an AuthContext Provider");
  }
  return context;
}



function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [permissions, setPermissions] = useState<Permissions | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const noAuthRequired = ["/Login"];

  useEffect(() => {
    let isMounted = true; 

    async function checkAuth() {
      try {
        if (noAuthRequired.includes(pathname) && isAuthenticated === null) {
          if (isMounted) {
            setIsAuthenticated(false);
            setPermissions(null);
            setRole(null);
          }
          return;
        }

        // Fetch session with forceRefresh false to avoid unnecessary token refresh
        const session = await fetchAuthSession({ forceRefresh: false });
        console.log("Session:", session); // Debug session

        if (!session.tokens?.idToken) {
          if (isMounted) {
            setIsAuthenticated(false);
            setPermissions(null);
            setRole(null);
            if (!noAuthRequired.includes(pathname)) {
              router.replace("/Login");
            }
          }
          return;
        }

        // Fetch credentials
        if (!session.credentials) {
          throw new Error("No credentials found in session");
        }
        console.log("Credentials initialized:", session.credentials);

        
        // Decode ID token
        const idToken = session.tokens.idToken.toString();
        const decoded = decodeJWT(idToken);
        const payload = decoded.payload as TokenPayload;
        const perms: Permissions = {
          groups: payload["cognito:groups"] || [],
          preferredRole: payload["cognito:preferred_role"] || null,
          sub: payload.sub || null,
          username: payload["cognito:username"] || null,
        };

        // Check credentials (Identity Pool)
        if (!session.credentials) {
          throw new Error("No credentials found in session");
        }
        console.log("Credentials initialized:", session.credentials);

        // Optional: Validate user
        await getCurrentUser();

        if (isMounted) {
          setIsAuthenticated(true);
          setPermissions(perms);
          setRole(perms.preferredRole);
        }
      } catch (error: any) {
        console.error("Auth check error:", error.message);
        if (isMounted) {
          setIsAuthenticated(false);
          setPermissions(null);
          setRole(null);
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
    <AuthContext.Provider value={{isAuthenticated, permissions, role}}>
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
