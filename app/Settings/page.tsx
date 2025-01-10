'use client';
import React from 'react';
import Avatar from '@/components/Avatar';

const Settings = () => {
  return (
    <div className="w-full max-w-3xl flex flex-col items-center bg-white px-4 py-10 mx-auto">
      {/* Profile Section */}
      <div className="w-full flex flex-col space-y-8 px-4 rounded-lg p-4 shadow-md">
        {/* Avatar Upload */}
        <div className="flex items-center justify-center">
          <Avatar />
        </div>

        {/* First Row Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="flex flex-col w-full">
            <h2 className="text-sm sm:text-base">Full Name</h2>
            <input
              placeholder="Toby Green"
              className="px-3 w-full text-sm sm:text-base bg-gray-700 text-white p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
              name="name"
              type="text"
            />
          </div>

          {/* Email Address */}
          <div className="flex flex-col w-full">
            <h2 className="text-sm sm:text-base">Email Address</h2>
            <input
              placeholder="tobygreen@vipspooling.com"
              className="px-3 w-full text-sm sm:text-base bg-gray-700 text-white p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
              name="email"
              type="email"
            />
          </div>
        </div>

        {/* Second Row Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Role */}
          <div className="flex flex-col w-full">
            <h2 className="text-sm sm:text-base">Role</h2>
            <input
              placeholder="Admin"
              className="px-3 w-full text-sm sm:text-base bg-gray-700 text-white p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
              name="role"
              type="text"
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col w-full">
            <h2 className="text-sm sm:text-base">Phone Number</h2>
            <input
              placeholder="+1(222)333-4444"
              className="px-3 w-full text-sm sm:text-base bg-gray-700 text-white p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
              name="phone"
              type="tel"
            />
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="w-full flex flex-col space-y-8 px-4 rounded-lg p-4 shadow-md mt-8">
        <h2 className="text-sm sm:text-base">Preferences</h2>

        <div className="flex flex-col gap-4">
          {/* Email Notifications */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-700 p-4 rounded-lg shadow-md">
            <h2 className="text-sm sm:text-base text-black">Email Notifications</h2>
            <label className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition has-[:checked]:bg-gold">
              <input className="peer sr-only" id="EmailNotifications" type="checkbox" />
              <span className="absolute inset-y-0 left-0 m-1 h-6 w-6 rounded-full bg-gray-300 transition-all peer-checked:left-6 peer-checked:bg-white"></span>
            </label>
          </div>

          {/* Dark Mode */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-700 p-4 rounded-lg shadow-md">
            <h2 className="text-sm sm:text-base text-black">Dark Mode</h2>
            <label className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition has-[:checked]:bg-gold">
              <input className="peer sr-only" id="DarkMode" type="checkbox" />
              <span className="absolute inset-y-0 left-0 m-1 h-6 w-6 rounded-full bg-gray-300 transition-all peer-checked:left-6 peer-checked:bg-white"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Password Preferences */}
      <div className="w-full flex flex-col space-y-8 px-4 rounded-lg p-4 shadow-md mt-8">
        <h2 className="text-sm sm:text-base">Password Preferences</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Change Password */}
          <div className="flex flex-col w-full">
            <h2 className="text-sm sm:text-base">Change Password</h2>
            <input
              className="px-3 w-full text-sm sm:text-base bg-gray-700 text-black p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
              name="changepassword"
              type="password"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col w-full">
            <h2 className="text-sm sm:text-base">Confirm Password</h2>
            <input
              className="px-3 w-full text-sm sm:text-base bg-gray-700 text-black p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
              name="confirmpassword"
              type="password"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="w-full max-w-md bg-button-gradient-metallic rounded-lg p-4 shadow-md flex items-center justify-center mt-6">
        <button className="font-medium text-white hover:underline w-full h-full">Save</button>
      </div>
    </div>
  );
};

export default Settings;
