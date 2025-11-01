"use client";
import React, { useState } from 'react'

const Landing = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
  
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "adf2e9a1-f19b-40b6-bc3b-91608114d413",
          ...formData
        }),
      });
  
      const result = await response.json();
      if (result.success) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  return (
    <div className="min-h-screen bg-transparent dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-header-lg text-black dark:text-white mb-6">Welcome to VIP Invoices</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            VIP Invoices is your all-in-one solution for streamlined invoicing and payment management. 
            Designed for businesses and freelancers, our platform simplifies the process of creating, 
            sending, and tracking invoices with ease and efficiency.
          </p>
          <a
            href="#contact"
            className="px-6 py-3 bg-gold-200 hover:bg-gold-100 text-gray font-semibold 
              rounded-lg shadow-md transition ease-in duration-200 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-blue-500"
          >
            Get in Touch
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-transparent dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                Easy Form Creation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fill out business forms in minutes with customized templates.
              </p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                Team Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Manage team members by adding and removing team members in grouped roles.
              </p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                Pricing Plans
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access to multiple pricing plans to show to your clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-16 px-4 bg-gray-50 rounded-lg shadow-md">
        <div className="w-full max-w-4xl mx-auto">
         
          <div className="w-full flex flex-col justify-center items-center bg-transparent dark:bg-gray-100 px-4 py-10 mx-auto rounded-[5px]">
            <div className="flex justify-center items-center flex-col mb-10">
              <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 w-[75%]">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-gold-200 hover:bg-gold-100 text-gray w-full 
                  transition ease-in duration-200 text-center text-base font-semibold shadow-md 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing