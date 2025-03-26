"use client";
import Previewer from '@/components/Previewer';
import Table from '@/components/Table';
import React, { useState, useEffect } from 'react';
import Logo from '@/public/logo.png';
import { generateClient } from 'aws-amplify/api';
import { listTemplates } from '@/src/graphql/queries';
import { useRouter } from 'next/navigation';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { deleteTemplate } from '@/src/mutations';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { AwsCredentialIdentity } from '@aws-sdk/types';
import { useAuth } from '@/components/ClientLayout';

const client = generateClient();

const getCredentials = async (): Promise<AwsCredentialIdentity> => {
  const session = await fetchAuthSession();
  if (!session.credentials) {
    throw new Error('No credentials available');
  }
  return {
    accessKeyId: session.credentials.accessKeyId,
    secretAccessKey: session.credentials.secretAccessKey,
    sessionToken: session.credentials.sessionToken,
  };
};

const s3Client = new S3Client({
  region: 'us-east-1', // Replace with your region from aws-exports.js
  credentials: getCredentials,
});

interface Template {
  TemplateID: string;
  TemplateDate?: string | null;
  Content: string;
  file: string; // S3 URI (e.g., "s3://vipinvoices-templatesd981e-dev/JSAForm.pdf")
  
}

const TemplateColumns = [
  { key: 'TemplateID', header: 'Template ID' },
  { key: 'TemplateDate', header: 'Template Date' },
  { key: 'Content', header: 'Content' },
  { key: 'file', header: 'File' },
];

// Helper function to extract S3 key from URI
const extractS3Key = (s3Uri: string): string => {
  const parts = s3Uri.split('s3://vipinvoices-templatesd981e-dev/');
  return parts.length > 1 ? parts[1] : s3Uri;
};

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);

  const router = useRouter();
  const { isAuthenticated } = useAuth();

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

  const fetchTemplates = async () => {
    try {
      const isAuth = await checkAuth();
      if (!isAuth) return;

      const response = await client.graphql({
        query: listTemplates,
        authMode: 'userPool',
      });

      if (response.data) {
        const fetchedTemplates = response.data.listTemplates.items.map((template: any) => ({
          TemplateID: template.TemplateID,
          TemplateDate: template.TemplateDate ?? null,
          Content: template.Content || '',
          file: template.file, // S3 URI from DynamoDB
        }));
        console.log('Fetched templates from DynamoDB:', fetchedTemplates);
        setTemplates(fetchedTemplates);
      } else {
        setTemplates([]);
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Failed to fetch templates. Please try again later.');
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await fetchTemplates();
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated === true) {
      fetchData();
    } else if (isAuthenticated === false) {
      router.push('/Login');
    }
  }, [isAuthenticated]);

  const handlePreview = async (fileKey: string) => {
    console.log('handlePreview called with fileKey:', fileKey);
    if (!fileKey) {
      setSelectedFileUrl(null);
      return;
    }

    try {
      const s3Key = extractS3Key(fileKey); // Extract key from S3 URI
      console.log('Extracted S3 key:', s3Key);

      const command = new GetObjectCommand({
        Bucket: 'vipinvoices-templatesd981e-dev',
        Key: s3Key,
      });

      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 600,
      });

      console.log('Generated signed URL:', signedUrl);
      setSelectedFileUrl(signedUrl);
    } catch (error) {
      console.error('Error generating signed URL:', error);
      setError('Failed to load preview. Please try again.');
      setSelectedFileUrl(null);
    }
  };

  const handleDelete = async (item: Template) => {
    if (!window.confirm('Are you sure you want to delete this form?')) return;

    setIsLoading(true);
    try {
      await client.graphql({
        query: deleteTemplate,
        variables: { input: { TemplateID: item.TemplateID } },
        authMode: 'userPool',
      });
      await fetchTemplates();
    } catch (err) {
      console.error('Error deleting form:', err);
      setError('Failed to delete form. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated === null) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="w-full flex flex-col items-center space-y-8 px-4">
      <div className="flex justify-center items-center flex-col mb-10">
        <h1 className="text-header-lg text-center text-black dark:text-white">Assign Forms and Plans</h1>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-lg p-4 shadow-md flex items-center justify-center">
        <Previewer src={selectedFileUrl || Logo} />
      </div>

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-x-auto">
        <Table
          columns={TemplateColumns}
          data={templates}
          isLoading={isLoading}
          onDelete={handleDelete}
          onPreview={handlePreview}
        />
      </div>
    </div>
  );
};

export default Templates;