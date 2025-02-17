"use client";
import Search from '@/components/Search'
import Table from '@/components/Table'
import React from 'react'
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  return (
    <div className="w-full">
      {/* Dashboard Title */}
      <div className="flex justify-center items-center flex-col mb-10">
        <h1 className="text-header-lg text-gray-100 dark:text-gray-10">Dashboard</h1>
      </div>

      {/* Dashboard Content */}
      <div className="bg-gray-200 dark:bg-gray-100 min-h-[360px] pt-[25px] flex-grow flex flex-col justify-between rounded-[5px] shadow-lg">
        
        {/* Table Header */}
        <div className="mb-[25px] px-4 lg:px-8">
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-DEFAULT dark:text-gray-10">
              Recent Forms
            </h2>
            <div className="flex items-center gap-4 w-full max-w-md">
              <Search />

              <button
                onClick={() => router.push("/Dashboard/add-form")}
                className="px-6 bg-gold-200 hover:bg-gold-100 text-gray-DEFAULT transition ease-in duration-200
                  text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 
                  rounded-lg cursor-pointer select-none h-[56px]"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="h-full mb-0">
          <Table />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
