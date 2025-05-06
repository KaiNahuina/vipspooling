"use client";
import React, {useState} from 'react'
import emailjs from '@emailjs/browser'


const newTemplate = () => {
    const [formType, setFormType] = useState('');
    const [formSpecs, setFormSpecs] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const templateParams = {
            formType: formType || 'No type selected',
            formSpecs: formSpecs || 'No specifications made',
        };

        emailjs.send(
            'service_7at0q3k', //Service ID
            'template_t4svwgf', //Template ID
            templateParams,
            'OThiis90G_SdAJ8IL' //Account Public Key
        )
        .then(
            (response) => {
              console.log('Email sent successfully!', response.status, response.text);
              alert('Template request sent successfully!');
              setFormType(''); // Reset form
              setFormSpecs('');
            },
            (error) => {
              console.error('Failed to send email:', error);
              alert('Failed to send request. Please try again.');
            }
          )
          .finally(() => {
            setIsLoading(false);
          })
          ;

        
    }

  return (
    <div>
      <div className="flex justify-center items-center flex-col mb-10">
        <h1 className="text-header-lg text-black dark:text-white">Request a New Template</h1>
      </div>
      <div className="w-full flex flex-col justify-center items-center bg-white dark:bg-gray-100 px-4 py-10 mx-auto rounded-[5px]">
        <form className="w-full max-w-md flex justify-center items-center flex-col"
        onSubmit={handleSubmit}
        >
          
          <div className="mb-5 w-full flex justify-center items-center flex-col">
            <label htmlFor="group" className="block mb-2 text-sm font-medium text-black dark:text-white text-lg">
              Form Type
            </label>
            <select
              id="group"
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="">No Form Selected</option>
              <option value="Admins">Invoice Form</option>
              <option value="Users">JSA Form</option>
              <option value="PricingPlan">Pricing Plan</option>
              <option value="OtherForm">Other Form Type</option>
            </select>
          </div>
          <div className="mb-5 w-full flex justify-center items-center flex-col">
            <label htmlFor="specs" className="block mb-2 text-sm font-medium text-black dark:text-white text-lg">
              Form Specifications
            </label>
            <textarea
                id="specs"
                value={formSpecs}
                onChange={(e) => setFormSpecs(e.target.value)}
                className="border-2 border-gray-10 rounded-md w-full"
            />
          </div>
          <button
            type="submit"
            className="px-6 bg-gold-200 hover:bg-gold-100 text-gray-800 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none h-[56px]"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Request'}
          </button>
          
          
        </form>
      </div>
    </div>
  )
}

export default newTemplate