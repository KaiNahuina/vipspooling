"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAuthSession } from 'aws-amplify/auth';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const userPoolId = 'us-east-1_Sk6JKaM2w'; // Replace with your User Pool ID
const region = 'us-east-1'; // Replace with your region

const NewMember = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [group, setGroup] = useState<string | null>(null); // Optional: Set to 'Admins', 'Users', etc., or null for no group
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getCredentials = async () => {
    try {
      const session = await fetchAuthSession();
      if (!session.credentials) {
        throw new Error('No credentials available');
      }
      return {
        accessKeyId: session.credentials.accessKeyId,
        secretAccessKey: session.credentials.secretAccessKey,
        sessionToken: session.credentials.sessionToken,
      };
    } catch (err) {
      console.error('Error fetching credentials:', err);
      router.push('/Login');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const credentials = await getCredentials();
    if (!credentials) return;

    const client = new CognitoIdentityProviderClient({
      region,
      credentials,
    });

    try {
      // Step 1: Create the user in the User Pool
      const createUserCommand = new AdminCreateUserCommand({
        UserPoolId: userPoolId,
        Username: email, // Cognito uses email as username if configured
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'email_verified', Value: 'false' }, // Invite requires verification
        ],
        DesiredDeliveryMediums: ['EMAIL'], // Send invite via email
      });

      const response = await client.send(createUserCommand);
      console.log('User created:', response);

      // Step 2: Add user to a specific group
      if (group) {
        const addToGroupCommand = new AdminAddUserToGroupCommand({
          UserPoolId: userPoolId,
          Username: email,
          GroupName: group,
        });
        await client.send(addToGroupCommand);
        console.log(`User added to group: ${group}`);
      }

      setSuccess(`Invitation sent to ${email}${group ? ` in group ${group}` : ''}!`);
      setEmail(''); // Reset form
    } catch (err) {
      console.error('Error inviting user:', err);
      if (err instanceof Error) {
        if (err.name === 'UsernameExistsException') {
          setError('This email is already in use.');
        } else if (err.name === 'AccessDeniedException') {
          setError('You lack permission to invite users.');
        } else {
          setError('Failed to send invite. Please try again.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center flex-col mb-10">
        <h1 className="text-header-lg text-black dark:text-white">Add New Member</h1>
      </div>
      <div className="w-full flex flex-col justify-center items-center bg-white dark:bg-gray-100 px-4 py-10 mx-auto rounded-[5px]">
        <form onSubmit={handleSubmit} className="w-full max-w-md flex justify-center items-center flex-col">
          <div className="mb-5 w-full flex justify-center items-center flex-col">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-black dark:text-white text-lg">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Email Address"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-5 w-full flex justify-center items-center flex-col">
            <label htmlFor="group" className="block mb-2 text-sm font-medium text-black dark:text-white text-lg">
              Group
            </label>
            <select
              id="group"
              value={group || ''}
              onChange={(e) => setGroup(e.target.value || null)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              disabled={isLoading}
            >
              <option value="">No Group Selected</option>
              <option value="Admins">Admins</option>
              <option value="Users">Manager</option>
              <option value="Operator">Operator</option>
            </select>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 w-full text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 w-full text-center">
              {success}
            </div>
          )}
          <button
            type="submit"
            className="px-6 bg-gold-200 hover:bg-gold-100 text-gray-800 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none h-[56px]"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Invite'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewMember;