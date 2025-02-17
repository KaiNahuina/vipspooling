"use client";
import React from 'react'
import {useState} from 'react'
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import SignatureCanvas from 'react-signature-canvas';



const NewForm = () => {

    {/*input default*/}
    const [formData, setFormData] = useState({
        workTicketNo: "",
        date: "",
        spooler: "",
        cableCompany: "",
        cableCompanyLocation: "",
        oilCompany: "",
        wellNumber: "",
        workType: "",
        reelNumber: "",
        cableLength: "",
        cableType: "",
        extraCharges: "",
        notes: "",
        signature: "",
        rates: [
          { description: "Load/Unload", quantity: 0, rate: 0, total: 0 },
          { description: "Spooler Miles To", quantity: 0, rate: 0, total: 0 },
          { description: "Travel Time", quantity: 0, rate: 0, total: 0 },
          { description: "Standby Time", quantity: 0, rate: 0, total: 0 },
          { description: "Spooler Labor", quantity: 0, rate: 0, total: 0 },
        ],
        consumables: [{ item: "", qty: 0, rate: 0, amount: 0 }],
      });

      const handleConsumableChange = (index: number, field: keyof typeof formData.consumables[0], value: string|number) => {
        const updatedConsumables = [...formData.consumables];
        updatedConsumables[index][field] = value as never;
    
        // Auto-calculate amount (qty * rate)
        if (field === "qty" || field === "rate") {
          updatedConsumables[index].amount =
            (updatedConsumables[index].qty || 0) * (updatedConsumables[index].rate || 0);
        }
    
        setFormData({ ...formData, consumables: updatedConsumables });
      };
    
      // Add new consumable row
      const addConsumable = () => {
        setFormData({
          ...formData,
          consumables: [...formData.consumables, { item: "", qty: 0, rate: 0, amount: 0 }],
        });
      };
    
      // Remove consumable row
      const removeConsumable = (index: number) => {
        const updatedConsumables = formData.consumables.filter((_, i) => i !== index);
        setFormData({ ...formData, consumables: updatedConsumables });
      };
    

      {/*Date Picker Logic*/}
      const [value, setValue] = useState<DateValueType>({
        startDate: null,
        endDate: null
      });
      
    {/**
      const handleChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
    
        // Auto-calculate total (quantity * rate)
        if (field === "quantity" || field === "rate") {
          updatedRows[index].total = (updatedRows[index].quantity || 0) * (updatedRows[index].rate || 0);
        }
    
        setRows(updatedRows);
      };
    
      // Add a new row
      const addRow = () => {
        setRows([...rows, { item: "", quantity: 1, rate: 0, total: 0 }]);
      };
    
      // Remove a row
      const removeRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
      };
    */}

      {/*Form Submission*/}
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
      };

    

  return (
    <div className="w-full max-w-3xl flex flex-col items-center bg-white dark:bg-gray-100 px-4 py-10 mx-auto rounded-[5px]">
        <div className="flex flex-col items-center justify-center gap-2 mb-8">
          <h1 className='text-black dark:text-white'>
            New form
          </h1>
          <h3 className='text-black dark:text-white'>
            template name goes here
          </h3>
        </div>

        <form className="w-full" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
            <div className="mb-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Work Ticket #</label>
                <input
                  type="text"
                  id="invoicenumber"
                  placeholder="Work Ticket #"
                  className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                />
            </div>

            <div className="mb-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                <Datepicker 
                value={value} 
                onChange={(newValue) => setValue(newValue)} 
                asSingle={true}
                useRange={false}
                primaryColor={"yellow"}
                />
                
            </div>

            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Spooler</label>
                <input
                  type="text"
                  id="spooler"
                  placeholder="Spooler"
                  className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Work Type</label>
                <input
                  type="text"
                  id="worktype"
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
                  id="cablecompany"
                  placeholder="Cable Company"
                  className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                />
            </div>
            <div className="mb-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cable Company Location</label>
                <input
                  type="text"
                  id="cablecompanylocation"
                  placeholder="Cable Company Location"
                  className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                />
            </div>
            <div className="mb-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Oil Company</label>
                <input
                  type="text"
                  id="oilcompany"
                  placeholder="Oil Company"
                  className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                />
            </div>
            <div className="mb-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Well Number</label>
                <input
                  type="text"
                  id="wellnumber"
                  placeholder="Well Number"
                  className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                />
            </div>
            <div className="mb-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Well Name</label>
                <input
                  type="text"
                  id="wellname"
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
                    placeholder="Load/Unload"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hours</label>
                  <input
                    type="number"
                    id="loadhours"
                    placeholder="Load/Unload Hours"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total</label>
                  <input
                    type="text"
                    id="loadtotal"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Spooler Miles To</label>
                  <input
                    type="number"
                    id="rate2"
                    placeholder="Spooler Miles To"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Miles</label>
                  <input
                    type="number"
                    id="spoolermiles"
                    placeholder="Spooler Miles"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total</label>
                  <input
                    type="number"
                    id="milestotal"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Travel Time</label>
                  <input
                    type="number"
                    id="rate3"
                    placeholder="Travel Time"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hours</label>
                  <input
                    type="number"
                    id="travelhours"
                    placeholder="Travel Hours"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total</label>
                  <input
                    type="number"
                    id="traveltotal"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Standby Time</label>
                  <input
                    type="number"
                    id="rate4"
                    placeholder="Standby Time"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hours</label>
                  <input
                    type="number"
                    id="standbyhours"
                    placeholder="Standby Hours"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total</label>
                  <input
                    type="number"
                    id="standbytotal"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Spooler Labor</label>
                  <input
                    type="number"
                    id="rate4"
                    placeholder="Spooler Labor"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hours</label>
                  <input
                    type="number"
                    id="laborhours"
                    placeholder="Labor Hours"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total</label>
                  <input
                    type="number"
                    id="labortotal"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
          </div>

          
          

          <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700"/>
          
          {/*Job type checkboxes*/}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-8">
              {[
                { id: "checkbox1", label: "Install" },
                { id: "checkbox2", label: "Pull" },
                { id: "checkbox3", label: "Gas Lift" },
                { id: "checkbox4", label: "CT Spooler" },
                { id: "checkbox5", label: "Combo Spooler" },
                { id: "checkbox6", label: "Gas Install" },
                { id: "checkbox7", label: "Cable Spooler" },
                { id: "checkbox8", label: "Technician Laydown" },
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={id}
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
              <div key={index} className="grid grid-cols-4 gap-4 items-center">
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
                  onChange={(e) => handleConsumableChange(index, "qty", Number(e.target.value))}
                  className="border p-2 rounded-md w-16 dark:bg-transparent text-black dark:text-white"
                />
                <input
                  type="number"
                  value={consumable.rate}
                  onChange={(e) => handleConsumableChange(index, "rate", Number(e.target.value))}
                  className="border p-2 rounded-md w-20 dark:bg-transparent text-black dark:text-white"
                />
                <div className="flex justify-between items-center">
                  <span className="p-2">{consumable.amount.toFixed(2)}</span>
                  {formData.consumables.length > 1 && (
                    <button
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
              onClick={addConsumable}
              className="text-gray-100 px-4 py-2 rounded-md bg-gold-200 hover:bg-gold-100 mt-2"
            >
              + Add Consumable
            </button>
          </div>

          <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700"/>
          
          {/*Notes section*/}
          <div className="mb-8">
            <textarea
            className="border-2 border-gray-10 rounded-md w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
              <div>
                  <label className="block mb-2 text-sm font-medium text-black dark:text-white">Cable Length</label>
                  <input
                    type="number"
                    id="cablelength"
                    placeholder="Cable Length(ft)"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Reel Number</label>
                  <input
                    type="number"
                    id="reelnumber"
                    placeholder="Reel Number"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cable Type</label>
                  <input
                    type="number"
                    id="cabletype"
                    placeholder="Cable Type"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Extra Charges</label>
                  <input
                    type="number"
                    id="extracharges"
                    placeholder="Extra Charges"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Invoice Total</label>
                  <input
                    type="number"
                    id="invoicetotal"
                    placeholder="Invoice Total"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none dark:border-gray-200 dark:bg-gray-10"
                  />
              </div>
              <div className="mt-2 border-2 border-gray-200">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Customer Signature</label>
                {/*Consider adding the toData() and other documentation to help exporting*/}
                <SignatureCanvas penColor='black'
                  canvasProps={{width: 300, height: 150, className: 'sigCanvas'}} />
              </div>
            
          </div>

        </form>

    </div>
  )
}

export default NewForm