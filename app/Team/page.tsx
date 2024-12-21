import Table from '@/components/Table'
import React from 'react'

const Team = () => {
  return (
    <div className="w-full">
        <div className="flex justify-center items-center flex-col mb-10">
            <h1 className="text-header-lg">My Team</h1>
        </div>
        <Table/>
    </div>

  )
}

export default Team