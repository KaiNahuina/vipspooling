"use client";
import Previewer from '@/components/Previewer';
import Table from '@/components/Table';
import React, { useState, useEffect } from 'react';
import Logo from '@/public/logo.png';
import { generateClient } from 'aws-amplify/api';
import { listTemplates, listPricingPlans } from '@/src/graphql/queries';
import { useRouter } from 'next/navigation';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { AwsCredentialIdentity } from '@aws-sdk/types';
import { useAuth } from '@/components/ClientLayout';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {ScanCommand, DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";

const client = generateClient();

const getCredentials = async (): Promise<AwsCredentialIdentity> => {
  const session = await fetchAuthSession();
  if (!session.credentials) throw new Error('No credentials available');
  return {
    accessKeyId: session.credentials.accessKeyId,
    secretAccessKey: session.credentials.secretAccessKey,
    sessionToken: session.credentials.sessionToken,
  };
};

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: getCredentials,
});

const dbClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: "us-east-1",
    credentials: async () => getCredentials()
  })
);

interface Template {
  TemplateID: string;
  TemplateDate?: string | null;
  Content: string;
  file: string;
}

interface PricingPlan {
  PlanID: string;
  PlanDate?: string | null;
  Description: string;
  file: string;
}

const TemplateColumns = [
  { key: 'TemplateID', header: 'Template ID' },
  { key: 'TemplateDate', header: 'Template Date' },
  { key: 'Content', header: 'Content' },
  { key: 'file', header: 'File' },
];

const PricingPlanColumns = [
  { key: 'PlanID', header: 'Plan ID' },
  { key: 'PlanDate', header: 'Plan Date' },
  { key: 'Description', header: 'Description' },
  { key: 'file', header: 'File' },
];

const extractS3Key = (s3Uri: string, bucket: string): string => {
  const prefix = `s3://${bucket}/`;
  const parts = s3Uri.split(prefix);
  return parts.length > 1 ? parts[1] : s3Uri;
};

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('templates');
  const [userGroup, setUserGroup] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const checkAuth = async () => {
    try {
      await getCurrentUser();
      const session = await fetchAuthSession();
      if (!session.credentials) throw new Error('No credentials available');
      const groups = session.tokens?.accessToken.payload['cognito:groups'] as string[] | undefined;
      const group = groups?.find(g => ['Admin', 'Manager', 'Operator'].includes(g)) || null;
      console.log('User group:', group);
      setUserGroup(group);
      return true;
    } catch (err) {
      console.error('No signed in user:', err);
      router.push('/Login');
      return false;
    }
  };

  const fetchTemplates = async () => {
    try {
      const params = {
        TableName: "Template-ghr672m57fd2re7tckfmfby2e4-dev",
        FilterExpression: "#del <> :deleted",
        ExpressionAttributeNames: {
          "#del": "_deleted"
        },
        ExpressionAttributeValues: {
          ":deleted": true
        }
      };
  
      const result = await dbClient.send(new ScanCommand(params));
      setTemplates((result.Items || []) as Template[]);
    } catch (err) {
      console.error('Error fetching templates:', err);
      throw err;
    }
  };

  const fetchPricingPlans = async () => {
    try {
      const params = {
        TableName: "PricingPlan-ghr672m57fd2re7tckfmfby2e4-dev",
        FilterExpression: "#del <> :deleted",
        ExpressionAttributeNames: {
          "#del": "_deleted"
        },
        ExpressionAttributeValues: {
          ":deleted": true
        }
      };
  
      const result = await dbClient.send(new ScanCommand(params));
      setPricingPlans((result.Items || []) as PricingPlan[]);
    } catch (err) {
      console.error('Error fetching pricing plans:', err);
      throw err;
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const isAuth = await checkAuth();
      if (!isAuth) return;
      console.log('Starting data fetch...');
      await fetchTemplates();
      try {
        await fetchPricingPlans();
      } catch (pricingErr) {
        console.error('Pricing plans fetch failed, continuing with templates:', pricingErr);
        setError('Failed to fetch pricing plans, but templates loaded.');
      }
      console.log('Data fetch completed');
    } catch (err) {
      console.error('Critical error fetching data:', err);
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

  const handlePreview = async (fileKey: string, bucket: string) => {
    console.log('handlePreview called with fileKey:', fileKey, 'bucket:', bucket);
    if (!fileKey) {
      setSelectedFileUrl(null);
      return;
    }

    try {
      const s3Key = extractS3Key(fileKey, bucket);
      console.log('Extracted S3 key:', s3Key);

      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: s3Key,
      });

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });
      console.log('Generated signed URL:', signedUrl);
      setSelectedFileUrl(signedUrl);
    } catch (error) {
      console.error('Error generating signed URL:', error);
      setError('Failed to load preview. Please try again.');
      setSelectedFileUrl(null);
    }
  };

  if (isAuthenticated === null) return 
  <div className="w-full flex justify-center items-center py-8">
    <div className="flex flex-row gap-2">
      <div className="w-4 h-4 rounded-full bg-gold-100 animate-bounce"></div>
      <div className="w-4 h-4 rounded-full bg-gold-100 animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-gold-100 animate-bounce [animation-delay:-.5s]"></div>
    </div>
  </div>;
  if (!isAuthenticated) return null;

  return (
    <div className="w-full">
      <div className="flex justify-center items-center flex-col mb-10">
        <h1 className="text-header-lg text-black dark:text-white">Templates and Pricing Plans</h1>
      </div>
      <div className="min-h-[360px] pt-[25px] flex-grow flex flex-col justify-between rounded-[5px] bg-gray-200 dark:bg-gray-100">
        <div className="mb-[25px] px-4 lg:px-8 items-center justify-center">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-2xl font-semibold text-black dark:text-white">
                {activeTab === 'templates' ? 'Templates' : 'Pricing Plans'}
              </h2>
              {userGroup !== 'Operator' && (
                <button
                  onClick={() => router.push("/Templates/template-request")}
                  className="px-6 bg-gold-200 hover:bg-gold-100 text-gray-800 transition ease-in 
                  duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 
                  focus:ring-offset-2 rounded-lg cursor-pointer select-none h-[56px]"
                >
                  Request New Form or Pricing Plan
                </button>
              )}
            </div>
            <div className="w-full max-w-3xl bg-white rounded-lg p-4 shadow-md items-center justify-center mt-4 mx-auto">
              <Previewer src={selectedFileUrl || Logo} />
            </div>
            <div className="flex space-x-4 border-b border-gray-300">
              <button
                onClick={() => setActiveTab('templates')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'templates'
                    ? 'text-gold-200 border-b-2 border-gold-200'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Templates
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'pricing'
                    ? 'text-gold-200 border-b-2 border-gold-200'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Pricing Plans
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex-grow flex flex-col overflow-auto px-6 py-4 items-center justify-center w-full">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}
          
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-x-auto">
            {activeTab === 'templates' ? (
              <Table
                columns={TemplateColumns}
                data={templates}
                isLoading={isLoading}
                onPreview={(item) => handlePreview(item.file, 'vipinvoices-templatesd981e-dev')}
                showActions={false}
                showCheckboxes={false}
              />
            ) : (
              <Table
                columns={PricingPlanColumns}
                data={pricingPlans}
                isLoading={isLoading}
                onPreview={(item) => handlePreview(item.file, 'vip-pricing-plans')}
                showActions={false}
                showCheckboxes={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;