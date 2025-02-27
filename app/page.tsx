

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/Login"); // Redirects to login page
  }, []);

  return null; // Nothing renders on the home page
}
