'use client';
import React, { useState, useEffect } from 'react';
import Avatar from '@/components/Avatar';
import { signOut, fetchAuthSession } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

const Settings = () => {
  const router = useRouter();
  // Initialize dark mode state from localStorage, defaulting to false
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  // Update localStorage whenever the dark mode state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', isDarkMode.toString());
      // Apply dark mode to the body
      if (isDarkMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  // Handle toggle change for dark mode
  const handleDarkModeToggle = () => {
    setIsDarkMode(prevState => !prevState);
  };

  const handleLogout = async () => {
    const user = await fetchAuthSession();
    if(user){
      await signOut(); // Sign the user out
      router.push("/Login"); // Redirect to login page
    }else{
      console.log("No session fetch detected")
    }

  };
  

  return (
    <div className="w-full max-w-3xl flex flex-col items-center px-4 py-10 mx-auto bg-white dark:bg-gray-100">
      {/* Profile Section */}
      <div className="w-full flex flex-col space-y-8 px-4 rounded-lg p-4 shadow-md dark:bg-gray-600">
        {/* Avatar Upload */}
        <div className="flex items-center justify-center">
          <Avatar />
        </div>

        {/* First Row Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="flex flex-col w-full">
            <h2 className="text-sm sm:text-base text-black dark:text-white">Full Name</h2>
            <input
              placeholder="Toby Green"
              className="px-3 w-full text-sm sm:text-base bg-gray-700 dark:bg-gray-600 text-black dark:text-white p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
              name="name"
              type="text"
            />
          </div>

          {/* Email Address */}
          <div className="flex flex-col w-full">
            <h2 className="text-sm sm:text-base text-black dark:text-white">Email Address</h2>
            <input
              placeholder="tobygreen@vipspooling.com"
              className="px-3 w-full text-sm sm:text-base bg-gray-700 dark:bg-gray-600 text-black dark:text-white p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
              name="email"
              type="email"
            />
          </div>
        </div>

        {/* Second Row Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Role */}
          <div className="flex flex-col w-full">
            <h2 className="text-sm sm:text-base text-black dark:text-white">Role</h2>
            <input
              placeholder="Admin"
              className="px-3 w-full text-sm sm:text-base bg-gray-700 dark:bg-gray-600 text-black dark:text-white p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
              name="role"
              type="text"
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col w-full">
            <h2 className="text-sm sm:text-base text-black dark:text-white">Phone Number</h2>
            <input
              placeholder="+1(222)333-4444"
              className="px-3 w-full text-sm sm:text-base bg-gray-700 dark:bg-gray-600 text-black dark:text-white p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
              name="phone"
              type="tel"
            />
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="w-full flex flex-col space-y-8 px-4 rounded-lg p-4 shadow-md mt-8 dark:bg-gray-600">
        <h2 className="text-sm sm:text-base text-black dark:text-white">Preferences</h2>

        <div className="flex flex-col gap-4">
          {/* Email Notifications */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-700 dark:bg-gray-600 p-4 rounded-lg shadow-md">
            <h2 className="text-sm sm:text-base text-black dark:text-white">Email Notifications</h2>
            <label className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 dark:bg-gray-500 transition">
              <input className="peer sr-only" id="EmailNotifications" type="checkbox" />
              <span className="absolute inset-y-0 left-0 m-1 h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-500 transition-all peer-checked:left-6 peer-checked:bg-white"></span>
            </label>
          </div>

          {/* Dark Mode */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-700 dark:bg-gray-600 p-4 rounded-lg shadow-md">
            <h2 className="text-sm sm:text-base text-black dark:text-white">Dark Mode</h2>
            <label className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 dark:bg-gray-500 transition">
              <input
                className="peer sr-only"
                id="DarkMode"
                type="checkbox"
                checked={isDarkMode}
                onChange={handleDarkModeToggle}
              />
              <span className="absolute inset-y-0 left-0 m-1 h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-500 transition-all peer-checked:left-6 peer-checked:bg-white"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Password Preferences */}
      <div className="w-full flex flex-col space-y-8 px-4 rounded-lg p-4 shadow-md mt-8 dark:bg-gray-600">
        <h2 className="text-sm sm:text-base text-black dark:text-white">Password Preferences</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Change Password */}
          <div className="flex flex-col w-full">
            <h2 className="text-sm sm:text-base text-black dark:text-white">Change Password</h2>
            <input
              className="px-3 w-full text-sm sm:text-base bg-gray-700 dark:bg-gray-600 text-black dark:text-white p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
              name="changepassword"
              type="password"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col w-full">
            <h2 className="text-sm sm:text-base text-black dark:text-white">Confirm Password</h2>
            <input
              className="px-3 w-full text-sm sm:text-base bg-gray-700 dark:bg-gray-600 text-black dark:text-white p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
              name="confirmpassword"
              type="password"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="w-full max-w-md bg-button-gradient-metallic rounded-lg p-4 shadow-md flex items-center justify-center mt-6">
        <button className="font-medium text-black dark:text-white hover:underline w-full h-full"
        onClick={handleLogout}
        >Log out</button>
      </div>
    </div>
  );
};

export default Settings;
