"use client";
import Table from '@/components/Table'
import React from 'react'
import Search from '@/components/Search'
import { useRouter } from 'next/navigation'

const Team = () => {
  const router = useRouter();

  return (
    <div className="w-full">
        <div className="flex justify-center items-center flex-col mb-10">
            <h1 className="text-header-lg text-black dark:text-white">My Team</h1>
        </div>
        <div className="min-h-[360px] pt-[25px] flex-grow flex flex-col justify-between rounded-[5px] bg-gray-200 dark:bg-gray-100">
            <div className="mb-[25px] px-4 lg:px-8">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-2xl font-semibold text-black dark:text-white">Team Info</h2>
                <div className="flex items-center gap-4 w-full max-w-md">
                  <Search />

                  <button
                    onClick={() => router.push("/Team/add-member")}
                    className="px-6 bg-gold-200 hover:bg-gold-100 text-gray-800 transition ease-in duration-200
                     text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 
                     rounded-lg cursor-pointer select-none h-[56px]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          <div className="h-full mb-0">
            <Table/>
          </div>
        </div>
    </div>

  )
}

export default Team