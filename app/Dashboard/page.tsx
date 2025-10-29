"use client";
import Search from '@/components/Search';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import ErrorModal from '@/components/ErrorModal';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { generateClient } from 'aws-amplify/api';
import { listInvoiceForms, listJsaForms, listCapillaryForms } from '@/src/graphql/queries';
import { deleteInvoiceForm, deleteJsaForm, deleteCapillaryForm } from '@/src/graphql/mutations';
import { getCapillaryForm, getInvoiceForm, getJsaForm } from '@/src/graphql/queries';
import { getCurrentUser } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import awsconfig from '@/src/aws-exports';
import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { AwsCredentialIdentity } from "@aws-sdk/types";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";

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
  credentials: async () => getCredentials(),
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
  _version: number;
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
  _version: number;
}

interface CapillaryForm {
  WorkTicketID: string;
  Date: string;
  TechnicianName: string;
  Customer: string;
  WellName: string;
  FinalProductFile?: string | null;
  _version: number;
}

const downloadFile = async (s3Url: string, fileName: string) => {
  console.log('Starting downloadFile with s3Url:', s3Url, 'fileName:', fileName);
  try {
    if (!s3Url.startsWith('s3://')) {
      throw new Error(`Invalid S3 URL format: ${s3Url}`);
    }

    const match = s3Url.match(/^s3:\/\/([^/]+)\/(.+)$/);
    if (!match) {
      throw new Error("Invalid S3 URL format");
    }
    const [, bucket, key] = match;
    console.log('Parsed S3 URL - Bucket:', bucket, 'Key:', key);

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    console.log('Generating pre-signed URL...');
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log('Pre-signed URL generated:', url);

    console.log('Fetching file from pre-signed URL...');
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }
    console.log('File fetched successfully');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    console.log('Triggering download for file:', fileName);
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
  { key: 'WellName', header: "Well Name" },
  { key: 'ReelNumber', header: 'Reel Number' },
];

const jsaColumns = [
  { key: 'WorkTicketID', header: 'Work Ticket ID' },
  { key: 'CustomerName', header: 'Customer Name' },
  { key: 'CreatedBy', header: 'Created By' },
  { key: 'FormDate', header: 'Form Date' },
  { key: 'EffectiveDate', header: 'Effective Date' },
  { key: 'Location', header: 'Location' },
];

