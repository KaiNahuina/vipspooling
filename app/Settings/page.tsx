'use client';
import React from 'react'
import Avatar from '@/components/Avatar'



const Settings = () => {
  return (
    <div className="w-full max-w-3xl flex flex-col items-center bg-white px-4 p-[10px] mx-auto">      
      <div className="w-full flex 
      flex-col space-y-8 px-4 
      rounded-lg p-4 shadow-md">

        {/*Avatar Upload*/}
        <div
        className='flex items-center 
        justify-center'
        >
          <div className='px-6 py-3'>
            <Avatar/>
          </div>
        </div>

        {/* First Row Container */}
        <div
        className='flex items-center 
        justify-center'
        >
          <div className='px-6 py-3'>
            <div className="flex flex-col">
              <h2>Full Name</h2>
              <input
                placeholder="Toby green"
                className="px-3 w-[240px] text-[14px] bg-gray-700 p-2 border border-white/10 rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                name="name"
                type="text"
              />
            </div>
          </div> 

          <div className='px-6 py-3'>
            <div className="flex flex-col">
                <h2>Email Address</h2>
                <input
                  placeholder="tobygreen@vipspooling.com"
                  className="px-3 w-[240px] text-[14px] bg-gray-700 p-2 border border-white/10 rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                  name="email"
                  type="email"
                />
              </div>
          </div> 

        </div>

        {/* Second Row Container */}
        <div
        className='flex items-center 
        justify-center'
        >
          <div className='px-6 py-1'>
            <div className="flex flex-col">
              <h2>Role</h2>
              <input
                placeholder="Admin"
                className="px-3 w-[240px] text-[14px] bg-gray-700 p-2 border border-white/10 rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                name="role"
                type="input"
              />
            </div>

          </div> 

          <div className='px-6 py-1'>
            <div className="flex flex-col">
              <h2>Phone Number</h2>
              <input
                placeholder="+1(222)333-4444"
                className="px-3 w-[240px] text-[14px] bg-gray-700 p-2 border border-white/10 rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                name="phone"
                type="tel"
              />
            </div>
          </div> 

        </div>
        
      </div>

      {/* Second Group of components*/}
      <div className="w-full flex 
      flex-col space-y-8 px-4 
      rounded-lg p-4 shadow-md">
        <h2>Preferences</h2>
        
        <div className="flex items-center justify-center">
            {/*First Row*/}
          <div className="px-6 py-1">
            <div className="flex flex-row items-center bg-gray-700 p-4 rounded-lg shadow-md gap-4">
              <h2 className="text-lg font-medium">Email Notifications</h2>
              <label
                className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-gray-900"
              >
                <input className="peer sr-only" id="EmailNotifications" type="checkbox" />
                <span
                  className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"
                ></span>
              </label>
            </div>
          </div>

          <div className="px-6 py-1">
            <div className="flex flex-row items-center bg-gray-700 p-4 rounded-lg shadow-md gap-4">
              <h2 className="text-lg font-medium">Email Notifications</h2>
              <label
                className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-gray-900"
              >
                <input className="peer sr-only" id="EmailNotifications" type="checkbox" />
                <span
                  className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"
                ></span>
              </label>
            </div>
          </div>

        </div>

      </div>

      {/*Third Row*/}
      <div className="w-full flex 
      flex-col space-y-8 px-4 
      rounded-lg p-4 shadow-md">
        <h2>Password Preferences</h2>
        
        <div className="flex items-center justify-center">
            {/*First Row*/}
          <div className="px-6 py-1">
          <div className="flex flex-col">
              <h2>Change Password</h2>
              <input
                className="px-3 w-[240px] text-[14px] bg-gray-700 p-2 border border-white/10 rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                name="changepassword"
                type="password"
              />
            </div>
          </div>

          <div className="px-6 py-1">
            <div className="flex flex-col">
              <h2>Confirm Password</h2>
              <input
                className="px-3 w-[240px] text-[14px] bg-gray-700 p-2 border border-white/10 rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                name="confirmpassword"
                type="password"
              />
            </div>
          </div>

        </div>

      </div>


      <div className="w-[200px] max-w-lg bg-gold-100 
      rounded-lg p-4 shadow-md flex items-center 
      justify-center mt-[15px]">
          <a href="#" className="font-medium text-black dark:text-black-500 hover:underline">
            Save
          </a>
      </div>
    </div>
    )
}

export default Settings