"use client";
import Search from '@/components/Search';
import Table from '@/components/Table';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { generateClient } from 'aws-amplify/api';
import { listInvoiceForms, listJsaForms, listCapillaryForms } from '@/src/graphql/queries';
import { deleteInvoiceForm, deleteJsaForm, deleteCapillaryForm } from '@/src/graphql/mutations';
import { getCurrentUser } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import awsconfig from '@/src/aws-exports';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { AwsCredentialIdentity } from "@aws-sdk/types";
import { fetchAuthSession } from "aws-amplify/auth";

Amplify.configure(awsconfig);

const client = generateClient();

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

interface InvoiceForm {
  WorkTicketID: string;
  InvoiceDate: string;
  Spooler: string;
  WorkType: string;
  CableCompany: string;
  CableCompanyLocation: string;
  OilCompany: string;
  WellNumber: string;
  WellName: string;
  ReelNumber: string;
  InvoiceTotal: number;
  FinalProductFile?: string | null;
}

interface JsaForm {
  WorkTicketID: string;
  CustomerName: string;
  CreatedBy: string;
  FormDate: string;
  EffectiveDate: string;
  Location: string;
  Personnel: Array<{
    Role: string;
    PersonName: string;
    Signature: string;
  } | null>;
  FinalProductFile?: string | null;
}


interface CapillaryForm{
  WorkTicketID: string;
  Date: string;
  TechnicianName: string;
  Customer: string;
  WellName: string;
  FinalProductFile?: string | null;
}

const downloadFile = async (s3Url: string, fileName: string) => {
  try {
    
    const match = s3Url.match(/^s3:\/\/([^/]+)\/(.+)$/);
    if (!match) {
      throw new Error("Invalid S3 URL format");
    }
    const [, bucket, key] = match;

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    // Generate pre-signed URL (expires in 1 hour)
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // Fetch the file and trigger download
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch file");
    }
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw new Error("Failed to download file");
  }
};

const invoiceColumns = [
  { key: 'WorkTicketID', header: 'Ticket ID' },
  { key: 'InvoiceDate', header: 'Date' },
  { key: 'Spooler', header: 'Spooler' },
  { key: 'WorkType', header: 'Work Type' },
  { key: 'CableCompanyLocation', header: 'Location' },
  { key: 'OilCompany', header: 'Oil Company' },
  { key: 'WellNumber', header: 'Well Number' },
  { key: 'WellName', header: "Well Name"},
  { key: 'ReelNumber', header: 'Reel Number' },
];

const jsaColumns = [
  { key: 'WorkTicketID', header: 'Work Ticket ID' },
  { key: 'CustomerName', header: 'Customer Name' },
  { key: 'CreatedBy', header: 'Created By'},
  { key: 'FormDate', header: 'Form Date' },
  { key: 'EffectiveDate', header: 'Effective Date' },
  { key: 'Location', header: 'Location' },
];

const CapillaryColumns = [
  { key: 'SubmissionDate', header: 'Submission Date' },
  { key: 'Date', header: 'Date'},
  { key: 'TechnicianName', header: 'Technician Name' },
  { key: 'Customer', header: 'Customer' },
  { key: 'WellName', header: 'Well Name' },
];

const Dashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'invoice' | 'jsa' | 'capillary'>('invoice');
  const [invoices, setInvoices] = useState<InvoiceForm[]>([]);
  const [jsaForms, setJsaForms] = useState<JsaForm[]>([]);
  const [capillaryForms, setCapillaryForms] = useState<CapillaryForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); 

  const checkAuth = async () => {
    try {
      await getCurrentUser();
      return true;
    } catch (err) {
      console.error('No signed in user:', err);
      router.push('/Login');
      return false;
    }
  };

  const fetchJsaForms = async () => {
    try {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) return;

      const response = await client.graphql({
        query: listJsaForms,
        authMode: 'userPool',
      });

      if (response.data) {
        setJsaForms(response.data.listJsaForms.items);
      }
    } catch (err) {
      console.error('Error fetching JSA forms:', err);
      setError('Failed to fetch JSA forms. Please try again later.');
    }
  };

  const fetchInvoices = async () => {
    try {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) return;

      const response = await client.graphql({
        query: listInvoiceForms,
        authMode: 'userPool',
      });

      if (response.data) {
        setInvoices(response.data.listInvoiceForms.items);
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to fetch invoices. Please try again later.');
    }
  };

  const fetchCapillary = async () => {
    try{
      const isAuthenticated = await checkAuth();
      if(!isAuthenticated) return;

      const response = await client.graphql({
        query: listCapillaryForms,
        authMode: 'userPool'
      });

      if(response.data){
        setCapillaryForms(response.data.listCapillaryForms.items);
      }
    }catch(err){
      console.error('Error fetching capillary forms:', err);
      setError('Failed to fetch capillary forms. Please try again later.');
    }
  }

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([fetchJsaForms(), fetchInvoices(), fetchCapillary()]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownload = async (item: InvoiceForm | JsaForm | CapillaryForm) => {
    if ("FinalProductFile" in item && item.FinalProductFile) {
      try {
        let fileName: string;
        if ("WorkTicketID" in item) {
          fileName = `${item.WorkTicketID}.pdf`;
        }else {
          fileName = "NewForm.pdf"; 
        }
        await downloadFile(item.FinalProductFile, fileName);
      } catch (error) {
        alert("Failed to download file");
      }
    } else {
      alert("No file available for download");
    }
  };

  const handleDelete = async (item: InvoiceForm | JsaForm | CapillaryForm) => {
    if (!window.confirm('Are you sure you want to delete this form?')) return;

    setIsLoading(true);
    try {
      if ("WorkTicketID" in item && "InvoiceDate" in item) {
        // InvoiceForm Delete
        await client.graphql({
          query: deleteInvoiceForm,
          variables: { input: { WorkTicketID: item.WorkTicketID } },
          authMode: "userPool",
        });
        await fetchInvoices();
      } else if ("WorkTicketID" in item && "CustomerName" in item) {
        // JsaForm Delete
        await client.graphql({
          query: deleteJsaForm,
          variables: { input: { CustomerName: item.CustomerName } },
          authMode: "userPool",
        });
        await fetchJsaForms();
      } else if ("WorkTicketID" in item && "SubmissionDate" in item) {
        // CapillaryForm Delete
        await client.graphql({
          query: deleteCapillaryForm,
          variables: { input: { WorkTicketID: item.WorkTicketID } },
          authMode: "userPool",
        });
        await fetchCapillary();
      } else {
        throw new Error("Unknown form type");
      }
    } catch (err) {
      console.error('Error deleting form:', err);
      setError('Failed to delete form. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterData = <T extends InvoiceForm | JsaForm | CapillaryForm>(items: T[]): T[] => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) =>
      Object.values(item).some((value) =>
        value && typeof value === 'string' && value.toLowerCase().includes(query)
      )
    );
  };

  const filteredInvoices = filterData(invoices);
  const filteredJsaForms = filterData(jsaForms);
  const filteredCapillaryForms = filterData(capillaryForms);

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

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex justify-center items-center flex-col mb-6">
        <h1 className="text-header-lg text-gray-100 dark:text-gray-10">Dashboard</h1>
      </div>

      <div className="bg-gray-200 dark:bg-gray-100 rounded-[5px] shadow-lg flex flex-col h-[calc(100%-200px)]">
        <div className="p-6 border-b border-gray-300 dark:border-gray-700">
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-DEFAULT dark:text-gray-10">
              Recent Forms
            </h2>
            <div className="flex items-center gap-4 w-full max-w-md">
              <Search onSearch={setSearchQuery} />
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

        <div className="border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
            <li className="me-2" role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'invoice'
                    ? 'text-gold-100 border-gold-200 dark:text-gold-100 dark:border-gold-200'
                    : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('invoice')}
                role="tab"
                aria-controls="invoice-tab"
                aria-selected={activeTab === 'invoice'}
              >
                Invoice Forms
              </button>
            </li>
            <li role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'jsa'
                    ? 'text-gold-100 border-gold-200 dark:text-gold-100 dark:border-gold-200'
                    : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('jsa')}
                role="tab"
                aria-controls="jsa-tab"
                aria-selected={activeTab === 'jsa'}
              >
                JSA Forms
              </button>
            </li>
            <li className="me-2" role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === "capillary"
                    ? "text-gold-100 border-gold-200 dark:text-gold-100 dark:border-gold-200"
                    : "text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("capillary")}
                role="tab"
                aria-controls="capillary-tab"
                aria-selected={activeTab === "capillary"}
              >
                Capillary Forms
              </button>
            </li>
          </ul>
        </div>

        <div className="flex-1 overflow-auto px-6 py-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}
          <Table
            columns={activeTab === "invoice"
              ? invoiceColumns
              : activeTab === "jsa"
              ? jsaColumns
              : CapillaryColumns}
            data={activeTab === "invoice"
              ? filteredInvoices
              : activeTab === "jsa"
              ? filteredJsaForms
              : filteredCapillaryForms}
            isLoading={isLoading}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;