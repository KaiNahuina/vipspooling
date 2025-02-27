"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import {signIn} from "@aws-amplify/auth";


const LoginForm = () => {
  
  const router = useRouter(); // To handle redirection after login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const user = await signIn({ username, password }); // Sign in using Cognito
      console.log("Login successful", user);
  
      router.push("/Dashboard"); // Redirect after successful login
    } catch (err: any) {
      setError(err.message || "Invalid username or password.");
      console.error("Login error:", err);
    }
  };
  




  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background-gradient">
      <div className="min-h-96 px-8 py-6 mt-4 text-left bg-gray-200 dark:bg-white rounded-xl shadow-lg">
        <div className="flex flex-col justify-center items-center h-full select-none">
          {/* Logo Section */}
          <div className="flex flex-col items-center justify-center gap-2 mb-8">
            <img 
              src="/logo.png" 
              alt="App Logo" 
              className="w-24 h-24 bg-transparent" 
            />
            <p className="m-0 text-header-sm font-semibold text-gray">
              Login
            </p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Username Field */}
          <div className="w-full flex flex-col gap-2">
            <label className="font-semibold text-xs text-gray">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className="border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
            />
          </div>

          {/* Password Field */}
          <div className="w-full flex flex-col gap-2">
            <label className="font-semibold text-xs text-gray">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
            />
          </div>

          {/*Keep me logged in section*/}
          <div className="flex items-center mb-4">
            <input 
              id="keep-logged-in" 
              type="checkbox" 
              className="h-4 w-4 text-gold-200 border-gray-300 rounded focus:ring-gold-100" 
            />
            <label 
              htmlFor="keep-logged-in" 
              className="ml-2 text-sm font-medium text-gray-300 select-none"
            >
              Keep me logged in
            </label>
          </div>

          {/* Login Button */}
          <div>
            <button
              className="py-2 px-8 bg-gold-200 hover:bg-gold-100 text-gray w-full 
              transition ease-in duration-200 text-center text-base font-semibold shadow-md 
              focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
