import Previewer from '@/components/Previewer'
import Table from '@/components/Table'
import React from 'react'
import Logo from '@/public/logo.png'

const Templates = () => {
  return (
    <div className="w-full flex flex-col items-center space-y-8 px-4">
      <div className="flex justify-center items-center flex-col mb-10">
        <h1 className="text-header-lg text-center text-black dark:text-white">Assign Forms and Plans</h1>
      </div>
      
      <div className="w-full max-w-lg bg-white rounded-lg p-4 shadow-md flex items-center justify-center">
        <Previewer src={Logo} />
      </div>

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-x-auto">
        <Table />
      </div>
    </div>
  )
}

export default Templates