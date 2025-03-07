"use client";
import React from 'react'
import { useRouter } from "next/navigation";

const chooseForm = () => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="grid grid-cols-2 gap-2 mb-8">
        
        <div>
          <a onClick={() => router.push("/Dashboard/add-form/invoice-form")} 
          className="cursor-pointer block max-w-sm p-6 bg-white rounded-lg 
          shadow-sm hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition
          flex flex-col items-center justify-center w-64 h-48"
          >

          <svg className="h-8 w-8 text-yellow-500"  width="24" height="24" 
          viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" 
          fill="none" strokeLinecap="round" strokeLinejoin="round">  
          <path stroke="none" d="M0 0h24v24H0z"/>  
          <path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6-6a6 6 0 0 1 -8 -8l3.5 3.5" />
          </svg>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            New Invoice Form
          </h5>

          </a>
        </div>

        <div>
          <a onClick={() => router.push("/Dashboard/add-form/jsa-form")}
          className="cursor-pointer block max-w-sm p-6 bg-white rounded-lg 
          shadow-sm hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition
          flex flex-col items-center justify-center w-64 h-48"
          >
          <svg className="h-8 w-8 text-yellow-500"  
          width="24" height="24" viewBox="0 0 24 24" 
          strokeWidth="2" stroke="currentColor" fill="none" 
          strokeLinecap="round" strokeLinejoin="round">  
          <path stroke="none" d="M0 0h24v24H0z"/>  
          <path d="M9 5H7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2h-2" />  
          <rect x="9" y="3" width="6" height="4" rx="2" />  <path d="M9 14l2 2l4 -4" />
          </svg>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            New JSA Form
          </h5>
          </a>
        </div>

      </div>
    </div>
  )
}

export default chooseForm