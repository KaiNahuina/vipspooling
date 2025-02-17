import React from 'react'

const newMember = () => {
  return (
    <div>
        <div className="flex justify-center items-center flex-col mb-10">
            <h1 className="text-header-lg text-black dark:text-white">Add New Member</h1>
        </div>
        <div className="w-full flex flex-col justify-center items-center bg-white dark:bg-gray-100 px-4 py-10 mx-auto rounded-[5px]">
            
            <form className="w-full flex justify-center items-center flex-col">
                <div className="mb-5 flex justify-center items-center flex-col">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-black dark:text-white text-lg">Email Address</label>
                    <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                    focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email Address" required />
                </div>
                <button type="submit" className="px-6 bg-gold-200 hover:bg-gold-100 text-gray-800 transition ease-in duration-200
                     text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 
                     rounded-lg cursor-pointer select-none h-[56px]">Send Invite</button>

            </form>
        </div>
    </div>
  )
}

export default newMember