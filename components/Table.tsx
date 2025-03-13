'use client';

import React, { useState } from 'react';

// Define types for the table
interface TableColumn {
  key: string;
  header: string;
}

interface TableProps {
  columns: TableColumn[];
  data?: any[];  // Make data optional
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  isLoading?: boolean;
}

const Table: React.FC<TableProps> = ({ 
  columns, 
  data = [], // Provide default empty array
  onEdit, 
  onDelete,
  isLoading = false 
}) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      // Only map if data exists and has items
      const ids = data?.length > 0 
        ? data.map((row) => row.id || row.WorkTicketID || row.CustomerName || row.TemplateID || row.UserID).filter(Boolean)
        : [];
      setSelectedRows(ids);
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleRowSelect = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Get the ID field based on the table type
  const getRowId = (row: any): string => {
    return row.id || row.WorkTicketID || row.CustomerName || row.TemplateID || row.UserID || 'no-id';
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-gold-100 animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-gold-100 animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-gold-100 animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>
    );
  }

  // Show message when no data is available
  if (!data || data.length === 0) {
    return (
      <div className="w-full text-center py-8 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto md:rounded-sm sm:rounded-sm">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray uppercase bg-gray-700 dark:bg-gray-300 dark:text-gray-100">
          <tr>
            <th className="px-4 py-4">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </th>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="px-6 py-3">
                {column.header}
              </th>
            ))}
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const rowId = getRowId(row);
            return (
              <tr
                key={rowId}
                className={`odd:bg-white even:bg-gray-200 border-b dark:border-gray-700 ${
                  selectedRows.includes(rowId) ? "bg-blue-100" : ""
                }`}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(rowId)}
                    onChange={() => handleRowSelect(rowId)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                {columns.map((column) => (
                  <td key={`${rowId}-${column.key}`} className="px-6 py-4 text-gray">
                    {row[column.key]?.toString() || ''}
                  </td>
                ))}
                <td className="px-6 py-4 text-gray">
                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;