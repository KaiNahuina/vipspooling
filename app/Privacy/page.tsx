"use client";
import React from "react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-transparent dark:bg-gray-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-header-lg text-black dark:text-white mb-6 text-center">
          VIP Spooling Privacy Policy
        </h1>

        <p className="text-black dark:text-gray-300 mb-8 text-center">
          Effective Date: 05-12-2025
        </p>

        <section className="space-y-6 text-black dark:text-gray-300 leading-relaxed">
          <p>
            VIP Spooling operates an internal mobile application used only for business 
            operations within VIP Spooling. This policy explains how information is 
            collected, used, stored, and protected.
          </p>

          <h2 className="text-2xl font-semibold text-black dark:text-white mt-8">
            1. Information We Collect
          </h2>
          <p>We collect only what is required for business operations:</p>
          <ul className="list-disc ml-6 text-black">
            <li>Email address for authentication</li>
            <li>Forms and documents created by users</li>
            <li>Role and permission details</li>
          </ul>
          <p className="text-black">We do not collect location data, payment details, advertising identifiers, biometrics, personal contacts, or media.</p>

          <h2 className="text-2xl font-semibold text-black dark:text-white mt-8">
            2. How Information Is Collected
          </h2>
          <p className="text-black">
            Accounts are created only by an internal administrator. New users receive an 
            email with a unique access code to activate their account. Public registration 
            is not available.
          </p>

          <h2 className="text-2xl font-semibold text-black dark:text-white mt-8">
            3. How We Use Your Information
          </h2>
          <p className="text-black">Your information is used for:</p>
          <ul className="list-disc ml-6 text-black">
            <li>Authentication and access control</li>
            <li>Creating and managing internal forms</li>
            <li>Role based permissions</li>
            <li>Operational tracking and document storage</li>
          </ul>
          <p className="text-black">We do not use your data for marketing, advertising, profiling, or resale.</p>

          <h2 className="text-2xl font-semibold text-black dark:text-white mt-8">
            4. Data Storage and Security
          </h2>
          <p className="text-black">
            All information is stored securely using Amazon Web Services. This includes a 
            Node.js backend, DynamoDB for database storage, and Amazon S3 for encrypted 
            PDF storage.
          </p>

          <h2 className="text-2xl font-semibold text-black dark:text-white mt-8">
            5. Data Sharing and Third Parties
          </h2>
          <p className="text-black">
            We do not sell or share information with external parties. Data is processed 
            only through AWS as a secure service provider.
          </p>

          <h2 className="text-2xl font-semibold text-black dark:text-white mt-8">
            6. Data Retention
          </h2>
          <p className="text-black">
            Information is stored only as long as required for internal operations or 
            compliance. Removal requests may be submitted to an administrator.
          </p>

          <h2 className="text-2xl font-semibold text-black dark:text-white mt-8">
            7. User Rights
          </h2>
          <p className="text-black">Users may request access, corrections, or account deletion by contacting the administrator.</p>

          <h2 className="text-2xl font-semibold text-black dark:text-white mt-8">
            8. Children’s Privacy
          </h2>
          <p className="text-black">
            The app is intended only for employees and is not for individuals under thirteen. 
            No information is knowingly collected from minors.
          </p>

          <h2 className="text-2xl font-semibold text-black dark:text-white mt-8">
            9. Analytics and Tracking
          </h2>
          <p className="text-black">
            The app does not use analytics tools, tracking systems, or advertising services.
          </p>

          <h2 className="text-2xl font-semibold text-black dark:text-white mt-8">
            10. Changes to This Policy
          </h2>
          <p className="text-black">
            Updates may be applied as needed. Continued use of the app confirms acceptance 
            of any changes.
          </p>

          <h2 className="text-2xl font-semibold text-black dark:text-white mt-8">
            11. Contact Information
          </h2>
          <p className="text-black">
            VIP Spooling<br />
            Midland, TX, United States<br />
            entitysolutionsltd@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
