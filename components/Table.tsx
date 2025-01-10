'use client';

import React, {useState} from 'react'

const Table = () => {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [isAllSelected, setIsAllSelected] = useState(false);

    const rowData = [
        { id: "1", name: "Apple MacBook Pro 17", color: "Silver", category: "Laptop", price: "$2999" },
        { id: "2", name: "Microsoft Surface Pro", color: "White", category: "Laptop PC", price: "$1999" },
        { id: "3", name: "Magic Mouse 2", color: "Black", category: "Accessories", price: "$99" },
        { id: "4", name: "Google Pixel Phone", color: "Gray", category: "Phone", price: "$799" },
        { id: "5", name: "Apple Watch 5", color: "Red", category: "Wearables", price: "$999" },
      ];

    const handleSelectAll = () => {
        if (isAllSelected) {
          setSelectedRows([]);
        } else {
          setSelectedRows(rowData.map((row) => row.id));
        }
        setIsAllSelected(!isAllSelected);
      };
    
      // Handle individual row toggle
      const handleRowSelect = (id: string) => {
        if (selectedRows.includes(id)) {
          setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
        } else {
          setSelectedRows([...selectedRows, id]);
        }
      };
    


  return (
    <div>
         <div className="relative overflow-x-auto  md:rounded-sm sm:rounded-sm">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-700 dark:bg-gray-300 dark:text-gray-100">
                <tr>
                    <th className="px-4 py-4">
                        <input 
                        type="checkbox" 
                        checked={isAllSelected}
                        onChange={handleSelectAll} 
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" 
                        />
                    </th>
                    <th scope="col" className="px-6 py-3">Product name</th>
                    <th scope="col" className="px-6 py-3">Color</th>
                    <th scope="col" className="px-6 py-3">Category</th>
                    <th scope="col" className="px-6 py-3">Price</th>
                    <th scope="col" className="px-6 py-3">Action</th>
                </tr>
                </thead>
                <tbody>
                    {rowData.map((row) => (
                    <tr
                        key={row.id}
                        className={`odd:bg-white even:bg-gray-200 border-b dark:border-gray-700 ${
                        selectedRows.includes(row.id) ? "bg-blue-100" : ""
                        }`}
                    >
                        {/* Individual Row Checkbox */}
                        <td className="px-4 py-4">
                        <input
                            type="checkbox"
                            checked={selectedRows.includes(row.id)}
                            onChange={() => handleRowSelect(row.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray whitespace-nowrap dark:text-gray">
                        {row.name}
                        </th>
                        <td className="px-6 py-4 text-gray">{row.color}</td>
                        <td className="px-6 py-4 text-gray">{row.category}</td>
                        <td className="px-6 py-4 text-gray">{row.price}</td>
                        <td className="px-6 py-4 text-gray">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                            Edit
                        </a>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>


    </div>
  )
}

export default Table