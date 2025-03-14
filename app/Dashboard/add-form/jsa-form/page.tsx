"use client";
import React from 'react'
import {useState, useRef} from 'react'
import SignatureCanvas from 'react-signature-canvas';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { generateClient } from 'aws-amplify/api';
import { createJsaForm } from '@/src/graphql/mutations';
import { CreateJsaFormInput, PersonInput } from '@/src/graphql/API';
import { useRouter } from 'next/navigation';

const client = generateClient();

const NewForm = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        customerName: "",  // Customer Name
        effectiveDate: "",  // Effective Date
        location: "",  // Worksite Location
        personnel: [{ name: "", jobTitle: "", signature: "" }],  // List of personnel (name and job title) Base64 encoded image links or S3 URLs for signatures
      });

      const [isModalOpen, setIsModalOpen] = useState(false);
      const [currentSignatureIndex, setCurrentSignatureIndex] = useState<number | null>(null);
      const sigCanvas = useRef<SignatureCanvas | null>(null);


      const jobTitles = [
        "Customer Rep",
        "Service Tech",
        "Spooler/Bander",
        "Rig Operator",
        "Rig Crew",
        "Other"
      ];

      const riskAssessment = [
        {
          category: "Low",
          frequency: "Harm or loss is unlikely to occur (Seldom – Occurs once every 5-10 yrs).",
          severity: "Minimal near miss or minor first aid injury.",
          riskScore: "Acceptable with present controls in place.",
        },
        {
          category: "Medium",
          frequency: "Harm or loss is possible, although only expected to occur occasionally (Occasional – Occurs once or more every 1 – 5 yrs).",
          severity: "Recordable injury, lost time, serious property damage, fires extinguished onsite.",
          riskScore: "Further controls should be considered and recommended.",
        },
        {
          category: "High",
          frequency: "Harm or loss is expected to occur frequently. (Frequent – Occurs one or more every 1-12 months).",
          severity: "Serious injury or fatality, major equipment damage, fires requiring offsite assistance, facility-wide fire, explosion, offsite impact, etc.",
          riskScore: "Additional controls must be identified and mandated.",
        },
      ];
      
      const ppeCodes = {
        A: "Safety Glasses",
        B: "Safety Shoes",
        D: "Hearing Protection (specify type)",
        E: "Hot Gloves (specify class & type)",
        F: "H2S Detector",
        G: "Hard Hat",
        H: "Coverall",
        I: "Fire Retardant Clothing / Coverall",
        J: "Chemical Resistant Boots",
        K: "Work Gloves (specify type)",
        L: "Chemical Resistant Gloves (specify type)",
        M: "Cut Resistant Gloves (specify type)",
        N: "Full-face Air-Purifying Respirator, specify cartridge",
        O: "Supplied Air Respirator, circle: SCBA or Airline",
        P: "Fall Protection",
        Q: "Personal Monitor, type:",
        R: "LOTO",
        S: "Other, specify:",
      };
      
      const jobSafetyAnalysis = [
        {
          stepNo: 1,
          taskStep: "Disconnect DH Cable",
          hazard: "Electrical",
          controls: "LOTO, Hot gloves",
          requiredPPE: "ABFGIKRE",
          riskRanking: "Low",
        },
        {
          stepNo: 2,
          taskStep: "Flange up BOP",
          hazard: "Pinch points and overhead hazard, slips-trips",
          controls: "Hard hat, gloves, ST boots, safety glasses, Tag Lines",
          requiredPPE: "ABFGIKR",
          riskRanking: "Low",
        },
        {
          stepNo: 3,
          taskStep: "Unseat and remove hanger",
          hazard: "Pinch points and overhead hazard, slips-trips",
          controls: "Hard hat, gloves, ST boots, safety glasses",
          requiredPPE: "ABFGIKR",
          riskRanking: "Low",
        },
        {
          stepNo: 4,
          taskStep: "Rig up spoolers and pull well",
          hazard: "Pinch points and overhead hazard, slips-trips",
          controls: "Hard hat, gloves, ST boots, safety glasses, Tag Lines",
          requiredPPE: "ABFGIKR",
          riskRanking: "Low",
        },
        {
          stepNo: 5,
          taskStep: "Disassemble and lay down ESP",
          hazard: "Pinch points and overhead hazard, slips-trips",
          controls: "Hard hat, gloves, ST boots, safety glasses, Tag Lines",
          requiredPPE: "ABFGIKR",
          riskRanking: "Low",
        },
      ];
      
      
      const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

      // Function to handle the date change
      const handleDateChange = (date: dayjs.Dayjs | null) => {
        setSelectedDate(date);
      };

    
      
      const handlePersonnelChange = (index: number, field: keyof typeof formData.personnel[0], value: string|number) => {
        const updatedPersonnel = [...formData.personnel];
        updatedPersonnel[index][field] = value as never;
        setFormData({ ...formData, personnel: updatedPersonnel });
      };
      
      const addPersonnel = () => {
        setFormData({
          ...formData,
          personnel: [...formData.personnel, { name: "", jobTitle: "", signature: "" }],
        });
      };
      
      const removePersonnel = (index: number) => {
        const updatedPersonnel = formData.personnel.filter((_, i) => i !== index);
        setFormData({ ...formData, personnel: updatedPersonnel });
      };
      

      {/*Date Picker Logic*/}
      const [value, setValue] = useState<Date |null>(null);

      const openSignatureModal = (index: number) => {
        setCurrentSignatureIndex(index);
        setIsModalOpen(true);
      };
    
      // Save the signature
      const saveSignature = () => {
        if (sigCanvas.current && currentSignatureIndex !== null) {
          const signatureImage = sigCanvas.current.toDataURL("image/png");
      
          setFormData((prevData) => {
            const updatedPersonnel = [...prevData.personnel];
            updatedPersonnel[currentSignatureIndex] = {
              ...updatedPersonnel[currentSignatureIndex],
              signature: signatureImage,
            };
      
            return { 
              ...prevData, 
              personnel: updatedPersonnel 
            }; // ✅ Ensure we return the new state
          });
      
          setIsModalOpen(false);
        }
      };
    
      // Clear the signature pad
      const clearSignature = () => {
        if(sigCanvas.current){
          sigCanvas.current.clear();
        }
      };
      
    

      {/*Form Submission*/}
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // Check if all required signatures exist
            const missingSignatures = formData.personnel.some(person => !person.signature);
            if (missingSignatures) {
                alert('Please ensure all personnel have signed before submitting.');
                return;
            }

            // Format the form data to match the CreateJsaFormInput type
            const jsaData: CreateJsaFormInput = {
                CustomerName: formData.customerName,
                FormDate: selectedDate?.format('YYYY-MM-DD') || new Date().toISOString(),
                EffectiveDate: selectedDate?.format('YYYY-MM-DD') || new Date().toISOString(),
                Location: formData.location,
                Personnel: formData.personnel.map(person => ({
                    Role: person.jobTitle,
                    PersonName: person.name,
                    Signature: person.signature
                } as PersonInput))
            };

            console.log('Submitting JSA form data:', jsaData);

            // Submit the form data to the database
            const response = await client.graphql({
                query: createJsaForm,
                variables: { input: jsaData }
            });
            
            console.log('Response:', response);

            if (response.data.createJsaForm) {
                // Clear the form
                setFormData({
                    customerName: "",
                    effectiveDate: "",
                    location: "",
                    personnel: [
                        { name: "", jobTitle: "", signature: "" }
                    ]
                });
                setSelectedDate(null);
                
                // Show success message
                alert('JSA form submitted successfully!');
            }
        } catch (error) {
            console.error('Error submitting JSA form:', error);
            alert('Error submitting JSA form. Please try again.');
        }
      };

    

      return (
        <>
          <div className="w-full max-w-3xl mx-auto px-4">
            <div className="flex items-start">
              <button
                type="button"
                onClick={() => router.push('/Dashboard/add-form')}
                className="w-16 rounded-2xl h-14 relative group mt-2 mr-2"
              >
                <div className="bg-yellow-300 rounded-xl h-12 w-full grid place-items-center absolute left-0 top-0 group-hover:w-full z-10 duration-500">
                  <svg
                    width="25px"
                    height="25px"
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#000000"
                      d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                    ></path>
                    <path
                      fill="#000000"
                      d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                    ></path>
                  </svg>
                </div>
              </button>
          
          <div className="w-full max-w-3xl flex flex-col items-center bg-white dark:bg-gray-100 px-4 py-10 mx-auto rounded-[5px]">
            <div className="flex flex-col items-center justify-center gap-2 mb-8">
              <h1 className='text-black dark:text-white'>
                JSA Form
              </h1>
            </div>
    
            <form className="w-full" onSubmit={handleSubmit}>
                
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
    
                <div className="mb-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Customer Name</label>
                    <input
                      type="text"
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Customer Name"
                      className="border border-gray-400 rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Customer Location</label>
                    <input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Customer Location"
                      className="border border-gray-400 rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                </div>
    
                <div className="mb-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        sx={{
                          width: '100%',
                          "& .MuiOutlinedInput-root": {
                            height: '38px',
                            border: '1px solid #9CA3AF',
                            borderRadius: '0.5rem',
                            backgroundColor: 'transparent',
                            "&:hover": {
                              borderColor: '#9CA3AF',
                            },
                            "& fieldset": {
                              border: 'none',
                            },
                          },
                          "& .MuiInputBase-input": {
                            fontSize: '0.875rem',
                            padding: '0.5rem 0.75rem',
                            color: 'inherit',
                          },
                          "& .MuiSvgIcon-root": {
                            color: 'currentColor',
                          },
                        }}
                        slotProps={{
                          textField: {
                            placeholder: "Select Date",
                          },
                        }}
                      />
                    </LocalizationProvider>
                </div>
                
              </div>

              <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700"/>

              <table className="w-full mb-8 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Step No</th>
                    <th className="border px-4 py-2">Task / Step</th>
                    <th className="border px-4 py-2">Potential Hazards</th>
                    <th className="border px-4 py-2">Hazard Controls</th>
                    <th className="border px-4 py-2">Required PPE</th>
                    <th className="border px-4 py-2">Risk Ranking</th>
                  </tr>
                </thead>
                <tbody>
                  {jobSafetyAnalysis.map((step) => (
                    <tr key={step.stepNo} className="border-b">
                      <td className="border px-4 py-2">{step.stepNo}</td>
                      <td className="border px-4 py-2">{step.taskStep}</td>
                      <td className="border px-4 py-2">{step.hazard}</td>
                      <td className="border px-4 py-2">{step.controls}</td>
                      <td className="border px-4 py-2">{step.requiredPPE}</td>
                      <td className="border px-4 py-2">{step.riskRanking}</td>
                    </tr>
                  ))}
                </tbody>
              </table>


              <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700"/>

    
              <table className="w-full mb-8 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Risk Level</th>
                    <th className="border px-4 py-2">Frequency</th>
                    <th className="border px-4 py-2">Severity</th>
                    <th className="border px-4 py-2">Risk Score</th>
                  </tr>
                </thead>
                <tbody>
                  {riskAssessment.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="border px-4 py-2">{item.category}</td>
                      <td className="border px-4 py-2">{item.frequency}</td>
                      <td className="border px-4 py-2">{item.severity}</td>
                      <td className="border px-4 py-2">{item.riskScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">PPE Code</th>
                    <th className="border px-4 py-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(ppeCodes).map(([code, description]) => (
                    <tr key={code} className="border-b">
                      <td className="border px-4 py-2 font-bold">{code}</td>
                      <td className="border px-4 py-2">{description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>


              <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    
              {/*Personnel*/}
              <div className="mb-8">
                <div className="grid grid-cols-4 gap-4 font-medium bg-gray-300 p-2 rounded-md mb-2">
                  <span>Title</span>
                  <span>Name</span>
                  <span className="text-right">Signature</span>
                </div>
    
                {formData.personnel.map((person, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 items-center">
                    <select
                      value={person.jobTitle}
                      onChange={(e) => handlePersonnelChange(index, "jobTitle", e.target.value)}
                      className="border border-gray-400 p-2 rounded-md dark:bg-transparent text-black dark:text-white"
                    >
                      <option value="">Select Job Title</option>
                      {jobTitles.map((title, idx) => (
                        <option key={idx} value={title}>
                            {title}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={person.name}
                      onChange={(e) => handlePersonnelChange(index, "name", e.target.value)}
                      placeholder="Name"
                      className="border border-gray-400 p-2 rounded-md min-w-[200px] dark:bg-transparent text-black dark:text-white"
                    />

    
                    {/* Signature and Sign Button */}
                    <div className="flex justify-end items-center">
                      {person.signature ? (
                        <img
                          src={person.signature}
                          alt="Signature"
                          className="w-20 h-10 border border-gray-400 rounded-md cursor-pointer"
                          onClick={() => openSignatureModal(index)}
                        />
                      ) : (
                        <button
                          onClick={() => openSignatureModal(index)}
                          className="border px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-800 text-black dark:text-white"
                        >
                          Sign
                        </button>
                      )}
                    </div>
    
                    {isModalOpen && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                          <h2 className="text-lg font-semibold mb-2">Sign Here</h2>
                          <SignatureCanvas
                            ref={sigCanvas}
                            penColor="black"
                            canvasProps={{ className: "border border-gray-400 w-64 h-32" }}
                          />
                          <div className="flex justify-between mt-4">
                            <button onClick={clearSignature} className="px-4 py-2 bg-red-500 text-white rounded">Clear</button>
                            <button onClick={saveSignature} className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded">Close</button>
                          </div>
                        </div>
                      </div>
                    )}
    
                    <div className="flex justify-between items-center">
                      {formData.personnel.length > 1 && (
                        <button
                          onClick={() => removePersonnel(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
    
                {/* Add personnel button */}
                <button
                  onClick={addPersonnel}
                  className="text-gray-100 px-4 py-2 rounded-md bg-gold-200 hover:bg-gold-100 mt-2"
                >
                  + Add New Person
                </button>
              </div>
    
              <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700"/>
              
              <div className="flex flex-col items-center justify-center gap-2 mb-8">
                <button
                  className="text-gray-100 px-4 py-2 rounded-md bg-gold-200 hover:bg-gold-100 mt-2"
                >
                  Submit
                </button>
              </div>
              
            </form>
            </div>
            </div>
          </div>
        </>
      )
    
      
}

export default NewForm