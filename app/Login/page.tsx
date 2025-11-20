"use client";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { signIn, confirmSignIn, rememberDevice, getCurrentUser} from "@aws-amplify/auth";

const LoginForm = () => {
  
  const router = useRouter(); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState(""); 
  const [isNewPasswordRequired, setIsNewPasswordRequired] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        await getCurrentUser();
        console.log("User already authenticated, redirecting to Main Page");
        router.push("/Dashboard");
      } catch (err) {
        console.log("No authenticated user found");
      }
    }
    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await signIn({ username, password });
      if (keepSignedIn) {
        await rememberDevice();
      }
  
      if (user.nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
        setIsNewPasswordRequired(true);
        const newPassword = prompt("Enter a new password:");
        if (newPassword) {
          await confirmSignIn({ challengeResponse: newPassword });
          console.log("Password confirmed successfully!");
          await handleNewPasswordSubmit(e);
        }
      }
      else {
        console.log("Login successful", user);
        router.push("/Dashboard");
      }
    } catch (err: any) {
      if (err.name === "UserAlreadyAuthenticatedException") {
        console.log("User already authenticated, redirecting to Main Page");
        router.push("/Dashboard");
      } else {
        setError(err.message || "Invalid username or password.");
        router.push("/Landing");
        console.error("Login error:", err);
      }
    }
  };

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (newPassword) {
        await confirmSignIn({ challengeResponse: newPassword });
        console.log("Password confirmed successfully!");
        router.push("/Dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Error confirming the new password.");
      console.error("New password error:", err);
    }
  };
  


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background-gradient">
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

          <form onSubmit={handleLogin}>
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

          {isNewPasswordRequired && (
            <div className="w-full flex flex-col gap-2">
              <label className="font-semibold text-xs text-gray">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                placeholder="••••••••"
                onChange={(e) => setNewPassword(e.target.value)}
                className="border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
              />
            </div>
          )}

          {/* Login Button */}
            <div>
              <button
              type="submit"
                className="py-2 px-8 bg-gold-200 hover:bg-gold-100 text-gray w-full 
                transition ease-in duration-200 text-center text-base font-semibold shadow-md 
                focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none"
                
              >
                Login
              </button>
            </div>
          
          </form>
          


        </div>
      </div>
      
    </div>
  );
};

export default LoginForm;

