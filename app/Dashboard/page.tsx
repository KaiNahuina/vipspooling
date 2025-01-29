import Search from '@/components/Search'
import Table from '@/components/Table'
import React from 'react'

const Dashboard = () => {
  return (
    <div className="w-full">
        <div className="flex justify-center items-center flex-col mb-10">
            <h1 className="text-header-lg">Dashboard</h1>
        </div>
        <div className="bg-white min-h-[360px] pt-[25px] flex-grow flex flex-col justify-between rounded-[5px]">
            <div className="mb-[25px] px-4 lg:px-8">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Recent Forms</h2>
                <div className="w-full max-w-md">
                  <Search />
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

export default Dashboard
