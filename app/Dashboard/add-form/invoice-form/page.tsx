"use client";
import React from 'react'
import {useState, useRef} from 'react'
import SignatureCanvas from 'react-signature-canvas';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { generateClient } from 'aws-amplify/api';
import { createInvoiceForm } from '@/src/graphql/mutations';
import { CreateInvoiceFormInput, LaborCostInput, ConsumableInput, CableDetailInput } from '@/src/graphql/API';
import { useRouter } from 'next/navigation';

const client = generateClient();

const NewForm = () => {
    const router = useRouter();

    {/*input default*/}
    const [formData, setFormData] = useState({
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

    const [jobTypeCheckboxes, setJobTypeCheckboxes] = useState({
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
    const sigCanvas = useRef<SignatureCanvas | null>(null);

    const handleConsumableChange = (index: number, field: keyof typeof formData.consumables[0], value: string) => {
        const updatedConsumables = [...formData.consumables];
        updatedConsumables[index][field] = value as never;
    
        // Calculate amount only if both values are numbers
        if (field === "qty" || field === "rate") {
          const qty = Number(updatedConsumables[index].qty) || 0;
          const rate = Number(updatedConsumables[index].rate) || 0;
          updatedConsumables[index].amount = qty * rate;
        }
    
        setFormData({ ...formData, consumables: updatedConsumables });
      };
    
      // Add new consumable row
      const addConsumable = () => {
        setFormData({
          ...formData,
            consumables: [...formData.consumables, { item: "", qty: '', rate: '', amount: 0 }],
        });
      };
    
      // Remove consumable row
      const removeConsumable = (index: number) => {
        const updatedConsumables = formData.consumables.filter((_, i) => i !== index);
        setFormData({ ...formData, consumables: updatedConsumables });
      };
    

      const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

      // Function to handle the date change
      const handleDateChange = (date: dayjs.Dayjs | null) => {
        setSelectedDate(date);
      };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleRateChange = (index: number, field: 'rate' | 'quantity', value: string) => {
        const updatedRates = [...formData.rates];
        updatedRates[index] = {
            ...updatedRates[index],
            [field]: value
        };
        
        // Calculate total only if both values are numbers
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
  
    // Save the signature
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
            // Check if signature exists
            if (!formData.signature) {
                alert('Please add a signature before submitting.');
                return;
            }

            // Format the form data to match the CreateInvoiceFormInput type
            const invoiceData: CreateInvoiceFormInput = {
                WorkTicketID: formData.workTicketNo,
                InvoiceDate: selectedDate?.format('YYYY-MM-DD') || new Date().toISOString(),
                Spooler: formData.spooler,
                WorkType: formData.workType,
                CableCompanyLocation: formData.cableCompanyLocation,
                OilCompany: formData.oilCompany,
                WellNumberName: formData.wellNumber,
                ReelNumber: formData.reelNumber,
                ExtraCharges: Number(formData.extraCharges) || 0,
                Notes: formData.notes || "",
                CustomerSignature: formData.signature,
                InvoiceTotal: formData.rates.reduce((sum, rate) => sum + rate.total, 0) + 
                            formData.consumables.reduce((sum, consumable) => sum + consumable.amount, 0) +
                            Number(formData.extraCharges || 0),
                LaborCosts: formData.rates.map(rate => ({
                    rate: Number(rate.rate) || 0,
                    qty: Number(rate.quantity) || 0,
                    amount: rate.total
                } as LaborCostInput)),
                Consumables: formData.consumables.map(consumable => ({
                    item: consumable.item,
                    qty: Number(consumable.qty) || 0,
                    rate: Number(consumable.rate) || 0,
                    amount: consumable.amount
                } as ConsumableInput)),
                CableDetails: {
                    CableType: formData.cableType || "",
                    CableLength: Number(formData.cableLength) || 0
                } as CableDetailInput,
                JobType: [formData.workType]
            };

            console.log('Submitting form data:', invoiceData);

            // Submit the form data to the database
            const response = await client.graphql({
                query: createInvoiceForm,
                variables: { input: invoiceData }
            });
            
            console.log('Response:', response);

            if (response.data.createInvoiceForm) {
                // Clear the form
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
                if (sigCanvas.current) {
                    sigCanvas.current.clear();
                }
                
                // Reset checkboxes
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
                
                // Show success message
                alert('Invoice form submitted successfully!');
            }
        } catch (error) {
            console.error('Error submitting invoice:', error);
            alert('Error submitting invoice. Please try again.');
        }
    };

    const handleCheckboxChange = (checkboxId: string) => {
        setJobTypeCheckboxes(prev => ({
            ...prev,
            [checkboxId]: !prev[checkboxId as keyof typeof jobTypeCheckboxes]
        }));
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
                  New form
                </h1>
                
              </div>

              <form className="w-full" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                  <div className="mb-2">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Work Ticket #</label>
                      <input
                        type="text"
                        id="workTicketNo"
                        value={formData.workTicketNo}
                        onChange={handleInputChange}
                        placeholder="Work Ticket #"
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
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Spooler</label>
                      <input
                        type="text"
                        id="spooler"
                        value={formData.spooler}
                        onChange={handleInputChange}
                        placeholder="Spooler"
                        className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                      />
                  </div>
                  <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Work Type</label>
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
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cable Company</label>
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
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cable Company Location</label>
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
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Oil Company</label>
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
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Well Number</label>
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
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Well Name</label>
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


                {/*Rate, QTY, AMNT*/}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8">
                  {/*Column 1*/}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Load/Unload</label>
                        <input
                          type="number"
                          id="rate1"
                          value={formData.rates[0].rate}
                          onChange={(e) => handleRateChange(0, 'rate', e.target.value)}
                          className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hours</label>
                        <input
                          type="number"
                          id="loadhours"
                          value={formData.rates[0].quantity}
                          onChange={(e) => handleRateChange(0, 'quantity', e.target.value)}
                          className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total</label>
                        <input
                          type="text"
                          id="loadtotal"
                          value={formData.rates[0].total.toFixed(2)}
                          readOnly
                          className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Spooler Miles To</label>
                        <input
                          type="number"
                          id="rate2"
                          value={formData.rates[1].rate}
                          onChange={(e) => handleRateChange(1, 'rate', e.target.value)}
                          className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Miles</label>
                        <input
                          type="number"
                          id="spoolermiles"
                          value={formData.rates[1].quantity}
                          onChange={(e) => handleRateChange(1, 'quantity', e.target.value)}
                          className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total</label>
                        <input
                          type="number"
                          id="milestotal"
                          value={formData.rates[1].total.toFixed(2)}
                          readOnly
                          className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Travel Time</label>
                        <input
                          type="number"
                          id="rate3"
                          value={formData.rates[2].rate}
                          onChange={(e) => handleRateChange(2, 'rate', e.target.value)}
                          className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hours</label>
                        <input
                          type="number"
                          id="travelhours"
                          value={formData.rates[2].quantity}
                          onChange={(e) => handleRateChange(2, 'quantity', e.target.value)}
                          className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total</label>
                        <input
                          type="number"
                          id="traveltotal"
                          value={formData.rates[2].total.toFixed(2)}
                          readOnly
                          className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Standby Time</label>
                        <input
                          type="number"
                          id="rate4"
                          value={formData.rates[3].rate}
                          onChange={(e) => handleRateChange(3, 'rate', e.target.value)}
                          className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hours</label>
                        <input
                          type="number"
                          id="standbyhours"
                          value={formData.rates[3].quantity}
                          onChange={(e) => handleRateChange(3, 'quantity', e.target.value)}
                          className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total</label>
                        <input
                          type="number"
                          id="standbytotal"
                          value={formData.rates[3].total.toFixed(2)}
                          readOnly
                          className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Spooler Labor</label>
                        <input
                          type="number"
                          id="rate5"
                          value={formData.rates[4].rate}
                          onChange={(e) => handleRateChange(4, 'rate', e.target.value)}
                          className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hours</label>
                        <input
                          type="number"
                          id="laborhours"
                          value={formData.rates[4].quantity}
                          onChange={(e) => handleRateChange(4, 'quantity', e.target.value)}
                          className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total</label>
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
                
                {/*Job type checkboxes*/}
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
                          checked={jobTypeCheckboxes[id as keyof typeof jobTypeCheckboxes]}
                          onChange={() => handleCheckboxChange(id)}
                          className="border rounded-lg text-sm outline-none dark:border-gray-200 dark:bg-gray-10"
                        />
                        <label htmlFor={id} className="text-sm font-medium text-gray-900 dark:text-white">
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>


                <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700"/>

                {/*Consumables*/}
                <div className="mb-8">
                  <div className="grid grid-cols-4 gap-4 font-medium bg-gray-300 p-2 rounded-md mb-2">
                    <span>Consumables</span>
                    <span>Quantity</span>
                    <span>Rate ($)</span>
                    <span>Total ($)</span>
                  </div>
                  {formData.consumables.map((consumable, index) => (
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
                
                {/*Notes section*/}
                <div className="mb-8">
                <label className="block mb-2 text-md font-medium text-black dark:text-white">Notes</label>
                  <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="border-2 border-gray-10 rounded-md w-full"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-black dark:text-white">Cable Length</label>
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
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Reel Number</label>
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
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cable Type</label>
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
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Extra Charges</label>
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
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Invoice Total</label>
                        <input
                          type="number"
                          id="invoiceTotal"
                          value={formData.rates.reduce((sum, rate) => sum + rate.total, 0) + 
                                    formData.consumables.reduce((sum, consumable) => sum + consumable.amount, 0) +
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
}

export default NewForm