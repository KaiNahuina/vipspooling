"use client";
import React from 'react'
import {useState, useRef, useEffect} from 'react'
import SignatureCanvas from 'react-signature-canvas';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import { generateClient } from 'aws-amplify/api';
import { createJsaForm } from '@/src/graphql/mutations';
import { CreateJsaFormInput, PersonInput } from '@/src/graphql/API';
import { useRouter } from 'next/navigation';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getTemplate } from '@/utils/template';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import type { AwsCredentialIdentity } from '@aws-sdk/types';
import { fetchAuthSession } from 'aws-amplify/auth';
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import DOMPurify from "dompurify";



const client = generateClient();

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

const lambdaClient = new LambdaClient({
  region: "us-east-1",
  credentials: getCredentials,
});

const sanitizeInput = (value: string): string => {
  return DOMPurify.sanitize(value, { USE_PROFILES: { html: true } });
};


interface Person {
  name: string;
  jobTitle: string;
  signature: string; // Base64 encoded image
}

interface lastRow{
  task: string;
  safetyHazards: string;
  identifiedHazards: string;
  ppe: string;
  riskRanking: string;
  notes: string;
}

interface note{
  id: string;
  note: string;
}

interface JsaFormData {
  workTicketID: string;
  customerName: string;
  createdBy: string;
  createdByName: string;
  effectiveDate: string;
  location: string;
  notes: note[];
  lastRow: lastRow;
  personnel: Person[];
}

const fillAndUploadPDF = async (
  formData: JsaFormData,
  selectedDate: Dayjs | null,
) => {
  console.log('Starting PDF generation...');

  // Load the actual template if available, otherwise create a blank A4 PDF
  let pdfDoc: PDFDocument;
  try {
    const templateBytes = await getTemplate('JSAForm.pdf');
    pdfDoc = await PDFDocument.load(templateBytes);
    console.log('Loaded JSAForm.pdf template.');
  } catch (error) {
    console.warn('Could not load template JSAForm.pdf, creating a blank A4 page instead.', error);
    pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([595, 842]); // A4 size in points (72 DPI)
  }

  let page = pdfDoc.getPage(0);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 7;
  const textColor = rgb(0, 0, 0);
 
  

  const customerNameLocation = `${sanitizeInput(formData.customerName) || 'N/A'} - ${sanitizeInput(formData.location) || 'N/A'}`;

  // Customer Name - Adjust x, y to match your template
  page.drawText(customerNameLocation || 'N/A', { 
    x: 210, y: 964, size: fontSize, font: helveticaFont, color: textColor });
    

  // Effective Date - Adjust x, y to match your template
  page.drawText(selectedDate?.format('YYYY-MM-DD') || sanitizeInput(formData.effectiveDate) || 'N/A', {
     x: 210, y: 953, size: fontSize, font: helveticaFont, color: textColor });

     const notesRowHeight = 30;
    let noteY = 862;
     for (const note of formData.notes){
        page.drawText(sanitizeInput(note.note) || 'No Note', {
          x:637,
          y:noteY,
          size: 5,
          font: helveticaFont,
          color: textColor
        });
        noteY -=notesRowHeight;
     }
  
    //Last Row
        page.drawText(sanitizeInput(formData.lastRow.task) || 'No Step', {
          x:118,
          y:703,
          size: 9,
          font: helveticaFont,
          color: textColor
        });
        page.drawText(sanitizeInput(formData.lastRow.safetyHazards) || 'No Hazards', {
          x:221,
          y:703,
          size: 9,
          font: helveticaFont,
          color: textColor
        });
        page.drawText(sanitizeInput(formData.lastRow.identifiedHazards) || 'No Hazards Identified', {
          x:324,
          y:703,
          size: 9,
          font: helveticaFont,
          color: textColor
        });
        page.drawText(sanitizeInput(formData.lastRow.ppe) || 'No PPE', {
          x:427,
          y:703,
          size: 9,
          font: helveticaFont,
          color: textColor
        });
        page.drawText(sanitizeInput(formData.lastRow.riskRanking) || 'No Ranking', {
          x:532,
          y:703,
          size: 9,
          font: helveticaFont,
          color: textColor
        });
        page.drawText(sanitizeInput(formData.lastRow.notes) || 'No Note', {
          x:635,
          y:710,
          size: 5,
          font: helveticaFont,
          color: textColor
        });
  

     const personnelRowHeight = 25; // Approximate height of each row in the personnel table
     let currentY = 412; // Starting Y position for the first row (adjust based on template)
      const personnelFontSize = 13;

     for (const person of formData.personnel) {
       // Draw job title
       page.drawText(sanitizeInput(person.jobTitle) || 'N/A', {
         x: 45, // Adjust based on template
         y: currentY + 7, // Center vertically in the cell
         size: personnelFontSize,
         font: helveticaFont,
         color: textColor,
       });
   
       // Draw name
       page.drawText(sanitizeInput(person.name) || 'N/A', {
         x: 203, // Adjust based on template
         y: currentY + 7, // Center vertically in the cell
         size: personnelFontSize,
         font: helveticaFont,
         color: textColor,
       });
      




  // Customer Signature (with transparent background, after the footer)
    if (person.signature) {
      try {
        console.log(`'Converting signature for ${person.name} to PNG with transparent background...'`);
        const startEmbed = Date.now();

        if (!person.signature.startsWith('data:image/png;base64,')) {
          throw new Error('Invalid signature format: Not a PNG base64 string');
        }

        const base64Data = person.signature.replace(/^data:image\/png;base64,/, '');
        if (!base64Data) {
          throw new Error('Signature is empty or invalid');
        }

        const imgBuffer = Buffer.from(base64Data, 'base64');

        const signatureImage = await pdfDoc.embedPng(imgBuffer);
        console.log(`Signature embedded in ${Date.now() - startEmbed}ms.`);

        
        // Draw the signature below the footer
        page.drawImage(signatureImage, { x: 540, y: currentY -9, width: 80, height: 40 });
        console.log('Signature drawn on page.');
      } catch (error) {
        console.error('Error embedding signature (skipping signature):', error);
      }
    }
  currentY -= personnelRowHeight;
}
const pdfBytes = await pdfDoc.save();
  const fileName = `${formData.customerName, formData.location || 'Unknown'}-${Date.now()}.pdf`;
  const params = {
    Bucket: 'vip-completed-jsa',
    Key: fileName,
    Body: pdfBytes,
    ContentType: 'application/pdf',
  };
  await s3Client.send(new PutObjectCommand(params));
  return `s3://${params.Bucket}/${params.Key}`;

  
};


const NewForm = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        workTicketID: "",
        customerName: "",  
        createdBy:"",
        createdByName:"",
        effectiveDate: "",  
        location: "",
        notes:[
          {id:"stepOneNotes", note: ""},
          {id:"stepTwoNotes" , note: ""},
          {id:"stepThreeNotes", note: ""},
          {id:"stepFourNotes", note: ""},
          {id:"stepFiveNotes", note: ""},
        ],
        lastRow: {
          task: "",
          safetyHazards: "",
          identifiedHazards: "",
          ppe: "",
          riskRanking: "",
          notes: "",
        },  
        personnel: [{ name: "", jobTitle: "", signature: "" }],  
      });

      const [isModalOpen, setIsModalOpen] = useState(false);
      const [currentSignatureIndex, setCurrentSignatureIndex] = useState<number | null>(null);
      const sigCanvas = useRef<SignatureCanvas | null>(null);
      const [errors, setErrors] = useState<string[]>([]);
      const [apiError, setApiError] = useState<string | null>(null);
      const [isLoadingWorkTicket, setIsLoadingWorkTicket] = useState(false);
      const hasFetchedWorkTicket = useRef(false);

      useEffect(() => {
        if (hasFetchedWorkTicket.current) return;
        hasFetchedWorkTicket.current = true;
    
        const fetchWorkTicketID = async () => {
          setIsLoadingWorkTicket(true);
          setApiError(null);
          try {
            const command = new InvokeCommand({
              FunctionName: "GenerateWorkTicketID-Jsa",
              Payload: JSON.stringify({}),
            });
            const response = await lambdaClient.send(command);
            console.log("Lambda response:", response);
    
            if (!response.Payload) {
              throw new Error("Empty response from Lambda");
            }
    
            let payload;
            try {
              const payloadString = Buffer.from(response.Payload).toString();
              console.log("Payload string:", payloadString);
              payload = JSON.parse(payloadString);
              console.log("Parsed payload:", payload);
            } catch (parseError: any) {
              throw new Error(`Failed to parse Lambda response: ${parseError.message}`);
            }
    
            let bodyPayload;
            if (payload.body) {
              try {
                bodyPayload = JSON.parse(payload.body);
                console.log("Parsed body payload:", bodyPayload);
              } catch (parseError: any) {
                throw new Error(`Failed to parse body payload: ${parseError.message}`);
              }
            } else {
              bodyPayload = payload;
            }
    
            if (response.StatusCode === 200 && bodyPayload.workTicketID) {
              setFormData((prev) => ({ ...prev, workTicketID: bodyPayload.workTicketID }));
            } else if (bodyPayload.error) {
              throw new Error(`${bodyPayload.error}: ${bodyPayload.details || "No details provided"}`);
            } else {
              throw new Error("No workTicketID found in response");
            }
          } catch (error: any) {
            console.error("Error fetching WorkTicketID:", error);
            setApiError(`Failed to generate Work Ticket ID: ${error.message}`);
          } finally {
            setIsLoadingWorkTicket(false);
          }
        };
    
        fetchWorkTicketID();
      }, []);


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
            };
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

            const s3Url = await fillAndUploadPDF(formData, selectedDate);
            console.log('Final product uploaded to S3:', s3Url);

            // Format the form data to match the CreateJsaFormInput type
            const jsaData: CreateJsaFormInput = {
                WorkTicketID: formData.workTicketID,
                CustomerName: sanitizeInput(formData.customerName),
                CreatedBy:sanitizeInput(formData.createdBy),
                FormDate: selectedDate?.format('YYYY-MM-DD') || new Date().toISOString(),
                EffectiveDate: selectedDate?.format('YYYY-MM-DD') || new Date().toISOString(),
                Location: sanitizeInput(formData.location),
                Personnel: formData.personnel.map(person => ({
                    Role: sanitizeInput(person.jobTitle),
                    PersonName: sanitizeInput(person.name),
                    Signature: person.signature
                } as PersonInput)),
                FinalProductFile: s3Url
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
                    workTicketID: "",
                    customerName: "",
                    createdBy:"",
                    createdByName:"",
                    effectiveDate: "",
                    location: "",
                    notes:[
                      {id:"stepOneNotes", note: ""},
                      {id:"stepTwoNotes" , note: ""},
                      {id:"stepThreeNotes", note: ""},
                      {id:"stepFourNotes", note: ""},
                      {id:"stepFiveNotes", note: ""},
                    ],
                    lastRow: {
                      task: "",
                      safetyHazards: "",
                      identifiedHazards: "",
                      ppe: "",
                      riskRanking: "",
                      notes: "",
                    },  
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
      <script src="https://unpkg.com/flowbite@1.5.3/dist/flowbite.js" async></script>
      <div className="w-[75%] mx-auto px-4">
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
      
          <div className="w-full flex flex-col items-center bg-white dark:bg-gray-100 px-4 py-10 mx-auto rounded-[5px]">
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
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Created By</label>
                  <input
                    type="text"
                    id="CreatedBy"
                    value={formData.createdBy}
                    onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                    placeholder="First and Last Name of spooler"
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

              <div id="indicators-carousel" className="relative w-full mb-8 bg-white dark:bg-gray-100" data-carousel="static">
                <div className="relative h-[600px] overflow-hidden rounded-lg">
                  {jobSafetyAnalysis.map((step, index) => (
                    <div
                      key={step.stepNo}
                      className={`hidden duration-700 ease-in-out ${index === 0 ? 'block' : ''}`}
                      data-carousel-item={index === 0 ? "active" : ""}
                    >
                      <div className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 p-6 bg-white dark:bg-gray-100 border border-gray-300 rounded-lg min-h-[550px]">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Step {step.stepNo}</h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Task / Step</label>
                            <p className="border border-gray-300 rounded px-3 py-2 bg-gray-200 dark:bg-gray-300 text-gray-900 dark:text-white">{step.taskStep}</p>
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Potential Hazards</label>
                            <p className="border border-gray-300 rounded px-3 py-2 bg-gray-200 dark:bg-gray-300 text-gray-900 dark:text-white">{step.hazard}</p>
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hazard Controls</label>
                            <p className="border border-gray-300 rounded px-3 py-2 bg-gray-200 dark:bg-gray-300 text-gray-900 dark:text-white">{step.controls}</p>
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Required PPE</label>
                            <p className="border border-gray-300 rounded px-3 py-2 bg-gray-200 dark:bg-gray-300 text-gray-900 dark:text-white">{step.requiredPPE}</p>
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Risk Ranking</label>
                            <p className="border border-gray-300 rounded px-3 py-2 bg-gray-200 dark:bg-gray-300 text-gray-900 dark:text-white">{step.riskRanking}</p>
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notes</label>
                            <textarea
                              value={formData.notes[index]?.note || ""}
                              onChange={(e) => {
                                const newNotes = [...formData.notes];
                                newNotes[index] = { ...newNotes[index], note: e.target.value };
                                setFormData({ ...formData, notes: newNotes });
                              }}
                              className="w-full border border-gray-400 dark:border-gray-200 rounded px-3 py-2 text-gray-900 dark:text-white"
                              placeholder="Enter notes"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="hidden duration-700 ease-in-out" data-carousel-item>
                    <div className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 p-6 bg-white dark:bg-gray-100 border border-gray-300 rounded-lg min-h-[550px]">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Step 6</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Task / Step</label>
                          <input
                            type="text"
                            value={formData.lastRow.task}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastRow: { ...formData.lastRow, task: e.target.value },
                              })
                            }
                            className="w-full border border-gray-400 dark:border-gray-200 rounded px-3 py-2 text-gray-900 dark:text-white"
                            placeholder="Enter task"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Potential Hazards</label>
                          <input
                            type="text"
                            value={formData.lastRow.safetyHazards}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastRow: { ...formData.lastRow, safetyHazards: e.target.value },
                              })
                            }
                            className="w-full border border-gray-400 dark:border-gray-200 rounded px-3 py-2 text-gray-900 dark:text-white"
                            placeholder="Enter hazards"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hazard Controls</label>
                          <input
                            type="text"
                            value={formData.lastRow.identifiedHazards}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastRow: { ...formData.lastRow, identifiedHazards: e.target.value },
                              })
                            }
                            className="w-full border border-gray-400 dark:border-gray-200 rounded px-3 py-2 text-gray-900 dark:text-white"
                            placeholder="Enter controls"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Required PPE</label>
                          <input
                            type="text"
                            value={formData.lastRow.ppe}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastRow: { ...formData.lastRow, ppe: e.target.value },
                              })
                            }
                            className="w-full border border-gray-400 dark:border-gray-200 rounded px-3 py-2 text-gray-900 dark:text-white"
                            placeholder="Enter PPE"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Risk Ranking</label>
                          <input
                            type="text"
                            value={formData.lastRow.riskRanking}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastRow: { ...formData.lastRow, riskRanking: e.target.value },
                              })
                            }
                            className="w-full border border-gray-400 dark:border-gray-200 rounded px-3 py-2 text-gray-900 dark:text-white"
                            placeholder="Enter risk ranking"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notes</label>
                          <input
                            type="text"
                            value={formData.lastRow.notes}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastRow: { ...formData.lastRow, notes: e.target.value },
                              })
                            }
                            className="w-full border border-gray-400 dark:border-gray-200 rounded px-3 py-2 text-gray-900 dark:text-white"
                            placeholder="Enter notes"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse bottom-8 left-1/2">
                  {[...jobSafetyAnalysis, { stepNo: 6 }].map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-gold-200' : 'bg-gray-400'}`}
                      aria-current={index === 0 ? "true" : "false"}
                      aria-label={`Slide ${index + 1}`}
                      data-carousel-slide-to={index}
                    ></button>
                  ))}
                </div>
                <button type="button" className="absolute top-0 start-2 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gold-200 dark:bg-gray-800 group-hover:bg-gold-100 dark:group-hover:bg-gray-700 group-focus:ring-4 group-focus:ring-gold-100 dark:group-focus:ring-gray-700 group-focus:outline-none">
                    <svg className="w-4 h-4 text-gray-100 dark:text-gray-100 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                    </svg>
                    <span className="sr-only">Previous</span>
                  </span>
                </button>
                <button type="button" className="absolute top-0 end-2 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gold-200 dark:bg-gray-800 group-hover:bg-gold-100 dark:group-hover:bg-gray-700 group-focus:ring-4 group-focus:ring-gold-100 dark:group-focus:ring-gray-700 group-focus:outline-none">
                    <svg className="w-4 h-4 text-gray-100 dark:text-gray-100 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span className="sr-only">Next</span>
                  </span>
                </button>
              </div>

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
                          type="button"
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
      
                <button
                  type='button'
                  onClick={addPersonnel}
                  className="text-gray-100 px-4 py-2 rounded-md bg-gold-200 hover:bg-gold-100 mt-2"
                >
                  + Add New Person
                </button>
              </div>
      
              <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700"/>
              
              <div className="flex flex-col items-center justify-center gap-2 mb-8">
                <button
                  type="submit"
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
  );
    
      
}

export default NewForm