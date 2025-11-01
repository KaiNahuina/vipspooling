"use client";
import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from "dayjs";
import { generateClient } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import type { AwsCredentialIdentity } from '@aws-sdk/types';
import { useRouter } from 'next/navigation';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getTemplate } from '@/utils/template';
import DOMPurify from "dompurify";
import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';



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


const ddbClient = new DynamoDBClient({
    region: 'us-east-1',
    credentials: getCredentials,
  });


const sanitizeInput = (value: string): string => {
  return DOMPurify.sanitize(value, { USE_PROFILES: { html: true } });
};


// Define types for form data
interface Rate {
  description: string;
  quantity: string;
  rate: string;
  total: number;
}

interface Consumable {
  item: string;
  qty: string;
  rate: string;
  amount: number;
}

interface FormData {
  workTicketNo: string;
  date: string;
  spooler: string;
  cableCompany: string;
  cableCompanyLocation: string;
  oilCompany: string;
  wellNumber: string;
  wellName: string;
  workType: string;
  reelNumber: string;
  cableLength: string;
  cableType: string;
  extraCharges: string;
  notes: string;
  signature: string;
  rates: Rate[];
  consumables: Consumable[];
}

type JobTypeCheckboxes = {
  Install: boolean;
  Pull: boolean;
  GasLift: boolean;
  CTSpooler: boolean;
  ComboSpooler: boolean;
  GasInstall: boolean;
  CableSpooler: boolean;
  TechnicianLaydown: boolean;
};

