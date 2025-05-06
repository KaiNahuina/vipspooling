"use client";
import React, { useState, useEffect } from 'react';
import { signOut, fetchAuthSession, getCurrentUser, updatePassword } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import {
  CognitoIdentityProviderClient,
  AdminListGroupsForUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

interface UserProfile {
  username: string;
  email: string;
  name: string;
  phoneNumber: string;
  groups: string[];
}

const Settings = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordFields, setShowPasswordFields] = useState(false); // Toggle for password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const user = await getCurrentUser();
        const session = await fetchAuthSession();

        if (!session.credentials) {
          throw new Error('No credentials available');
        }

        const attributes = session.tokens?.idToken?.payload || {};
        const credentials = {
          accessKeyId: session.credentials.accessKeyId,
          secretAccessKey: session.credentials.secretAccessKey,
          sessionToken: session.credentials.sessionToken,
        };

        const cognitoClient = new CognitoIdentityProviderClient({
          region: 'us-east-1',
          credentials,
        });
        const command = new AdminListGroupsForUserCommand({
          UserPoolId: 'us-east-1_Sk6JKaM2w', // Replace with your User Pool ID
          Username: user.username,
          Limit: 60,
        });
        const response = await cognitoClient.send(command);
        const groups = (response.Groups || []).map((group) => group.GroupName || '');

        const profile: UserProfile = {
          username: user.username,
          email: attributes['email'] as string || '',
          name: attributes['name'] as string || '',
          phoneNumber: attributes['phone_number'] as string || 'No Associated Phone Number',
          groups: groups.length > 0 ? groups : ['User'],
        };
        setUserProfile(profile);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        router.push('/Login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', isDarkMode.toString());
      if (isDarkMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  const handleDarkModeToggle = () => {
    setIsDarkMode((prevState) => !prevState);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }
    if (!oldPassword || !newPassword) {
      alert('Please fill in all password fields!');
      return;
    }
    try {
      const user = await getCurrentUser();
      await updatePassword({ oldPassword, newPassword });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordFields(false);
      alert('Password changed successfully!');
    } catch (err) {
      console.error('Error changing password:', err);
      alert('Failed to change password.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/Login');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const togglePasswordFields = () => {
    setShowPasswordFields((prev) => !prev);
    // Reset fields when hiding
    if (showPasswordFields) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
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

  if (!userProfile) {
    return null;
  }

  return (
    <div className="w-full h-full">
      <div className="flex justify-center items-center flex-col mb-6">
        <h1 className="text-header-lg text-gray-100 dark:text-gray-10">Settings</h1>
      </div>

      <div className="w-full max-w-3xl flex flex-col items-center px-4 py-10 mx-auto bg-white dark:bg-gray-100">
        {/* Profile Section */}
        <div className="w-full flex flex-col space-y-8 px-4 rounded-lg p-4 shadow-md dark:bg-gray-600">
          <div className="flex items-center justify-center mb-4">
            <h2 className="text-header-lg text-gray-100 dark:text-gray-10">Account Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col w-full">
              <h2 className="text-sm sm:text-base text-black dark:text-white">Full Name</h2>
              <input
                value={userProfile.name || ''}
                readOnly
                className="px-3 w-full text-sm sm:text-base bg-gray-700 dark:bg-gray-600 text-black dark:text-white p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
                name="name"
                type="text"
              />
            </div>

            <div className="flex flex-col w-full">
              <h2 className="text-sm sm:text-base text-black dark:text-white">Email Address</h2>
              <input
                value={userProfile.email || ''}
                readOnly
                className="px-3 w-full text-sm sm:text-base bg-gray-700 dark:bg-gray-600 text-black dark:text-white p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
                name="email"
                type="email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col w-full">
              <h2 className="text-sm sm:text-base text-black dark:text-white">Role</h2>
              <input
                value={userProfile.groups.join(', ') || 'None'} // Display groups as comma-separated string
                readOnly
                className="px-3 w-full text-sm sm:text-base bg-gray-700 dark:bg-gray-600 text-black dark:text-white p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
                name="groups"
                type="text"
              />
            </div>

            <div className="flex flex-col w-full">
              <h2 className="text-sm sm:text-base text-black dark:text-white">Phone Number</h2>
              <input
                value={userProfile.phoneNumber || ''}
                readOnly
                className="px-3 w-full text-sm sm:text-base bg-gray-700 dark:bg-gray-600 text-black dark:text-white p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
                name="phone"
                type="tel"
              />
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="w-full flex flex-col space-y-8 px-4 rounded-lg p-4 shadow-md mt-8 dark:bg-gray-600">
          <h2 className="text-sm sm:text-base text-black dark:text-white">Preferences</h2>

          <div className="flex flex-col gap-4">
            

            <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-700 dark:bg-gray-600 p-4 rounded-lg shadow-md">
              <h2 className="text-sm sm:text-base text-black dark:text-white">Dark Mode</h2>
              <label className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 dark:bg-gray-500 transition">
                <input
                  className="peer sr-only"
                  id="DarkMode"
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={handleDarkModeToggle}
                />
                <span className="absolute inset-y-0 left-0 m-1 h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-500 transition-all peer-checked:left-6 peer-checked:bg-white"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Password Preferences */}
        <div className="w-full flex flex-col space-y-8 px-4 rounded-lg p-4 shadow-md mt-8 dark:bg-gray-600">
          <h2 className="text-sm sm:text-base text-black dark:text-white">Password Preferences</h2>

          <div className="flex flex-col gap-4">
            <button
              onClick={togglePasswordFields}
              className="w-full max-w-xs mx-auto bg-gold-200 hover:bg-gold-100 text-gray-800 transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg py-2"
            >
              {showPasswordFields ? 'Cancel' : 'Change Password'}
            </button>

            {showPasswordFields && (
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col w-full">
                  <h2 className="text-sm sm:text-base text-black dark:text-white">Old Password</h2>
                  <input
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="px-3 w-full text-sm sm:text-base bg-gray-700 dark:bg-gray-600 text-black dark:text-white p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
                    name="oldpassword"
                    type="password"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <h2 className="text-sm sm:text-base text-black dark:text-white">New Password</h2>
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="px-3 w-full text-sm sm:text-base bg-gray-700 dark:bg-gray-600 text-black dark:text-white p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
                    name="newpassword"
                    type="password"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <h2 className="text-sm sm:text-base text-black dark:text-white">Confirm New Password</h2>
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="px-3 w-full text-sm sm:text-base bg-gray-700 dark:bg-gray-600 text-black dark:text-white p-2 border border-white/10 rounded-md outline-none focus:ring-2 focus:ring-gold"
                    name="confirmpassword"
                    type="password"
                  />
                </div>

                <button
                  onClick={handlePasswordChange}
                  className="w-full max-w-xs mx-auto bg-gold-200 hover:bg-gold-100 text-gray-800 transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg py-2"
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="w-full max-w-md bg-button-gradient-metallic rounded-lg p-4 shadow-md flex items-center justify-center mt-6">
          <button
            className="font-medium text-black dark:text-white hover:underline w-full h-full"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;