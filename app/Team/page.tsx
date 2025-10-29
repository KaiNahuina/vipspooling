"use client";
import Table from '@/components/Table';
import React, { useEffect, useState, useCallback } from 'react';
import Search from '@/components/Search';
import Modal from '@/components/Modal';
import { useRouter } from 'next/navigation';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminListGroupsForUserCommand,
  ListGroupsCommand,
  AdminDeleteUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

interface CognitoUser {
  username: string;
  email: string;
  enabled: string;
  groups: string[];
  userAttributes: { name: string; value: string }[];
}

const columns = [
  { key: 'email', header: 'Email' },
  { key: 'enabled', header: 'Enabled' },
  { key: 'groups', header: 'Group' },
];

const Team = () => {
  const router = useRouter();
  const [users, setUsers] = useState<CognitoUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [groups, setGroups] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userGroup, setUserGroup] = useState<string | null>(null);
  const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });
  const userPoolId = 'us-east-1_Sk6JKaM2w'; 

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      if (!session.credentials) throw new Error('No credentials available');
      const groups = session.tokens?.accessToken.payload['cognito:groups'] as string[] | undefined;
      const group = groups?.find(g => ['Admin', 'Manager', 'Operator'].includes(g)) || null;
      console.log('User group:', group);
      setUserGroup(group);
      if (!session.credentials) {
        throw new Error('No credentials available');
      }
      return {
        accessKeyId: session.credentials.accessKeyId,
        secretAccessKey: session.credentials.secretAccessKey,
        sessionToken: session.credentials.sessionToken,
      };
    } catch (err) {
      console.error('No signed in user:', err);
      router.push('/Login');
      return null;
    }
  };

  const fetchGroups = useCallback(async (credentials: any) => {
    try {
      const cognitoClient = new CognitoIdentityProviderClient({
        region: 'us-east-1',
        credentials,
      });
      const command = new ListGroupsCommand({
        UserPoolId: userPoolId,
        Limit: 60,
      });
      const response = await cognitoClient.send(command);
      const groupNames = (response.Groups || []).map((group) => group.GroupName || '');
      setGroups(groupNames);
      return groupNames;
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to fetch groups.');
      return [];
    }
  }, []);

  const fetchUserGroups = async (username: string, credentials: any) => {
    try {
      const cognitoClient = new CognitoIdentityProviderClient({
        region: 'us-east-1',
        credentials,
      });
      const command = new AdminListGroupsForUserCommand({
        UserPoolId: userPoolId,
        Username: username,
        Limit: 60,
      });
      const response = await cognitoClient.send(command);
      return (response.Groups || []).map((group) => group.GroupName || '');
    } catch (err) {
      console.error(`Error fetching groups for user ${username}:`, err);
      return [];
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      const credentials = await checkAuth();
      if (!credentials) return;

      setIsLoading(true);
      setError(null);

      const cognitoClient = new CognitoIdentityProviderClient({
        region: 'us-east-1',
        credentials,
      });

      const command = new ListUsersCommand({
        UserPoolId: userPoolId,
        Limit: 60,
      });

      const response = await cognitoClient.send(command);

      if (response.Users) {
        await fetchGroups(credentials);
        const formattedUsers = await Promise.all(
          response.Users.map(async (user) => {
            const userGroups = await fetchUserGroups(user.Username || '', credentials);
            return {
              username: user.Username || '',
              email: user.Attributes?.find((attr) => attr.Name === 'email')?.Value || '',
              enabled: user.Enabled ? 'Yes' : 'No',
              groups: userGroups,
              userAttributes: (user.Attributes || []).map((attr) => ({
                name: attr.Name ?? '',
                value: attr.Value ?? '',
              })),
            };
          })
        );
        setUsers(formattedUsers);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      if (err instanceof Error) {
        if (err.message.includes('401') || err.name === 'AccessDeniedException') {
          setError('You are not authorized to list users. Check your permissions.');
        } else {
          setError('Failed to fetch users. Please try again later.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (user: CognitoUser) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    setIsLoading(true);
    setError(null);

    try {
      const credentials = await checkAuth();
      if (!credentials) return;

      const cognitoClient = new CognitoIdentityProviderClient({
        region: 'us-east-1',
        credentials,
      });

      const deleteUserCommand = new AdminDeleteUserCommand({
        UserPoolId: userPoolId,
        Username: user.username,
      });

      await cognitoClient.send(deleteUserCommand);
      console.log(`User ${user.username} deleted successfully`);

      await fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      if (err instanceof Error) {
        if (err.name === 'UserNotFoundException') {
          setError('User not found.');
        } else if (err.name === 'AccessDeniedException') {
          setError('You lack permission to delete users.');
        } else {
          setError('Failed to delete user. Please try again.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search query
  const filterUsers = (users: CognitoUser[]): CognitoUser[] => {
    if (!searchQuery) return users;
    const query = searchQuery.toLowerCase();
    return users.filter((user) =>
      [user.email, user.username, user.enabled, ...user.groups].some(
        (value) => value.toLowerCase().includes(query)
      )
    );
  };

  const filteredUsers = filterUsers(users);
  const tabFilteredUsers =
    activeTab === 'all' ? filteredUsers : filteredUsers.filter((user) => user.groups.includes(activeTab));

  return (
    <div className="w-full">
      <div className="flex justify-center items-center flex-col mb-10">
        <h1 className="text-header-lg text-black dark:text-white">My Team</h1>
      </div>
      <div className="min-h-[360px] pt-[25px] flex-grow flex flex-col justify-between rounded-[5px] bg-gray-200 dark:bg-gray-100">
        <div className="mb-[25px] px-4 lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-2xl font-semibold text-black dark:text-white">Team Info</h2>
              <div className="flex items-center gap-4 w-full max-w-md">
                <Search onSearch={setSearchQuery} /> 
                {userGroup !== 'Operator' && (
                  <button
                    onClick={() => router.push('/Team/add-member')}
                    className="px-6 bg-gold-200 hover:bg-gold-100 text-gray-800 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none h-[56px]"
                  >
                    +
                  </button>
                )}
              </div>
            </div>
            <div className="flex space-x-4 border-b border-gray-300">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'all'
                    ? 'text-gold-200 border-b-2 border-gold-200'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Users
              </button>
              {groups.map((group) => (
                <button
                  key={group}
                  onClick={() => setActiveTab(group)}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === group
                      ? 'text-gold-200 border-b-2 border-gold-200'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 py-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}
          <Table
            columns={columns}
            data={tabFilteredUsers} // Use filtered data with tab logic
            isLoading={isLoading}
            onDelete={userGroup === 'Operator' ? undefined : handleDelete}
            userGroup={userGroup}
            showActions={userGroup !== 'Operator'}
          />
        </div>
      </div>
    </div>
  );
};

export default Team;