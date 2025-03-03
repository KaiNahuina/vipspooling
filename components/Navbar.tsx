"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CompanyLogo from '../public/logo.png';
import { signOut, fetchAuthSession } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';


const Navbar = () => {
  const router = useRouter();


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
    <div className="w-full bg-white dark:bg-gray-100">
      <nav className="bg-white w-full h-full border-gray-100 dark:bg-gray-100">
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <Link href="/Dashboard" className="flex items-center space-x-3 rtl:space-x-reverse">
            <Image
              src={CompanyLogo}
              className="h-10 w-10 object-contain"
              alt="VIP Spooling Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              VIP Spooling
            </span>
          </Link>

          {/* Hamburger Button */}
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-200 dark:focus:ring-gray-200"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

          {/* Links */} 
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-transparent md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
              <li>
                <Link href="/Dashboard" className="block py-2 px-3 text-gray-900 dark:text-white hover:text-gold-200">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/Team" className="block py-2 px-3 text-gray-900 dark:text-white hover:text-gold-200">
                  My Team
                </Link>
              </li>
              <li>
                <Link href="/Templates" className="block py-2 px-3 text-gray-900 dark:text-white hover:text-gold-200">
                  Templates
                </Link>
              </li>

              {/* Profile Settings Dropdown */}
              <li className="relative group">
                <button
                  type="button"
                  className="flex items-center text-sm rounded-full focus:outline-none hover:ring-2 hover:ring-gold-200"
                  id="user-menu-button"
                >
                  <Image className="w-8 h-8 rounded-full object-contain" src={CompanyLogo} alt="user photo" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 z-50 text-base list-none bg-white dark:bg-gray-100 divide-y divide-gray-100 rounded-lg shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible">
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 dark:text-white">Toby Green</span>
                    <span className="block text-sm text-gray-500 truncate dark:text-white">toby.green@vipspooling.com</span>
                  </div>
                  <ul className="py-2">
                    <li>
                      <Link 
                        href="/Settings" 
                        className="block w-full px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-white"
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button 
                        className="block w-full px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-white text-left"
                        onClick={handleLogout}
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>

                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
