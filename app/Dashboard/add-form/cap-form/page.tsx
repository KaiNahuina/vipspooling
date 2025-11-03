"use client";
import React, { useState, useRef, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { generateClient } from 'aws-amplify/api';
import { useRouter } from 'next/navigation';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getTemplate } from '@/utils/template';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import type { AwsCredentialIdentity } from '@aws-sdk/types';
import { fetchAuthSession } from 'aws-amplify/auth';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import DOMPurify from 'dompurify';
import heic2any from 'heic2any';
import { DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

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
  region: 'us-east-1',
  credentials: getCredentials,
});

const ddbClient = new DynamoDBClient({
  region: 'us-east-1',
  credentials: getCredentials,
});

const sanitizeInput = (value: string): string => {
  return DOMPurify.sanitize(value, { USE_PROFILES: { html: true } });
};


interface CapFormData {
  WorkTicketID: string;
  SubmissionDate: string;
  Date: string;
  TechnicianName: string;
  Customer: string;
  WellName: string;
  TypeOfJob: string;
  VisualConfirmation: string;
  IntervalPumping: string;
  PressureWhilePumping: string;
  PressureBleed: string;
  CapillaryFlush: string;
  ManifoldStatus: string;
  LineTest: string;
  CapillarySize: string;
  Metallurgy: string;
  Length: string;
  FluidPumped: string;
  TotalGallons: string;
  Notes: string;
  FinalProductFile: string;
  images: string[];
}

