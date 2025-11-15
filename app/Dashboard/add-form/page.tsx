"use client";
import React from 'react'
import { useRouter } from "next/navigation";

const ChooseForm = () => {
  const router = useRouter();
  const chooseForm = (pageName: string) => {
    router.push(pageName);
  }

  return (
    <>
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={() =>chooseForm('/Dashboard')}
            className="w-16 rounded-2xl h-14 relative group mt-2 mr-2"
          >
            <div className="bg-yellow-300 rounded-xl h-12 w-full grid place-items-center absolute left-0 top-0 group-hover:w-full z-10 duration-500">
              <svg
                width="25px"
                height="25px"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#000000"
                  d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                ></path>
                <path
                  fill="#000000"
                  d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                ></path>
              </svg>
            </div>
          </button>
          
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex justify-end">
                <a onClick={() =>chooseForm("/Dashboard/add-form/invoice-form")} 
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
                <a onClick={() =>chooseForm("/Dashboard/add-form/jsa-form")}
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

              
                <div className='flex justify-end'>
                    <a onClick={() =>chooseForm("/Dashboard/add-form/cap-form")}
                    className="cursor-pointer block max-w-sm p-6 bg-white rounded-lg 
                    shadow-sm hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition
                    flex flex-col items-center justify-center w-64 h-48"
                    >
                    <svg className="h-8 w-8 text-yellow-500" 
                        width="24" height="24" viewBox="0 0 24 24" 
                        strokeWidth="2" stroke="currentColor" fill="none" 
                        strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z"/>
                      <rect x="4" y="6" width="16" height="12" rx="2"/>
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M6 9l-2 -2"/>
                      <circle cx="17" cy="8" r="1"/>
                    </svg>

                    <h5 className="text-2xl ml-6 font-bold tracking-tight text-gray-900 dark:text-white">
                      New Capillary Form
                    </h5>
                    </a>
                </div>
            
            </div>

            

          </div>
          
        </div>
      </div>
    </>
  )
}

export default ChooseForm