const CapillaryColumns = [
  { key: 'WorkTicketID', header: 'Work Ticket ID' },
  { key: 'Date', header: 'Date' },
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
  const [userGroup, setUserGroup] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InvoiceForm | JsaForm | CapillaryForm | null>(null);

  const checkAuth = async (): Promise<{ name: string; isAuthenticated: boolean; group: string | null }> => {
    try {
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      if (!session.credentials) throw new Error("No credentials available");
      const groups = session.tokens?.accessToken.payload['cognito:groups'] as string[] | undefined;
      const group = groups?.find(g => ['Admin', 'Manager', 'Operator'].includes(g)) || null;
      const attributes = await fetchUserAttributes();
      const name = attributes.name || `${attributes.given_name || ''} ${attributes.family_name || ''}`.trim() || '';
      setUserGroup(group);
      setUserName(name);
      return { name, group, isAuthenticated: true };
    } catch (err) {
      console.error('No signed in user:', err);
      router.push('/Login');
      return { name: '', isAuthenticated: false, group: null };
    }
  };

  const fetchJsaForms = async (userName: string, userGroup: string | null) => {
    try {
      const filter = {
        and: [
          userGroup === 'Operator' && userName ? { CreatedBy: { eq: userName } } : {},
          { _deleted: { ne: true } },
        ].filter(f => Object.keys(f).length > 0),
      };

      console.log('fetchJsaForms - Filter:', filter, 'userName:', userName, 'userGroup:', userGroup);

      const response = await client.graphql({
        query: listJsaForms,
        variables: { filter },
        authMode: 'userPool',
      });

      console.log('fetchJsaForms - Response:', JSON.stringify(response, null, 2));
      if (response.data) {
        setJsaForms(response.data.listJsaForms.items);
      } else if (response.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
      }
    } catch (err) {
      console.error('Error fetching JSA forms:', err);
      setError('Failed to fetch JSA forms. Please try again later.');
    }
  };

  const fetchInvoices = async (userName: string, userGroup: string | null) => {
    try {
      const filter = {
        and: [
          userGroup === 'Operator' && userName ? { Spooler: { eq: userName } } : {},
          { _deleted: { ne: true } },
        ].filter(f => Object.keys(f).length > 0),
      };
      console.log('fetchInvoices - Filter:', filter, 'userName:', userName, 'userGroup:', userGroup);
      const response = await client.graphql({
        query: listInvoiceForms,
        variables: { filter },
        authMode: 'userPool',
      });

      console.log('fetchInvoices - Response:', JSON.stringify(response, null, 2));
      if (response.data) {
        setInvoices(response.data.listInvoiceForms.items);
      } else if (response.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to fetch invoices. Please try again later.');
    }
  };

  const fetchCapillary = async (userName: string, userGroup: string | null) => {
    try {
      const filter = {
        and: [
          userGroup === 'Operator' && userName ? { TechnicianName: { eq: userName } } : {},
          { _deleted: { ne: true } },
        ].filter(f => Object.keys(f).length > 0),
      };
      console.log('fetchCapillary - Filter:', filter);

      const response = await client.graphql({
        query: listCapillaryForms,
        variables: { filter },
        authMode: 'userPool',
      });

      console.log('fetchCapillary - Response:', JSON.stringify(response, null, 2));
      if (response.data) {
        setCapillaryForms(response.data.listCapillaryForms.items);
      } else if (response.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
      }
    } catch (err) {
      console.error('Error fetching capillary forms:', err);
      setError('Failed to fetch capillary forms. Please try again later.');
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { name, isAuthenticated, group } = await checkAuth();
      if (!isAuthenticated) {
        console.log('fetchData - Not authenticated, redirecting');
        return;
      }
      console.log('fetchData - After checkAuth - userName:', name, 'userGroup:', group);

      await Promise.all([fetchJsaForms(name, group), fetchInvoices(name, group), fetchCapillary(name, group)]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownload = async (item: InvoiceForm | JsaForm | CapillaryForm) => {
    console.log('handleDownload called with item:', item);

    if (!item || !("FinalProductFile" in item) || !item.FinalProductFile) {
      console.log('No valid FinalProductFile for item:', item);
      alert("No file available for download");
      return;
    }

    try {
      let fileName: string;
      if ("WorkTicketID" in item && item.WorkTicketID) {
        fileName = `${item.WorkTicketID}.pdf`;
      } else {
        fileName = "NewForm.pdf";
      }
      console.log('Calling downloadFile with FinalProductFile:', item.FinalProductFile, 'fileName:', fileName);
      await downloadFile(item.FinalProductFile, fileName);
    } catch (error: any) {
      console.error('handleDownload error:', error);
      alert(`Failed to download file: ${error.message}`);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsLoading(true);
    setIsModalOpen(true);
    handleDelete(itemToDelete);
  };

  const handleDelete = async (item: InvoiceForm | JsaForm | CapillaryForm) => {
    if (!itemToDelete) return;

    setItemToDelete(item);
    setIsModalOpen(false);
    try {
      const maxRetries = 3;
      let attempt = 0;
      let lastError: any;

      while (attempt < maxRetries) {
        try {
          if ("WorkTicketID" in item && "InvoiceDate" in item) {
            console.log('Deleting InvoiceForm:', { WorkTicketID: item.WorkTicketID, _version: item._version });
            const response = await client.graphql({
              query: deleteInvoiceForm,
              variables: { input: { WorkTicketID: item.WorkTicketID, _version: item._version } },
              authMode: "userPool",
            });
            console.log('DeleteInvoiceForm response:', response);

            if (item.FinalProductFile) {
              const match = item.FinalProductFile.match(/^s3:\/\/([^/]+)\/(.+)$/);
              if (match) {
                const [, bucket, key] = match;
                await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
                console.log(`Deleted S3 object: ${item.FinalProductFile}`);
              }
            }
            await fetchInvoices(userName, userGroup);
            return;
          } else if ("WorkTicketID" in item && "CustomerName" in item) {
            console.log('Deleting JsaForm:', { CustomerName: item.CustomerName, _version: item._version });
            const response = await client.graphql({
              query: deleteJsaForm,
              variables: { input: { CustomerName: item.CustomerName, _version: item._version } },
              authMode: "userPool",
            });
            console.log('DeleteJsaForm response:', response);

            if (item.FinalProductFile) {
              const match = item.FinalProductFile.match(/^s3:\/\/([^/]+)\/(.+)$/);
              if (match) {
                const [, bucket, key] = match;
                await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
                console.log(`Deleted S3 object: ${item.FinalProductFile}`);
              }
            }
            await fetchJsaForms(userName, userGroup);
            return;
          } else if ("WorkTicketID" in item && "SubmissionDate" in item) {
            console.log('Deleting CapillaryForm:', { WorkTicketID: item.WorkTicketID, _version: item._version });
            const response = await client.graphql({
              query: deleteCapillaryForm,
              variables: { input: { WorkTicketID: item.WorkTicketID, _version: item._version } },
              authMode: "userPool",
            });
            console.log('DeleteCapillaryForm response:', response);

            if (item.FinalProductFile) {
              const match = item.FinalProductFile.match(/^s3:\/\/([^/]+)\/(.+)$/);
              if (match) {
                const [, bucket, key] = match;
                await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
                console.log(`Deleted S3 object: ${item.FinalProductFile}`);
              }
            }
            await fetchCapillary(userName, userGroup);
            return;
          } else {
            throw new Error("Unknown form type");
          }
        } catch (err: any) {
          lastError = err;
          if (err.errors?.some((e: any) => e.errorType === 'ConflictUnhandled')) {
            console.log(`Version conflict detected, retrying (${attempt + 1}/${maxRetries})...`);
            attempt++;

            let latestResponse;
            if ("WorkTicketID" in item && "InvoiceDate" in item) {
              latestResponse = await client.graphql({
                query: getInvoiceForm,
                variables: { WorkTicketID: item.WorkTicketID },
                authMode: "userPool",
              });
              if (latestResponse.data?.getInvoiceForm) {
                item._version = latestResponse.data.getInvoiceForm._version;
                console.log('Updated InvoiceForm _version:', item._version);
              } else {
                throw new Error('Failed to fetch latest InvoiceForm version');
              }
            } else if ("WorkTicketID" in item && "CustomerName" in item) {
              latestResponse = await client.graphql({
                query: getJsaForm,
                variables: { CustomerName: item.CustomerName },
                authMode: "userPool",
              });
              if (latestResponse.data?.getJsaForm) {
                item._version = latestResponse.data.getJsaForm._version;
                console.log('Updated JsaForm _version:', item._version);
              } else {
                throw new Error('Failed to fetch latest JsaForm version');
              }
            } else if ("WorkTicketID" in item && "SubmissionDate" in item) {
              latestResponse = await client.graphql({
                query: getCapillaryForm,
                variables: { WorkTicketID: item.WorkTicketID },
                authMode: "userPool",
              });
              if (latestResponse.data?.getCapillaryForm) {
                item._version = latestResponse.data.getCapillaryForm._version;
                console.log('Updated CapillaryForm _version:', item._version);
              } else {
                throw new Error('Failed to fetch latest CapillaryForm version');
              }
            }
          } else {
            throw err;
          }
        }
      }

      throw new Error(`Failed to delete form after ${maxRetries} retries: ${lastError.message}`);
    } catch (err: any) {
      console.error('Error deleting form:', err);
      setError(`Failed to delete form: ${err.message || 'Unknown error'}`);
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

  const handleDismissError = () => {
    setError(null);
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
                  activeTab === 'capillary'
                    ? 'text-gold-100 border-gold-200 dark:text-gold-100 dark:border-gold-200'
                    : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('capillary')}
                role="tab"
                aria-controls="capillary-tab"
                aria-selected={activeTab === 'capillary'}
              >
                Capillary Forms
              </button>
            </li>
          </ul>
        </div>

        <div className="flex-1 overflow-auto px-6 py-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={handleDismissError}
                className="text-red-700 hover:text-red-900 font-semibold focus:outline-none"
              >
                Dismiss
              </button>
            </div>
          )}
          <Table
            columns={activeTab === 'invoice'
              ? invoiceColumns
              : activeTab === 'jsa'
              ? jsaColumns
              : CapillaryColumns}
            data={activeTab === 'invoice'
              ? filteredInvoices
              : activeTab === 'jsa'
              ? filteredJsaForms
              : filteredCapillaryForms}
            isLoading={isLoading}
            onDownload={handleDownload}
            onDelete={userGroup === 'Operator' ? undefined : confirmDelete}
            userGroup={userGroup}
          />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this form?"
        confirmText="Yes"
        cancelText="No"
        isLoading={isLoading}
      />
    </div>
  );
};

export default Dashboard;