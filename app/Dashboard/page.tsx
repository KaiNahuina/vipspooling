"use client";
import Search from '@/components/Search'
import Table from '@/components/Table'
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import { generateClient } from 'aws-amplify/api';
import { listInvoiceForms } from '@/src/graphql/queries';
import { deleteInvoiceForm } from '@/src/graphql/mutations';

const client = generateClient();

interface InvoiceForm {
  WorkTicketID: string;
  InvoiceDate: string;
  Spooler: string;
  WorkType: string;
  CableCompanyLocation: string;
  OilCompany: string;
  WellNumberName: string;
  ReelNumber: string;
  InvoiceTotal: number;
}

const columns = [
  { key: 'WorkTicketID', header: 'Ticket ID' },
  { key: 'InvoiceDate', header: 'Date' },
  { key: 'Spooler', header: 'Spooler' },
  { key: 'WorkType', header: 'Work Type' },
  { key: 'CableCompanyLocation', header: 'Location' },
  { key: 'OilCompany', header: 'Oil Company' },
  { key: 'WellNumberName', header: 'Well Number/Name' },
  { key: 'ReelNumber', header: 'Reel Number' },
  { key: 'InvoiceTotal', header: 'Total' },
];

const Dashboard = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await client.graphql({
        query: listInvoiceForms,
        authMode: 'userPool'
      });
      const data = response.data.listInvoiceForms.items;
      setInvoices(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to fetch invoices. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleEdit = (invoice: InvoiceForm) => {
    router.push(`/Dashboard/edit-form/invoice-form/${invoice.WorkTicketID}`);
  };

  const handleDelete = async (invoice: InvoiceForm) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    setIsLoading(true);
    try {
      await client.graphql({
        query: deleteInvoiceForm,
        variables: {
          input: {
            WorkTicketID: invoice.WorkTicketID
          }
        },
        authMode: 'userPool'
      });
      
      // Refresh the list
      await fetchInvoices();
    } catch (err) {
      console.error('Error deleting invoice:', err);
      setError('Failed to delete invoice. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      {/* Dashboard Title */}
      <div className="flex justify-center items-center flex-col mb-6">
        <h1 className="text-header-lg text-gray-100 dark:text-gray-10">Dashboard</h1>
      </div>

      {/* Main Content Container */}
      <div className="bg-gray-200 dark:bg-gray-100 rounded-[5px] shadow-lg flex flex-col h-[calc(100%-200px)]">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-300 dark:border-gray-700">
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

        {/* Table Section */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}
          <Table
            columns={columns}
            data={invoices}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
