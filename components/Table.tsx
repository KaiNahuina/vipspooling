"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TableColumn {
  key: string;
  header: string;
}

interface TableProps {
  columns: TableColumn[];
  data?: any[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onPreview?: (file: string) => void;
  isLoading?: boolean;
  showActions?: boolean; // Existing prop for Actions column
  showCheckboxes?: boolean; // New prop for Checkboxes column
}

const Table: React.FC<TableProps> = ({
  columns,
  data = [],
  onEdit,
  onDelete,
  onPreview,
  isLoading = false,
  showActions = true,
  showCheckboxes = true, // Default to true for backward compatibility
}) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
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

  const handleDropdownClick = (e: React.MouseEvent, rowId: string) => {
    e.stopPropagation();
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setOpenDropdownId(openDropdownId === rowId ? null : rowId);
  };

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
            {showCheckboxes && (
              <th className="px-4 py-4">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
            )}
            {columns.map((column) => (
              <th key={column.key} scope="col" className="px-6 py-3">
                {column.header}
              </th>
            ))}
            {showActions && (
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const rowId = getRowId(row);
            return (
              <tr
                key={rowId}
                className={`odd:bg-white even:bg-gray-200 border-b dark:border-gray-700 ${
                  showCheckboxes && selectedRows.includes(rowId) ? "bg-blue-100" : "bg-white"
                }`}
              >
                {showCheckboxes && (
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(rowId)}
                      onChange={() => handleRowSelect(rowId)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={`${rowId}-${column.key}`} className="px-6 py-4 text-gray">
                    {column.key === 'file' && onPreview ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Preview button clicked for file:', row[column.key]);
                          onPreview(row[column.key]);
                        }}
                        className="text-gray-100 hover:underline rounded-md bg-gold-200 hover:bg-gold-100 px-2 py-2"
                      >
                        Preview
                      </button>
                    ) : (
                      row[column.key]?.toString() || ''
                    )}
                  </td>
                ))}
                {showActions && (
                  <td className="px-6 py-4 text-gray">
                    <div className="relative">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                        onClick={(e) => handleDropdownClick(e, rowId)}
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {showActions && openDropdownId && createPortal(
        <div
          className="fixed z-50 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="py-1" role="menu">
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(data.find((row) => getRowId(row) === openDropdownId));
                  setOpenDropdownId(null);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  onDelete(data.find((row) => getRowId(row) === openDropdownId));
                  setOpenDropdownId(null);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem"
              >
                Delete
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Table;