const fillAndUploadPDF = async (formData: CapFormData, date: Dayjs | null) => {
  console.log('Starting PDF generation...');

  let pdfDoc: PDFDocument;
  try {
    const templateBytes = await getTemplate('CapillaryReportForm.pdf');
    pdfDoc = await PDFDocument.load(templateBytes);
    console.log('Loaded CapillaryForm.pdf template.');
  } catch (error) {
    console.warn('Could not load CapillaryForm.pdf, creating a blank A4 page instead.', error);
    pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([595, 842]);
  }

  let page = pdfDoc.getPage(0);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 13;
  const textColor = rgb(0, 0, 0);

  page.drawText(sanitizeInput(formData.SubmissionDate) || 'N/A', {
    x: 68,
    y: 748,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
  });

  page.drawText(sanitizeInput(formData.Date) || 'N/A', {
    x: 320,
    y: 748,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
  });

  page.drawText(sanitizeInput(formData.TechnicianName) || 'N/A', {
    x: 68,
    y: 695,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
  });

  page.drawText(sanitizeInput(formData.Customer) || 'N/A', {
    x: 320,
    y: 695,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
  });

  page.drawText(sanitizeInput(formData.WellName) || 'N/A', {
    x: 68,
    y: 642,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
  });

  page.drawText(sanitizeInput(formData.TypeOfJob) || 'N/A', {
    x: 320,
    y: 642,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
  });

  page.drawText(sanitizeInput(formData.VisualConfirmation) || 'N/A', {
    x: 68,
    y: 585,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
  });

  page.drawText(sanitizeInput(formData.IntervalPumping) || 'N/A', {
    x: 68,
    y: 530,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
  });

  page.drawText(sanitizeInput(formData.PressureWhilePumping) || 'N/A', {
    x: 68,
    y: 477,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
  });

  page.drawText(sanitizeInput(formData.PressureBleed) || 'N/A',{
    x: 68,
    y: 422,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
  });

  page.drawText(
    sanitizeInput(formData.CapillaryFlush) || 'N/A',
    {
      x: 68,
      y: 362,
      size: fontSize,
      font: helveticaFont,
      color: textColor,
    }
  );

  page.drawText(sanitizeInput(formData.ManifoldStatus) || 'N/A', {
    x: 68,
    y: 304,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
  });

  page.drawText(sanitizeInput(formData.LineTest) || 'N/A', {
    x: 68,
    y: 248,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
  });

  page.drawText(sanitizeInput(formData.CapillarySize) || 'N/A', {
    x: 318,
    y: 247,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
  });

  page.drawText(formData.Metallurgy.toString(), {
    x: 68,
    y: 191,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
  });

  page.drawText(formData.Length.toString(), {
    x: 318,
    y: 190,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
  });

  page.drawText(sanitizeInput(formData.FluidPumped) || 'N/A', {
    x: 68,
    y: 132,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
  });

  page.drawText(formData.TotalGallons.toString(), {
    x: 318,
    y: 131,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
  });

  page.drawText(sanitizeInput(formData.Notes) || 'N/A', {
    x: 68,
    y: 72,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
  });

  if(formData.images && formData.images.length > 0){
    const imagePage = pdfDoc.addPage([595, 842]);

    imagePage.drawText('Uploaded Images', {
        x: 68,
        y: 810,
        size: 20,
        font: helveticaFont,
        color: textColor,
      });

    let currentY = 750;
    const imageWidth = 200;
    const imageHeight = 150;
    const margin = 50;

    for(const image of formData.images){
      try{
        console.log('Embedding uploaded images in PDF...');
        const startEmbed = Date.now();

        let embeddedImage;
        if (image.startsWith('data:image/png;base64,')){
          const base64Data = image.replace(/^data:image\/png;base64,/, '');
          const imgBuffer = Buffer.from(base64Data, 'base64');
          embeddedImage = await pdfDoc.embedPng(imgBuffer);
        }else if(image.startsWith('data:image/jpeg;base64,') || image.startsWith('data:image/jpg;base64,')){
          const base64Data = image.replace(/^data:image\/(jpeg|jpg);base64,/, '');
          const imgBuffer = Buffer.from(base64Data, 'base64');
          embeddedImage = await pdfDoc.embedJpg(imgBuffer);
        }else if(image.startsWith('data:image/;base64,') || image.startsWith('data:image/jpg;base64,')){
          const base64Data = image.replace(/^data:image\/(jpeg|jpg);base64,/, '');
          const imgBuffer = Buffer.from(base64Data, 'base64');
          embeddedImage = await pdfDoc.embedJpg(imgBuffer);
        }else{
          throw new Error('Unsupported image format: Only PNG and JPEG are supported');
        }

        imagePage.drawImage(embeddedImage, {
          x:margin,
          y:currentY,
          width: imageWidth,
          height: imageHeight,
        });
        console.log(`Image Embedded in ${Date.now() - startEmbed}ms.`);

        currentY -= imageHeight + 20;

        if(currentY < 50) {
          const newPage = pdfDoc.addPage([595, 842]);
          newPage.drawText('Uploaded Images', {
            x: 68,
            y: 650,
            size: fontSize,
            font: helveticaFont,
            color: textColor,
          });
          currentY = 610;
          page = newPage;
        }

      }catch(error){
        console.error('Error embedding image (skipping image embed):', error);
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  const fileName = `${formData.WorkTicketID || 'Unknown'}.pdf`;
  const params = {
    Bucket: 'vip-completed-capillary',
    Key: fileName,
    Body: pdfBytes,
    ContentType: 'application/pdf',
  };
  await s3Client.send(new PutObjectCommand(params));
  return `s3://${params.Bucket}/${params.Key}`;
};

const CapillaryForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<CapFormData>({
    WorkTicketID: '',
    SubmissionDate: '',
    Date: '',
    TechnicianName: '',
    Customer: '',
    WellName: '',
    TypeOfJob: '',
    VisualConfirmation: '',
    IntervalPumping: '',
    PressureWhilePumping: '',
    PressureBleed: '',
    CapillaryFlush: '',
    ManifoldStatus: '',
    LineTest: '',
    CapillarySize: '',
    Metallurgy: '',
    Length: '',
    FluidPumped: '',
    TotalGallons: '',
    Notes: '',
    FinalProductFile: '',
    images: [],
  });

  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingWorkTicket, setIsLoadingWorkTicket] = useState(false);
  const hasFetchedWorkTicket = useRef(false);
  const [submissionDate, setSubmissionDate] = useState<Dayjs | null>(null);
  const [date, setDate] = useState<Dayjs | null>(null);

  //Generate the new work ticket
  useEffect(() => {
    if (hasFetchedWorkTicket.current) return;
    hasFetchedWorkTicket.current = true;

    const fetchWorkTicketID = async () => {
      setIsLoadingWorkTicket(true);
      setApiError(null);
      try {
        const command = new InvokeCommand({
          FunctionName: 'GenerateWorkTicketID-CapForm',
          Payload: JSON.stringify({}),
        });
        const response = await lambdaClient.send(command);

        if (!response.Payload) {
          throw new Error('Empty response from Lambda');
        }

        let payload;
        try {
          const payloadString = Buffer.from(response.Payload).toString();
          payload = JSON.parse(payloadString);
        } catch (parseError: any) {
          throw new Error(`Failed to parse Lambda response: ${parseError.message}`);
        }

        let bodyPayload;
        if (payload.body) {
          try {
            bodyPayload = JSON.parse(payload.body);
          } catch (parseError: any) {
            throw new Error(`Failed to parse body payload: ${parseError.message}`);
          }
        } else {
          bodyPayload = payload;
        }

        if (response.StatusCode === 200 && bodyPayload.workTicketID) {
          setFormData((prev) => ({ ...prev, WorkTicketID: bodyPayload.workTicketID }));
        } else {
          throw new Error('No workTicketID found in response');
        }
      } catch (error: any) {
        console.error('Error fetching WorkTicketID:', error);
        setApiError(`Failed to generate Work Ticket ID: ${error.message}`);
      } finally {
        setIsLoadingWorkTicket(false);
      }
    };

    fetchWorkTicketID();
  }, []);

  const yesNoNaOptions = ['Yes', 'No', 'Other'];

  const handleInputChange = (field: keyof CapFormData, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if(!files) return;

    const newImages: string[] = [];
    const fileReaders: Promise<void>[] = [];

    for(const file of Array.from(files)){
      if(!file.type.match('image/(png|jpeg|jpg|heic|heif)')){
        alert('Only PNG, JPEG, and HEIC images are supported.');
        continue;
      }

      if(file.type === 'image/heic' || file.type === 'image/heif'){
        try{
          const convertedBlob = (await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.8,
          })) as Blob;

          const reader = new FileReader();
          const promise = new Promise<void>((resolve) => {
            reader.onload = () =>{
              if(typeof reader.result === 'string'){
                newImages.push(reader.result);
              }
              resolve;
            };
            reader.onerror = () => {
              console.error(`Error reading HEIC file: ${file.name}`);
              resolve();
            };
          });
          reader.readAsDataURL(convertedBlob);
          fileReaders.push(promise);
        }catch(error){
          console.error(`Error converting HEIC file: ${file.name}`, error);
          alert(`Failed to process HEIC file: ${file.name}`);
        }
      }else {
        const reader = new FileReader();
        const promise = new Promise<void>((resolve) => {
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              newImages.push(reader.result);
            }
            resolve();
          };
          reader.onerror = () => {
            console.error(`Error reading file: ${file.name}`);
            resolve();
          };
        });
        reader.readAsDataURL(file);
        fileReaders.push(promise);
      }
    }
    await Promise.all(fileReaders);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };


  const handleDateChange = (newDate: Dayjs | null) => {
    setDate(newDate);
    setFormData((prev) => ({
      ...prev,
      Date: newDate?.format('YYYY-MM-DD') || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      

      // Basic validation for required fields
      const requiredFields: (keyof CapFormData)[] = [
        'WorkTicketID',
        'Date',
        'TechnicianName',
        'Customer',
        'WellName',
        'TypeOfJob',
        'VisualConfirmation',
        'IntervalPumping',
        'PressureWhilePumping',
        'ManifoldStatus',
        'LineTest',
        'CapillarySize',
        'Metallurgy',
        'Length',
        'FluidPumped',
        'TotalGallons',
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      const nowISO = new Date().toISOString();
      const submissionDate = dayjs(nowISO).format('YYYY-MM-DD');
      const pdfFormData = {...formData, SubmissionDate: submissionDate};
      const s3Url = await fillAndUploadPDF(pdfFormData, date);

      const reportData = {
        WorkTicketID: formData.WorkTicketID,
        Date: formData.Date,
        TechnicianName: sanitizeInput(formData.TechnicianName),
        Customer: sanitizeInput(formData.Customer),
        WellName: sanitizeInput(formData.WellName),
        TypeOfJob: sanitizeInput(formData.TypeOfJob),
        VisualConfirmation: sanitizeInput(formData.VisualConfirmation),
        IntervalPumping: sanitizeInput(formData.IntervalPumping),
        PressureWhilePumping: sanitizeInput(formData.PressureWhilePumping),
        PressureBleed: formData.PressureBleed,
        CapillaryFlush: formData.CapillaryFlush,
        ManifoldStatus: sanitizeInput(formData.ManifoldStatus),
        LineTest: sanitizeInput(formData.LineTest),
        CapillarySize: sanitizeInput(formData.CapillarySize),
        Metallurgy: formData.Metallurgy,
        Length: formData.Length,
        FluidPumped: sanitizeInput(formData.FluidPumped),
        TotalGallons: formData.TotalGallons,
        Notes: sanitizeInput(formData.Notes),
        FinalProductFile: s3Url,
        _version: 1,
        createdAt: nowISO,
        updatedAt: nowISO,
        _lastChangedAt: nowISO,
      };

      

      console.log('Submitting Capillary Report data:', reportData);

      await ddbClient.send(
        new PutItemCommand({
          TableName: 'CapillaryForm-ghr672m57fd2re7tckfmfby2e4-dev',
          Item: marshall(reportData),
          ConditionExpression: 'attribute_not_exists(WorkTicketID)',
          ReturnValues: 'NONE',
        })
      );

      console.log('DynamoDB Response:', Response);
      
      console.log('PDF uploaded at', s3Url);

      
      setFormData({
        WorkTicketID: '',
        SubmissionDate: '',
        Date: '',
        TechnicianName: '',
        Customer: '',
        WellName: '',
        TypeOfJob: '',
        VisualConfirmation: '',
        IntervalPumping: '',
        PressureWhilePumping: '',
        PressureBleed: '',
        CapillaryFlush: '',
        ManifoldStatus: '',
        LineTest: '',
        CapillarySize: '',
        Metallurgy: '',
        Length: '',
        FluidPumped: '',
        TotalGallons: '',
        Notes: '',
        FinalProductFile: '',
        images: [],
      });
      setDate(null);
      alert('Capillary Report submitted successfully!');

    } catch (error) {
      console.error('Error submitting Capillary Report:', error);
      alert('Error submitting Capillary Report. Please try again.');
    }
  };

  return (
    <>
      <div className="w-[80%] mx-auto px-6 py-8">
        <div className="flex items-start">
          <button
            type="button"
            onClick={() => router.push('/Dashboard/add-form')}
            className="w-16 rounded-2xl h-14 relative group mt-2 mr-4"
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

          <div className="w-full bg-white dark:bg-gray-100 px-8 py-12 rounded-lg shadow-lg">
            <div className="flex flex-col items-center justify-center gap-4 mb-10">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Capillary Report
              </h1>
            </div>

            <form className="w-full" onSubmit={handleSubmit}>
              <div className="space-y-12">
                {/* General Information Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    General Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Work Ticket ID
                      </label>
                      <input
                        type="text"
                        id="WorkTicketID"
                        value={formData.WorkTicketID}
                        readOnly
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10 bg-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Date
                      </label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={date}
                          onChange={handleDateChange}
                          sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                              height: '48px',
                              border: '1px solid #9CA3AF',
                              borderRadius: '0.5rem',
                              backgroundColor: 'transparent',
                              '&:hover': { borderColor: '#9CA3AF' },
                              '& fieldset': { border: 'none' },
                            },
                            '& .MuiInputBase-input': {
                              fontSize: '0.875rem',
                              padding: '0.75rem 1rem',
                              color: 'inherit',
                            },
                            '& .MuiSvgIcon-root': { color: 'currentColor' },
                          }}
                          slotProps={{ textField: { placeholder: 'Select Date' } }}
                        />
                      </LocalizationProvider>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Technician First and Last Name
                      </label>
                      <input
                        type="text"
                        id="TechnicianName"
                        value={formData.TechnicianName}
                        onChange={(e) => handleInputChange('TechnicianName', e.target.value)}
                        placeholder="Technician First and Last Name"
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Customer
                      </label>
                      <input
                        type="text"
                        id="Customer"
                        value={formData.Customer}
                        onChange={(e) => handleInputChange('Customer', e.target.value)}
                        placeholder="Customer"
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Well Name
                      </label>
                      <input
                        type="text"
                        id="WellName"
                        value={formData.WellName}
                        onChange={(e) => handleInputChange('WellName', e.target.value)}
                        placeholder="Well Name"
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Type of Job
                      </label>
                      <select
                        value={formData.TypeOfJob}
                        onChange={(e) => handleInputChange('TypeOfJob', e.target.value)}
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                      >
                        <option value="">Select Job Type</option>
                        <option id="Pull" value="Pull">Pull</option>
                        <option id="Install" value="Install">Install</option>
                        <option id="Other" value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />

                {/* Pumping Details Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Capillary Flush Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-[9.5px] font-medium text-gray-900 dark:text-white">
                        Visual Confirmation Fluid at BHA(Did we pump and see fluid at intake, check valve, mandrel, BHA)
                      </label>
                      <select
                        value={formData.VisualConfirmation}
                        onChange={(e) => handleInputChange('VisualConfirmation', e.target.value)}
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                      >
                        <option value="">Select Option</option>
                        {yesNoNaOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Interval Pumping throughout job
                      </label>
                      <select
                        value={formData.IntervalPumping}
                        onChange={(e) => handleInputChange('IntervalPumping', e.target.value)}
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                      >
                        <option value="">Select Option</option>
                        <option id="30min" value="30min">30 minute intervals</option>
                        <option id="1hr" value="1hr">1 Hour intervals</option>
                        <option id="other" value="other">Other</option>
                      </select>

                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Pressure While Pumping at intervals
                      </label>
                      <input
                        type="text"
                        id="PressureWhilePumping"
                        value={formData.PressureWhilePumping}
                        onChange={(e) => handleInputChange('PressureWhilePumping', e.target.value)}
                        placeholder="Pressure While Pumping"
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Did pressure bleed down when pump turned off at end of job?
                      </label>
                      <select
                        value={formData.PressureBleed}
                        onChange={(e) => handleInputChange('PressureBleed', e.target.value)}
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                      >
                        <option value="">Select Option</option>
                        {yesNoNaOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Capillary Flush Confirmation
                      </label>
                      <select
                        value={formData.CapillaryFlush}
                        onChange={(e) =>
                          handleInputChange('CapillaryFlush', e.target.value)
                        }
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                      >
                        <option value="">Select Option</option>
                        <option value="Yes-10 gal">Yes-10 gal</option>
                        <option value="Yes-15 gal">Yes-15 gal</option>
                        <option value="Yes-20 gal">Yes-20 gal</option>
                        <option value="No">No</option>
                        <option value="Other">Other</option>
                        
                      </select>
                    </div>
                    
                  </div>
                </div>

                <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />

                {/* Equipment Details Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Equipment Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Manifold Condition(Good, bad, or comment)
                      </label>
                      <input
                        type="text"
                        id="ManifoldStatus"
                        value={formData.ManifoldStatus}
                        onChange={(e) => handleInputChange('ManifoldStatus', e.target.value)}
                        placeholder="Manifold Status"
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        If pull, did the line test good?
                      </label>
                      <input
                        type="text"
                        id="LineTest"
                        value={formData.LineTest}
                        onChange={(e) => handleInputChange('LineTest', e.target.value)}
                        placeholder="Line Test"
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                      />
                      
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Capillary Size
                      </label>
                      <select
                        value={formData.CapillarySize}
                        onChange={(e) => handleInputChange('CapillarySize', e.target.value)}
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                      >
                        <option value="">Select a Size</option>
                        <option value="1/4 inch">1/4"</option>
                        <option value="3/8 inch">3/8"</option>
                        
                      </select>
                      
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Metallurgy
                      </label>
                      <select
                        value={formData.Metallurgy}
                        onChange={(e) =>
                          handleInputChange('Metallurgy', parseFloat(e.target.value) || 0)
                        }
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                      >
                        <option value="">Select Option</option>
                        <option value="825">825</option>
                        <option value="2205">2205</option>
                        
                      </select>
                      
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Length (ft)
                      </label>
                      <input
                        type="number"
                        id="Length"
                        value={formData.Length}
                        onChange={(e) => handleInputChange('Length', parseFloat(e.target.value) || 0)}
                        placeholder="Length"
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Fluid Pumped
                      </label>
                      <input
                        type="text"
                        id="FluidPumped"
                        value={formData.FluidPumped}
                        onChange={(e) => handleInputChange('FluidPumped', e.target.value)}
                        placeholder="Fluid Pumped"
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Total Gallons
                      </label>
                      <input
                        type="number"
                        id="TotalGallons"
                        value={formData.TotalGallons}
                        onChange={(e) =>
                          handleInputChange('TotalGallons', parseFloat(e.target.value) || 0)
                        }
                        placeholder="Total Gallons"
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                      />
                    </div>
                  </div>
                </div>

                <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />

                {/* Notes Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Notes</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      
                      <textarea
                        id="Notes"
                        value={formData.Notes}
                        onChange={(e) => handleInputChange('Notes', e.target.value)}
                        placeholder="Enter any additional notes"
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                        rows={6}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Upload Images
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* File Input Button */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Select Images (PNG, JPEG, or HEIC)
                      </label>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/heic,image/heif"
                        multiple
                        onChange={handleImageUpload}
                        className="border border-gray-400 rounded-lg px-4 py-3 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                      />
                    </div>
                    {/* Drag-and-Drop Area */}
                    <div>
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-white dark:bg-gray-10 hover:bg-gray-50 dark:hover:bg-gray-50 dark:border-gray-200"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPEG, or HEIC
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/heic,image/heif"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  {/* Image Previews */}
                  {formData.images.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Uploaded Images
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Uploaded image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-400"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center mt-12">
                <button
                  type="submit"
                  className="text-gray-100 px-6 py-3 rounded-md bg-gold-200 hover:bg-gold-100 text-sm font-medium"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CapillaryForm;