const fillAndUploadPDF = async (
  formData: FormData,
  selectedDate: Dayjs | null,
  jobTypeCheckboxes: JobTypeCheckboxes,
) => {
  console.log('Starting PDF generation...');

  let pdfDoc: PDFDocument;
  try {
    
    
    const templateBytes = await getTemplate('InvoiceForm.pdf');
    pdfDoc = await PDFDocument.load(templateBytes);
    console.log('Loaded InvoiceForm.pdf template.');

  } catch (error) {
    console.warn('Could not load invoice-template.pdf, creating a blank A4 page instead.', error);
    pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([595, 842]); // A4 size in points (72 DPI)
  }

  let page = pdfDoc.getPage(0);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 10;
  const textColor = rgb(0, 0, 0);

  const sanitizedFormData = {
    workTicketNo: sanitizeInput(formData.workTicketNo),
    spooler: sanitizeInput(formData.spooler),
    workType: sanitizeInput(formData.workType),
    cableCompany: sanitizeInput(formData.cableCompany),
    cableCompanyLocation: sanitizeInput(formData.cableCompanyLocation),
    oilCompany: sanitizeInput(formData.oilCompany),
    wellNumber: sanitizeInput(formData.wellNumber),
    wellName: sanitizeInput(formData.wellName),
    reelNumber: sanitizeInput(formData.reelNumber),
    cableType: sanitizeInput(formData.cableType),
    notes: sanitizeInput(formData.notes),
  };

  // Work Information 
  page.drawText(sanitizedFormData.workTicketNo || 'N/A', { x: 100, y: 825, size: fontSize, font: helveticaFont, color: textColor });
  page.drawText(selectedDate?.format('YYYY-MM-DD') || 'N/A', { x: 46.8, y: 804, size: fontSize, font: helveticaFont, color: textColor });
  page.drawText(sanitizedFormData.spooler || 'N/A', { x: 62.9, y: 779, size: fontSize, font: helveticaFont, color: textColor });
  page.drawText(sanitizedFormData.workType || 'N/A', { x: 77.5, y: 759, size: fontSize, font: helveticaFont, color: textColor });
  page.drawText(sanitizedFormData.cableCompany || 'N/A', { x: 99.8, y: 714, size: fontSize, font: helveticaFont, color: textColor });
  page.drawText(sanitizedFormData.cableCompanyLocation || 'N/A', { x: 144, y: 694, size: fontSize, font: helveticaFont, color: textColor });
  page.drawText(sanitizedFormData.oilCompany || 'N/A', { x: 84.4, y: 669, size: fontSize, font: helveticaFont, color: textColor });
  page.drawText(sanitizedFormData.wellNumber || 'N/A', { x: 402.3, y: 694, size: fontSize, font: helveticaFont, color: textColor });
  page.drawText(sanitizedFormData.wellName || 'N/A', { x: 392.3, y: 669, size: fontSize, font: helveticaFont, color: textColor });

  // Labor Costs
  const laborStartY = 627;
  const rowHeight = 18;
  formData.rates.forEach((rate: Rate, index: number) => {
    const y = laborStartY - index * rowHeight;
    page.drawText(`$${rate.rate || 0}`, { x: 144, y, size: fontSize, font: helveticaFont, color: textColor });
    page.drawText(rate.quantity || '0', { x: 317, y, size: fontSize, font: helveticaFont, color: textColor });
    page.drawText(`$${rate.total.toFixed(2)}`, { x: 490, y, size: fontSize, font: helveticaFont, color: textColor });
  });

  // Job Type Checkboxes
  const checkboxSize = 12;
  // Row 1
  if (jobTypeCheckboxes.Install) {
    page.drawText('X', { x: 52, y: 524, size: checkboxSize, font: helveticaFont, color: textColor });
  }
  if (jobTypeCheckboxes.Pull) {
    page.drawText('X', { x: 52, y: 500, size: checkboxSize, font: helveticaFont, color: textColor });
  }
  if (jobTypeCheckboxes.GasLift) {
    page.drawText('X', { x: 169, y: 526, size: checkboxSize, font: helveticaFont, color: textColor });
  }
  if (jobTypeCheckboxes.GasInstall) {
    page.drawText('X', { x: 169, y: 500, size: checkboxSize, font: helveticaFont, color: textColor });
  }
  // Row 2
  if (jobTypeCheckboxes.CTSpooler) {
    page.drawText('X', { x: 294.09, y: 526, size: checkboxSize, font: helveticaFont, color: textColor });
  }
  if (jobTypeCheckboxes.CableSpooler) {
    page.drawText('X', { x: 294.09, y: 500, size: checkboxSize, font: helveticaFont, color: textColor });
  }
  if (jobTypeCheckboxes.ComboSpooler) {
    page.drawText('X', { x: 447.67, y: 526, size: checkboxSize, font: helveticaFont, color: textColor });
  }
  if (jobTypeCheckboxes.TechnicianLaydown) {
    page.drawText('X', { x: 447.67, y: 500, size: checkboxSize, font: helveticaFont, color: textColor });
  }

  // Consumables
  let currentY = 450; 
    const consumablesRowHeight = 26;
    formData.consumables.forEach((consumable: Consumable, index: number) => {
      const sanitizedItem = sanitizeInput(consumable.item);
      page.drawText(sanitizedItem || 'N/A', { x: 52, y: currentY, size: fontSize, font: helveticaFont, color: textColor });
      page.drawText(consumable.qty || '0', { x: 260, y: currentY, size: fontSize, font: helveticaFont, color: textColor });
      page.drawText(`$${consumable.rate || 0}`, { x: 360, y: currentY, size: fontSize, font: helveticaFont, color: textColor });
      page.drawText(`$${consumable.amount.toFixed(2)}`, { x: 489, y: currentY, size: fontSize, font: helveticaFont, color: textColor });
      currentY -= consumablesRowHeight;
  });

  
if (sanitizedFormData.notes) {
    const maxWidth = 550; 
    const lineHeight = 14;
    let currentY = 150; 
    const words = sanitizedFormData.notes.split(' ');
    let line = ''; 
    const lines: string[] = [];
  
    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const width = helveticaFont.widthOfTextAtSize(testLine, fontSize);
      if (width <= maxWidth) {
        line = testLine; 
      } else {
        if (line) {
          lines.push(line);
        }
        line = word;
      }
    }
    if (line) {
      lines.push(line); 
    }
  
    
    for (const lineText of lines) {
      if (currentY < 50) { 
        page = pdfDoc.addPage([595, 842]);
        currentY = 780; 
        page.drawText('Notes (Continued)', { x: 18, y: currentY, size: 12, font: helveticaFont, color: textColor });
        currentY -= 35;
      }
      page.drawText(lineText, { x: 18, y: currentY, size: fontSize, font: helveticaFont, color: textColor });
      currentY -= lineHeight; 
    }
  }

  // Footer
  page.drawText(formData.cableLength || 'N/A', { x: 105, y: 68, size: fontSize, font: helveticaFont, color: textColor });
  page.drawText(sanitizedFormData.reelNumber || 'N/A', { x: 290, y: 68, size: fontSize, font: helveticaFont, color: textColor });
  page.drawText(sanitizedFormData.cableType || 'N/A', { x: 82, y: 47, size: fontSize, font: helveticaFont, color: textColor });
  page.drawText(`$${formData.extraCharges || 0}`, { x: 290, y: 47, size: fontSize, font: helveticaFont, color: textColor });

  // Invoice Total
  const total = 1310.00;
  page.drawText(`$${total}`, { x: 90, y: 30, size: fontSize, font: helveticaFont, color: textColor });

  // Customer Signature
  if (formData.signature) {
    try {
      console.log('Embedding signature image (PNG)...');
      const startEmbed = Date.now();

      // Validate base64 string
      if (!formData.signature.startsWith('data:image/png;base64,')) {
        throw new Error('Invalid signature format: Not a PNG base64 string');
      }

      // Remove data URL prefix and decode base64
      const base64Data = formData.signature.replace(/^data:image\/png;base64,/, '');
      if (!base64Data) {
        throw new Error('Signature is empty or invalid');
      }

      // Convert base64 to binary
      const imgBuffer = Buffer.from(base64Data, 'base64');

      // Embed PNG directly
      const signatureImage = await pdfDoc.embedPng(imgBuffer);
      console.log(`Signature embedded in ${Date.now() - startEmbed}ms.`);

      // Draw the signature
      page.drawImage(signatureImage, { x: 410, y: 40, width: 80, height: 40 });
      console.log('Signature drawn on page.');
    } catch (error) {
      console.error('Error embedding signature (skipping signature):', error);
    }
  }


  // Save and upload to S3
  const pdfBytes = await pdfDoc.save();
  const fileName = `invoice-${formData.workTicketNo || 'Unknown'}-${Date.now()}.pdf`;
  const params = {
    Bucket: 'vip-completed-invoices',
    Key: fileName,
    Body: pdfBytes,
    ContentType: 'application/pdf',
  };
  await s3Client.send(new PutObjectCommand(params));
  return `s3://${params.Bucket}/${params.Key}`;
};

const NewForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    workTicketNo: "",
    date: "",
    spooler: "",
    cableCompany: "",
    cableCompanyLocation: "",
    oilCompany: "",
    wellNumber: "",
    wellName: "",
    workType: "",
    reelNumber: "",
    cableLength: "",
    cableType: "",
    extraCharges: "",
    notes: "",
    signature: "",
    rates: [
      { description: "Load/Unload", quantity: '', rate: '', total: 0 },
      { description: "Spooler Miles To", quantity: '', rate: '', total: 0 },
      { description: "Travel Time", quantity: '', rate: '', total: 0 },
      { description: "Standby Time", quantity: '', rate: '', total: 0 },
      { description: "Spooler Labor", quantity: '', rate: '', total: 0 },
    ],
    consumables: [{ item: "", qty: '', rate: '', amount: 0 }],
  });

  const [jobTypeCheckboxes, setJobTypeCheckboxes] = useState<JobTypeCheckboxes>({
    Install: false,
    Pull: false,
    GasLift: false,
    CTSpooler: false,
    ComboSpooler: false,
    GasInstall: false,
    CableSpooler: false,
    TechnicianLaydown: false
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingWorkTicket, setIsLoadingWorkTicket] = useState(false);
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const hasFetchedWorkTicket = useRef(false); // Rate limiting flag


  // Fetch WorkTicketID from Lambda
 useEffect(() => {
    if (hasFetchedWorkTicket.current) return; // Prevent multiple invocations
    hasFetchedWorkTicket.current = true;

    const fetchWorkTicketID = async () => {
      setIsLoadingWorkTicket(true);
      setApiError(null);
      try {
        const command = new InvokeCommand({
          FunctionName: "GenerateWorkTicketID-Invoices",
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
          bodyPayload = payload; // Fallback to payload if no body field
        }

        if (response.StatusCode === 200 && bodyPayload.workTicketID) {
          setFormData((prev) => ({ ...prev, workTicketNo: bodyPayload.workTicketID }));
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

  const handleConsumableChange = (index: number, field: keyof Consumable, value: string) => {
    const updatedConsumables = [...formData.consumables];
    updatedConsumables[index][field] = sanitizeInput(value) as never;

    if (field === "qty" || field === "rate") {
      const qty = Number(updatedConsumables[index].qty) || 0;
      const rate = Number(updatedConsumables[index].rate) || 0;
      updatedConsumables[index].amount = qty * rate;
    }

    setFormData({ ...formData, consumables: updatedConsumables });
  };

  const addConsumable = () => {
    setFormData({
      ...formData,
      consumables: [...formData.consumables, { item: "", qty: '', rate: '', amount: 0 }],
    });
  };

  const removeConsumable = (index: number) => {
    const updatedConsumables = formData.consumables.filter((_, i) => i !== index);
    setFormData({ ...formData, consumables: updatedConsumables });
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const textFields = [
      "spooler",
      "workType",
      "cableCompany",
      "cableCompanyLocation",
      "oilCompany",
      "wellNumber",
      "wellName",
      "reelNumber",
      "cableType",
      "notes",
    ];
    const sanitizedValue = textFields.includes(id) ? sanitizeInput(value) : value;
    setFormData(prev => ({
      ...prev,
      [id]: sanitizedValue
    }));
  };

  const handleRateChange = (index: number, field: 'rate' | 'quantity', value: string) => {
    const updatedRates = [...formData.rates];
    updatedRates[index] = {
      ...updatedRates[index],
      [field]: value
    };

    const qty = Number(updatedRates[index].quantity) || 0;
    const rate = Number(updatedRates[index].rate) || 0;
    updatedRates[index].total = qty * rate;

    setFormData(prev => ({
      ...prev,
      rates: updatedRates
    }));
  };

  const openSignatureModal = () => {
    setIsModalOpen(true);
  };

  const saveSignature = () => {
    if (sigCanvas.current !== null) {
      const signatureImage = sigCanvas.current.toDataURL("image/png");
      setFormData({
        ...formData,
        signature: signatureImage
      });
      setIsModalOpen(false);
    }
  };

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const handleCheckboxChange = (checkboxId: keyof JobTypeCheckboxes) => {
    setJobTypeCheckboxes(prev => ({
      ...prev,
      [checkboxId]: !prev[checkboxId]
    }));
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.workTicketNo) newErrors.push("Work Ticket # is required.");
    if (!selectedDate) newErrors.push("Date is required.");
    if (!formData.spooler) newErrors.push("Spooler Name is required.");
    if (!formData.workType) newErrors.push("Work Type is required.");
    if (!formData.cableCompany) newErrors.push("Cable Company is required.");
    if (!formData.cableCompanyLocation) newErrors.push("Cable Company Location is required.");
    if (!formData.oilCompany) newErrors.push("Oil Company is required.");
    if (!formData.wellName) newErrors.push("Well Name is required.");
    if (!formData.wellNumber) newErrors.push("Well Number is required.");
    if (!formData.reelNumber) newErrors.push("Reel Number is required.");
    if (!formData.signature) newErrors.push("Customer Signature is required.");

    // Validate JobType (at least one must be selected)
    const jobTypes = Object.keys(jobTypeCheckboxes).filter(key => jobTypeCheckboxes[key as keyof JobTypeCheckboxes]);
    if (jobTypes.length === 0) newErrors.push("At least one Job Type must be selected.");

    // Validate LaborCosts (at least one must have qty and rate)
    const validLaborCosts = formData.rates.some(rate => Number(rate.quantity) > 0 && Number(rate.rate) > 0);
    if (!validLaborCosts) newErrors.push("At least one Labor Cost must have a valid quantity and rate.");

    // Validate Consumables (at least one must have item, qty, and rate)
    const validConsumables = formData.consumables.some(c => c.item && Number(c.qty) > 0 && Number(c.rate) > 0);
    if (!validConsumables) newErrors.push("At least one Consumable must have an item, quantity, and rate.");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      if (!formData.signature) {
        alert('Please add a signature before submitting.');
        return;
      }

      const s3Url = await fillAndUploadPDF(formData, selectedDate, jobTypeCheckboxes);
      console.log('Final product uploaded to S3:', s3Url);

      const jobTypes = Object.keys(jobTypeCheckboxes).filter(key => jobTypeCheckboxes[key as keyof JobTypeCheckboxes]);

      // Ensure LaborCosts has at least one valid entry
      let laborCosts = formData.rates.map((rate: Rate) => ({
        rate: Number(rate.rate) || 0,
        qty: Number(rate.quantity) || 0,
        amount: rate.total,
      })).filter(lc => lc.qty > 0 && lc.rate > 0);
      if (laborCosts.length === 0) {
        laborCosts = [{ rate: 0, qty: 1, amount: 0 }]; // Default if none valid
      }

      // Ensure Consumables has at least one valid entry
      let consumables = formData.consumables.map((consumable: Consumable) => ({
        item: sanitizeInput(consumable.item) || "None",
        qty: Number(consumable.qty) || 0,
        rate: Number(consumable.rate) || 0,
        amount: consumable.amount,
      })).filter(c => c.item && c.qty > 0 && c.rate > 0);
      if (consumables.length === 0) {
        consumables = [{ item: "None", qty: 1, rate: 0, amount: 0 }]; // Default if none valid
      }

      // Ensure JobType has at least one entry
      if (jobTypes.length === 0) {
        jobTypes.push("None");
      }

      const invoiceData = {
        WorkTicketID: formData.workTicketNo,
        InvoiceDate: selectedDate?.format('YYYY-MM-DD') || new Date().toISOString().split('T')[0],
        Spooler: sanitizeInput(formData.spooler),
        WorkType: sanitizeInput(formData.workType),
        CableCompany: sanitizeInput(formData.cableCompany),
        CableCompanyLocation: sanitizeInput(formData.cableCompanyLocation),
        OilCompany: sanitizeInput(formData.oilCompany),
        WellName:sanitizeInput(formData.wellName),
        WellNumber: sanitizeInput(formData.wellNumber),
        ReelNumber: sanitizeInput(formData.reelNumber),
        ExtraCharges: Number(formData.extraCharges) || 0,
        Notes: sanitizeInput(formData.notes) || "",
        CustomerSignature: formData.signature,
        FinalProductFile:s3Url,
        InvoiceTotal: formData.rates.reduce((sum: number, rate: Rate) => sum + rate.total, 0) +
                      formData.consumables.reduce((sum: number, consumable: Consumable) => sum + consumable.amount, 0) +
                      Number(formData.extraCharges || 0),
        LaborCosts: laborCosts,
        Consumables: consumables,
        CableDetails:{
          CableType: sanitizeInput(formData.cableType) || "",
          CableLength: Number(formData.cableLength) || 0
        },
        JobType: jobTypes,
        _version: 1,
        _deleted: false,
        _lastChangedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Submitting form data:', invoiceData);

      const command = new PutItemCommand({
        TableName: "InvoiceForm-ghr672m57fd2re7tckfmfby2e4-dev",
        Item: marshall(invoiceData),
      })
      await ddbClient.send(command);

      console.log('Response:', Response);

      
        setFormData({
          workTicketNo: "",
          date: "",
          spooler: "",
          cableCompany: "",
          cableCompanyLocation: "",
          oilCompany: "",
          wellNumber: "",
          wellName: "",
          workType: "",
          reelNumber: "",
          cableLength: "",
          cableType: "",
          extraCharges: "",
          notes: "",
          signature: "",
          rates: [
            { description: "Load/Unload", quantity: '', rate: '', total: 0 },
            { description: "Spooler Miles To", quantity: '', rate: '', total: 0 },
            { description: "Travel Time", quantity: '', rate: '', total: 0 },
            { description: "Standby Time", quantity: '', rate: '', total: 0 },
            { description: "Spooler Labor", quantity: '', rate: '', total: 0 },
          ],
          consumables: [{ item: "", qty: '', rate: '', amount: 0 }],
        });
        setSelectedDate(null);
        sigCanvas.current?.clear();

        setJobTypeCheckboxes({
          Install: false,
          Pull: false,
          GasLift: false,
          CTSpooler: false,
          ComboSpooler: false,
          GasInstall: false,
          CableSpooler: false,
          TechnicianLaydown: false
        });

        alert('Invoice form submitted successfully to: ' + s3Url);
      
    } catch (error) {
      console.error('Error submitting invoice:', error);
      alert('Error submitting invoice. Please try again.');
    }
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="flex items-start gap-8">
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
          
          <div className="flex-1">
            <div className="w-full flex flex-col items-center bg-white dark:bg-gray-100 px-4 py-10 rounded-[5px]">
              <div className="flex flex-col items-center justify-center gap-2 mb-8">
                <h1 className='text-black text-3xl dark:text-white'>
                  New Invoice form
                </h1>
              </div>

              {errors.length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                  <ul>
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form className="w-full" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                  <div className="mb-2">
                    <label htmlFor="workTicketNo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Work Ticket #</label>
                    <input
                      type="text"
                      id="workTicketNo"
                      value={formData.workTicketNo}
                      readOnly
                      placeholder={
                        isLoadingWorkTicket
                          ? "Generating Work Ticket #..."
                          : "Work Ticket #"
                      }
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
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

                  
                  <div>
                    <label htmlFor="spooler" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Spooler First and Last Name</label>
                    <input
                      type="text"
                      id="spooler"
                      value={formData.spooler}
                      onChange={handleInputChange}
                      placeholder="Spooler Name"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="workType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Work Type</label>
                    <input
                      type="text"
                      id="workType"
                      value={formData.workType}
                      onChange={handleInputChange}
                      placeholder="Work Type"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                </div>

                <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700"/>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                  <div className="mb-2">
                    <label htmlFor="cableCompany" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cable Company</label>
                    <input
                      type="text"
                      id="cableCompany"
                      value={formData.cableCompany}
                      onChange={handleInputChange}
                      placeholder="Cable Company"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="cableCompanyLocation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cable Company Location</label>
                    <input
                      type="text"
                      id="cableCompanyLocation"
                      value={formData.cableCompanyLocation}
                      onChange={handleInputChange}
                      placeholder="Cable Company Location"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="oilCompany" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Oil Company</label>
                    <input
                      type="text"
                      id="oilCompany"
                      value={formData.oilCompany}
                      onChange={handleInputChange}
                      placeholder="Oil Company"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="wellNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Well Number</label>
                    <input
                      type="text"
                      id="wellNumber"
                      value={formData.wellNumber}
                      onChange={handleInputChange}
                      placeholder="Well Number"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="wellName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Well Name</label>
                    <input
                      type="text"
                      id="wellName"
                      value={formData.wellName}
                      onChange={handleInputChange}
                      placeholder="Well Name"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                </div>

                <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700"/>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8">
                  <div>
                    <label htmlFor="loadunload" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Load/Unload</label>
                    <input
                      type="number"
                      id="loadunload"
                      value={formData.rates[0].rate}
                      onChange={(e) => handleRateChange(0, 'rate', e.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="loadhours" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hours</label>
                    <input
                      type="number"
                      id="loadhours"
                      value={formData.rates[0].quantity}
                      onChange={(e) => handleRateChange(0, 'quantity', e.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="loadtotal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total</label>
                    <input
                      type="text"
                      id="loadtotal"
                      value={formData.rates[0].total.toFixed(2)}
                      readOnly
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="milesTo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Spooler Miles To</label>
                    <input
                      type="number"
                      id="milesTo"
                      value={formData.rates[1].rate}
                      onChange={(e) => handleRateChange(1, 'rate', e.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="cableCompanyLocation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Miles</label>
                    <input
                      type="number"
                      id="spoolermiles"
                      value={formData.rates[1].quantity}
                      onChange={(e) => handleRateChange(1, 'quantity', e.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="milestotal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total</label>
                    <input
                      type="number"
                      id="milestotal"
                      value={formData.rates[1].total.toFixed(2)}
                      readOnly
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="traveltime" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Travel Time</label>
                    <input
                      type="number"
                      id="traveltime"
                      value={formData.rates[2].rate}
                      onChange={(e) => handleRateChange(2, 'rate', e.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="travelhours" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hours</label>
                    <input
                      type="number"
                      id="travelhours"
                      value={formData.rates[2].quantity}
                      onChange={(e) => handleRateChange(2, 'quantity', e.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="traveltotal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total</label>
                    <input
                      type="number"
                      id="traveltotal"
                      value={formData.rates[2].total.toFixed(2)}
                      readOnly
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="standbytime" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Standby Time</label>
                    <input
                      type="number"
                      id="standbytime"
                      value={formData.rates[3].rate}
                      onChange={(e) => handleRateChange(3, 'rate', e.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="standbyhours" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hours</label>
                    <input
                      type="number"
                      id="standbyhours"
                      value={formData.rates[3].quantity}
                      onChange={(e) => handleRateChange(3, 'quantity', e.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="standbytotal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total</label>
                    <input
                      type="number"
                      id="standbytotal"
                      value={formData.rates[3].total.toFixed(2)}
                      readOnly
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="spoolerlabor" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Spooler Labor</label>
                    <input
                      type="number"
                      id="spoolerlabor"
                      value={formData.rates[4].rate}
                      onChange={(e) => handleRateChange(4, 'rate', e.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="laborhours" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hours</label>
                    <input
                      type="number"
                      id="laborhours"
                      value={formData.rates[4].quantity}
                      onChange={(e) => handleRateChange(4, 'quantity', e.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="labortotal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total</label>
                    <input
                      type="number"
                      id="labortotal"
                      value={formData.rates[4].total.toFixed(2)}
                      readOnly
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                </div>

                <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700"/>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-8">
                  {[
                    { id: "Install", label: "Install" },
                    { id: "Pull", label: "Pull" },
                    { id: "GasLift", label: "Gas Lift" },
                    { id: "CTSpooler", label: "CT Spooler" },
                    { id: "ComboSpooler", label: "Combo Spooler" },
                    { id: "GasInstall", label: "Gas Install" },
                    { id: "CableSpooler", label: "Cable Spooler" },
                    { id: "TechnicianLaydown", label: "Technician Laydown" },
                  ].map(({ id, label }) => (
                    <div key={id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={id}
                        checked={jobTypeCheckboxes[id as keyof JobTypeCheckboxes]}
                        onChange={() => handleCheckboxChange(id as keyof JobTypeCheckboxes)}
                        className="border rounded-lg text-sm outline-none dark:border-gray-200 dark:bg-gray-10"
                      />
                      <label htmlFor={id} className="text-sm font-medium text-gray-900 dark:text-white">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>

                <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700"/>

                <div className="mb-8">
                  <div className="grid grid-cols-4 gap-4 font-medium bg-gray-300 p-2 rounded-md mb-2">
                    <span>Consumables</span>
                    <span>Quantity</span>
                    <span>Rate ($)</span>
                    <span>Total ($)</span>
                  </div>
                  {formData.consumables.map((consumable: Consumable, index: number) => (
                    <div key={index} className="grid grid-cols-4 gap-4 mt-2 items-center">
                      <input
                        type="text"
                        value={consumable.item}
                        onChange={(e) => handleConsumableChange(index, "item", e.target.value)}
                        placeholder="Consumable"
                        className="border p-2 rounded-md dark:bg-transparent text-black dark:text-white"
                      />
                      <input
                        type="number"
                        value={consumable.qty}
                        onChange={(e) => handleConsumableChange(index, "qty", e.target.value)}
                        placeholder="Qty"
                        className="border p-2 rounded-md w-16 dark:bg-transparent text-black dark:text-white"
                      />
                      <input
                        type="number"
                        value={consumable.rate}
                        onChange={(e) => handleConsumableChange(index, "rate", e.target.value)}
                        placeholder="Rate"
                        className="border p-2 rounded-md w-20 dark:bg-transparent text-black dark:text-white"
                      />
                      <div className="flex justify-between items-center">
                        <span className="p-2">{consumable.amount.toFixed(2)}</span>
                        {formData.consumables.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeConsumable(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addConsumable}
                    className="text-gray-100 px-4 py-2 rounded-md bg-gold-200 hover:bg-gold-100 mt-2"
                  >
                    + Add Consumable
                  </button>
                </div>

                <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700"/>

                <div className="mb-8">
                  <label htmlFor="notes" className="block mb-2 text-md font-medium text-black dark:text-white">Notes</label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="border-2 border-gray-10 rounded-md w-full"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                  <div>
                    <label htmlFor="cableLength" className="block mb-2 text-sm font-medium text-black dark:text-white">Cable Length</label>
                    <input
                      type="number"
                      id="cableLength"
                      value={formData.cableLength}
                      onChange={handleInputChange}
                      placeholder="Cable Length(ft)"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="reelNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Reel Number</label>
                    <input
                      type="text"
                      id="reelNumber"
                      value={formData.reelNumber}
                      onChange={handleInputChange}
                      placeholder="Reel Number"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="cableType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cable Type</label>
                    <input
                      type="text"
                      id="cableType"
                      value={formData.cableType}
                      onChange={handleInputChange}
                      placeholder="Cable Type"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="extraCharges" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Extra Charges</label>
                    <input
                      type="number"
                      id="extraCharges"
                      value={formData.extraCharges}
                      onChange={handleInputChange}
                      placeholder="Extra Charges"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div>
                    <label htmlFor="invoiceTotal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Invoice Total</label>
                    <input
                      type="number"
                      id="invoiceTotal"
                      value={formData.rates.reduce((sum: number, rate: Rate) => sum + rate.total, 0) +
                            formData.consumables.reduce((sum: number, consumable: Consumable) => sum + consumable.amount, 0) +
                            Number(formData.extraCharges)}
                      readOnly
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                    />
                  </div>
                  <div className="flex justify-end items-center">
                    {formData.signature ? (
                      <img
                        src={formData.signature}
                        alt="Signature"
                        className="w-20 h-10 border border-gray-400 rounded-md cursor-pointer"
                        onClick={() => openSignatureModal()}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => openSignatureModal()}
                        className="border px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-800 text-black dark:text-white"
                      >
                        Click to Sign
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
                          <button type="button" onClick={clearSignature} className="px-4 py-2 bg-red-500 text-white rounded">Clear</button>
                          <button type="button" onClick={saveSignature} className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
                          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded">Close</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

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
      </div>
    </>
  );
};

export default NewForm;