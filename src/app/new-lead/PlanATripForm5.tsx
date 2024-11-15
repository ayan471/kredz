"use client";

/*



            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  fromDate={new Date()} 
                  onSelect={setDate}
                  initialFocus
                  value="test"
                  {...register("fromDate")} 
                />
              </PopoverContent>
            </Popover>



*/ 

'use client'

import React from 'react'

import {useForm} from 'react-hook-form'
import { DevTool } from '@hookform/devtools'


import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


import { useState } from "react";

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast"


type FormValues = {
  MethodOfComnctn: string
  PreferdAcmdn: string
  destinationIndia: string
  destinationOther: string
  eMail: string
  fromDate: string
  fullName: string
  msgForUs: string
  phone: string
  preferredGetaways: string
  preferredGetawaysOther: string
  toDate: string
  typeOfTravel: string
}

const PlanATripForm5 = () => {


  const { toast } = useToast()

  const form = useForm<FormValues>();
  const { register, control, handleSubmit } = form;

  const onSubmit = async(data:FormValues) => {

    /* Showing form data in console */

    console.log('Form Submitted', data);

    /* A validation workaround */ 

    if(data.fullName === "" || data.eMail === "" || data.phone === "" ) {
      toast({
        variant: "destructive",
        title: "Some details are missing!",
        description: "Please enter all the details.",
      })
    }

    /* Sending message API hit*/
    else {

    try {
      const response = await fetch("/api/newlead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error("Failed to submit form data");
        return;
      } 

      console.log("Form submitted successfully");


      toast({
        title: "Message Sent!",
        description: "We've received your message. We'll reply via email in the next 24 hours.",
      })



      // Handle success (e.g., clear form, show success message, etc.)
    } catch (error) {
      console.error("Error submitting form:", error);
    }

  }

  }







  return (
    <div className="mx-auto">

      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>



        <p className="font-bold">Personal Information <span className="text-red-600">*</span></p>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">

          <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="fullName">Full Name</Label>
          <Input type="text" id="fullName" {...register("fullName")}  />
          </div>


          <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="eMail">Email ID</Label>
          <Input type="email" id="eMail" {...register("eMail")}  />
          </div>


          <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input type="tel"  id="phone" {...register("phone")}  />
          </div>

        </div>




        <p className="font-bold">Type of travel <span className="text-red-600">*</span></p>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)]  rounded-xl">
        <div>
            <div className="flex flex-col bg-[rgba(255,255,255,0.4)] p-6 border-2 rounded-xl">
              <RadioGroup>
                <div className="travelTypeCstm flex items-center space-x-2">
                <input {...register("typeOfTravel")} type="radio" value="Solo Women" id="r1" />
                  <Label htmlFor="r1">Solo Women</Label>
                </div>
                <div className="travelTypeCstm flex items-center space-x-2">
                <input {...register("typeOfTravel")} type="radio" value="Solo Men" id="r2" />
                  <Label htmlFor="r2">Solo Men</Label>
                </div>
                <div className="travelTypeCstm flex items-center space-x-2">
                <input {...register("typeOfTravel")} type="radio" value="Couple" id="r3" />
                  <Label htmlFor="r3">Couple</Label>
                </div>
                <div className="travelTypeCstm flex items-center space-x-2">
                <input {...register("typeOfTravel")} type="radio" value="Family" id="r4" />
                  <Label htmlFor="r4">Family</Label>
                </div>
                <div className="travelTypeCstm flex items-center space-x-2">
                <input {...register("typeOfTravel")} type="radio" value="Family" id="r5" />
                  <Label htmlFor="r5">Group</Label>
                </div>
                <div className="travelTypeCstm flex items-center space-x-2">
                <input {...register("typeOfTravel")} type="radio" value="Business" id="r6" />
                  <Label htmlFor="r6">Business</Label>
                </div>
                <div className="travelTypeCstm flex items-center space-x-2">
                <input {...register("typeOfTravel")} type="radio" value="Seniors" id="r7" />
                  <Label htmlFor="r7">Seniors</Label>
                </div>
              </RadioGroup>
            </div>
        </div>
        </div> 




        <p className="font-bold">Preferred Getaways <span className="text-red-600">*</span></p>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)]  rounded-xl">

        <div>
            <div className="flex flex-col bg-[rgba(255,255,255,0.4)] p-6 border-2 rounded-xl gap-6">

              <RadioGroup>
                <div className="prefGetawaysCstm flex items-center space-x-2">
                <input {...register("preferredGetaways")} type="radio" value="Excursion" id="pg1" />
                  <Label htmlFor="pg1">Excursion</Label>
                </div>
                <div className="prefGetawaysCstm flex items-center space-x-2">
                <input {...register("preferredGetaways")} type="radio" value="Countryside" id="pg2" />
                  <Label htmlFor="pg2">Countryside</Label>
                </div>
                <div className="prefGetawaysCstm flex items-center space-x-2">
                <input {...register("preferredGetaways")} type="radio" value="Weekend" id="pg3" />
                  <Label htmlFor="pg3">Weekend</Label>
                </div>
                <div className="prefGetawaysCstm flex items-center space-x-2">
                <input {...register("preferredGetaways")} type="radio" value="Destination Packages" id="pg4" />
                  <Label htmlFor="pg4">Destination Packages</Label>
                </div>
              </RadioGroup>

              <p className="text-sm text-slate-600">Or</p>

              <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="prefGetawayOther">Other</Label>
              <Input type="text" placeholder="" id="prefGetawayOther" {...register("preferredGetawaysOther")}  />
              </div>

            </div>
        </div>
        </div> 






        <p className="font-bold">Preferred Destinations <span className="text-red-600">*</span></p>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)]  rounded-xl">

        <div>
            <div className="flex flex-col bg-[rgba(255,255,255,0.4)] p-6 border-2 rounded-xl gap-6">

              <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="WithinIndiaDest">Within India - Name of Destination</Label>
              <Input type="text" id="WithinIndiaDest" {...register("destinationIndia")}  />
              </div>

              <p className="text-sm text-slate-600">Or</p>

              <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="OtherDest">Other</Label>
              <Input type="text" id="OtherDest" {...register("destinationOther")}  />
              </div>

            </div>
        </div>
        </div> 





        <p className="font-bold">Travel Dates <span className="text-red-600">*</span></p>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)]  rounded-xl">

        <div>
            <div className="flex flex-row bg-[rgba(255,255,255,0.4)] p-6 border-2 rounded-xl gap-6">

              <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="FromDate">From</Label>
              <Input type="text" placeholder="DD/MM/YY" id="FromDate" {...register("fromDate")}  />
              </div>


              <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="ToDate">To</Label>
              <Input type="text" placeholder="DD/MM/YY" id="ToDate" {...register("toDate")}  />
              </div>

            </div>
        </div>
        </div> 





        <p className="font-bold">Preferred Accomodations <span className="text-red-600">*</span></p>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)]  rounded-xl">
        <div>
            <div className="flex flex-col bg-[rgba(255,255,255,0.4)] p-6 border-2 rounded-xl">
              <RadioGroup>
                <div className="PrefAccomCstm flex items-center space-x-2">
                <input {...register("PreferdAcmdn")} type="radio" value="Hotel (3/4/5 Stars)" id="pracc1" />
                  <Label htmlFor="pracc1">Hotel (3/4/5 Stars)</Label>
                </div>
                <div className="PrefAccomCstm flex items-center space-x-2">
                <input {...register("PreferdAcmdn")} type="radio" value="Homestay/Farm stays" id="pracc2" />
                  <Label htmlFor="pracc2">Homestay/Farm stays</Label>
                </div>
                <div className="PrefAccomCstm flex items-center space-x-2">
                <input {...register("PreferdAcmdn")} type="radio" value="Others" id="pracc3" />
                  <Label htmlFor="pracc3">Others</Label>
                </div>
              </RadioGroup>
            </div>
        </div>
        </div> 





        <p className="font-bold">Special Request or Requirement</p>

        <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="anyMessageForUs">Message</Label>
              <Textarea placeholder="" id="anyMessageForUs" {...register("msgForUs")}  className="border-2 rounded-xl"/>
        </div>









        <p className="font-bold">Preferred Method of Communication <span className="text-red-600">*</span></p>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)]  rounded-xl">
        <div>
            <div className="flex flex-col bg-[rgba(255,255,255,0.4)] p-6 border-2 rounded-xl">
              <RadioGroup>
                <div className="MethodOfCommCstm flex items-center space-x-2">
                <input {...register("MethodOfComnctn")} type="radio" value="E-mail" id="moc1" />
                  <Label htmlFor="moc1">E-mail</Label>
                </div>
                <div className="MethodOfCommCstm flex items-center space-x-2">
                <input {...register("MethodOfComnctn")} type="radio" value="WhatsApp Message" id="moc2" />
                  <Label htmlFor="moc2">WhatsApp Message</Label>
                </div>
                <div className="MethodOfCommCstm flex items-center space-x-2">
                <input {...register("MethodOfComnctn")} type="radio" value="Phone Call" id="moc3" />
                  <Label htmlFor="moc3">Phone Call</Label>
                </div>
              </RadioGroup>
            </div>
        </div>
        </div> 









        <div className="finalConcentCstm items-top flex space-x-2">
              <Checkbox id="terms1" checked />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept terms and conditions{" "}
                  <span className="text-red-600">*</span>
                </label>
                <p className="text-sm text-muted-foreground">
                  By submitting this form, you agree to our terms and
                  conditions.
                </p>
              </div>
            </div>







            <Button type="submit" className="mt-8 text-md">Plan My Trip</Button>

      </form>





      <DevTool control={control}/>


    </div>

  )
}

export default PlanATripForm5