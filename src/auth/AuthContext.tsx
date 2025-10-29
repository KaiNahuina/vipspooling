"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, fetchAuthSession, fetchUserAttributes, signOut } from 'aws-amplify/auth';
import type { AwsCredentialIdentity } from '@aws-sdk/types';

interface AuthContextType {
  credentials: AwsCredentialIdentity | null;
  userGroup: string | null;
  userProfile: { email: string; name: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  refreshCredentials: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const RETRY_DELAY = 1000; // 1 second
const MAX_RETRIES = 3;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [credentials, setCredentials] = useState<AwsCredentialIdentity | null>(null);
  const [userGroup, setUserGroup] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ email: string; name: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchAuthData = async (retries = 0): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const now = Date.now();
      if (credentials && now - lastFetchTime < CACHE_DURATION) {
        console.log('Using cached credentials');
        setIsAuthenticated(true);
        return;
      }

      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      const session = await fetchAuthSession();

      if (!session.credentials) throw new Error('No credentials available');

      const groups = session.tokens?.accessToken.payload['cognito:groups'] as string[] | undefined;
      const group = groups?.find(g => ['Admin', 'Manager', 'Operator'].includes(g)) || null;

      const newCredentials: AwsCredentialIdentity = {
        accessKeyId: session.credentials.accessKeyId,
        secretAccessKey: session.credentials.secretAccessKey,
        sessionToken: session.credentials.sessionToken,
      };

      setCredentials(newCredentials);
      setUserGroup(group);
      setUserProfile({
        email: attributes.email || '',
        name: attributes.name || attributes.email || '',
      });
      setIsAuthenticated(true);
      setLastFetchTime(now);
      console.log('Fetched new credentials, group:', group);
    } catch (err: any) {
      console.error('Auth fetch error:', err.message || err);
      if (err.message.includes('Rate exceeded') && retries < MAX_RETRIES) {
        console.log(`Rate limit hit, retrying (${retries + 1}/${MAX_RETRIES})...`);
        await delay(RETRY_DELAY * (retries + 1));
        return fetchAuthData(retries + 1);
      }
      if (err.message.includes('InvalidIdentityPoolConfigurationException')) {
        setError('Invalid Identity Pool configuration. Please contact support.');
      } else if (err.message.includes('Token expired')) {
        console.log('Token expired, signing out');
        await signOut();
        router.push('/Login');
      } else {
        setError('Authentication failed. Please try again.');
      }
      setIsAuthenticated(false);
      router.push('/Login');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCredentials = async () => {
    setLastFetchTime(0); // Force refresh
    await fetchAuthData();
  };

  const signOutUser = async () => {
    try {
      await signOut();
      setCredentials(null);
      setUserGroup(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      setLastFetchTime(0);
      router.push('/Login');
    } catch (err) {
      console.error('Sign out error:', err);
      setError('Failed to sign out. Please try again.');
    }
  };

  useEffect(() => {
    fetchAuthData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        credentials,
        userGroup,
        userProfile,
        isAuthenticated,
        isLoading,
        error,
        refreshCredentials,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};