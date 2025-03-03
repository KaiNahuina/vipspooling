import { Amplify } from "aws-amplify";
import awsconfig from "../src/aws-exports";
Amplify.configure(awsconfig);


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import '@aws-amplify/ui-react/styles.css';



const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vip Spooling",
};

function RootLayout({
  children,
}: Readonly<{children: React.ReactNode;}>) 

{
 
  
  return (
    <html lang="en">
      
      <body className={`${inter.className} relative bg-transparent flex justify-center items-center 
      flex-col gap-10 min-h-screen`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}


export default RootLayout;