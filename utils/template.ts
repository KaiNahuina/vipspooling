import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { fetchAuthSession } from 'aws-amplify/auth';
import type { AwsCredentialIdentity } from '@aws-sdk/types';

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

// Cache variable to store the template
const cachedTemplates = new Map<string, Uint8Array>();

// Function to get template, fetching from S3 only if not cached
export const getTemplate = async (key: string): Promise<Uint8Array> => {
  if (cachedTemplates.has(key)) {
    console.log(`Using cached ${key} template.`);
    return cachedTemplates.get(key)!;
  }

  console.log('Fetching InvoiceForm.pdf from S3...');
  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: 'vipinvoices-templatesd981e-dev',
        Key: key,
      })
    );
    const templateBytes = await response.Body?.transformToByteArray();
    if (!templateBytes) throw new Error(`Failed to retrieve ${key} template from S3`);
    cachedTemplates.set(key, templateBytes);
    console.log(`${key} template fetched and cached.`);
    return templateBytes;
  } catch (error) {
    console.error('Error fetching template from S3:', error);
    throw error; 
  }
};

// Function to clear cache (e.g., for testing or template updates)
export const clearTemplateCache = (key?: string) => {
    if(key){
        cachedTemplates.delete(key);
        console.log(`${key} Template cleared from cache.`);
    }else{
        cachedTemplates.clear();
        console.log('Template cache cleared.');
    }
};