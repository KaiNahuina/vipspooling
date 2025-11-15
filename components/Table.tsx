"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { S3Client } from "@aws-sdk/client-s3";
import type { AwsCredentialIdentity } from "@aws-sdk/types";
import { fetchAuthSession } from "aws-amplify/auth";

interface TableColumn {
  key: string;
  header: string;
}

interface TableProps {
  columns: TableColumn[];
  data?: any[];
  onDownload?: (item: any) => void;
  onDelete?: (item: any) => void;
  onPreview?: (item: any) => void; // Change from (file: string) to (item: any)
  isLoading?: boolean;
  showActions?: boolean;
  showCheckboxes?: boolean;
  userGroup?: string | null;
}

// Function to get AWS credentials (reused from your previous code)
const getCredentials = async (): Promise<AwsCredentialIdentity> => {
  const session = await fetchAuthSession();
  if (!session.credentials) throw new Error("No credentials available");
  return {
    accessKeyId: session.credentials.accessKeyId,
    secretAccessKey: session.credentials.secretAccessKey,
    sessionToken: session.credentials.sessionToken,
  };
};

// Initialize S3 client
const s3Client = new S3Client({
  region: "us-east-1",
  credentials: getCredentials,
});



const Table: React.FC<TableProps> = ({
  columns,
  data = [],
  onDownload,
  onDelete,
  onPreview,
  isLoading = false,
  showActions = true,
  showCheckboxes = true,
  userGroup,
}) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.querySelector(`[role="menu"]`);
      if (openDropdownId && dropdown && !dropdown.contains(event.target as Node)) {
        console.log('Closing dropdown due to click outside');
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdownId]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      const ids = data?.length > 0
        ? data.map((row) => row.id || row.WorkTicketID || row.CustomerName || row.TemplateID || row.UserID || row.username).filter(Boolean)
        : [];
      setSelectedRows(ids);
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
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
                  className="w-4 h-4 text-gold-200 bg-gray-100 border-gray-300 rounded focus:ring-gold-100"
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
                  showCheckboxes && selectedRows.includes(rowId) ? "bg-gold-200" : "bg-white"
                }`}
              >
                {showCheckboxes && (
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(rowId)}
                      onChange={() => handleRowSelect(rowId)}
                      className="w-4 h-4 text-gold-200 bg-gray-100 border-gray-300 rounded focus:ring-gold-100"
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
                          console.log('Preview button clicked for row:', row);
                          onPreview(row); // Pass the entire row object
                        }}
                        className="text-gray-100 hover:underline rounded-md bg-gold-200 hover:bg-gold-100 px-2 py-2"
                      >
                        Preview
                      </button>
                    ) : column.key === 'groups' && Array.isArray(row[column.key]) ? (
                      row[column.key].join(', ')
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
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none"
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
            {onDownload && (
              <button
                onClick={() => {
                  const selectedRow = data.find((row) => getRowId(row) === openDropdownId);
                  console.log('Download button clicked for rowId:', openDropdownId, 'row:', selectedRow);
                  if(selectedRow){
                    onDownload(selectedRow);
                  }else{
                    console.error('No row found for rowId:', openDropdownId);
                    alert('Error: Selected Row not found');
                  }

                  setOpenDropdownId(null);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                role="menuitem"
              >
                Download
              </button>
            )}
            {onDelete &&(
              <button
                onClick={() => {
                  onDelete(data.find((row) => getRowId(row) === openDropdownId));
                  setOpenDropdownId(null);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700"
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