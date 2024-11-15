"use client";

import React from "react";
import { useState } from "react";

/* Dependencies for validation */

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/* ShadCN dependencies */

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { X } from "lucide-react";
/* Form Schema */

const formSchema = z.object({
  fullName: z.string({
    required_error: "Name is required",
  }),
  emailAddress: z.string().email(),
  mobileNumber: z.number(),
  travelType: z.string(),
  prefGetaway: z.string(),
  otherGetaway: z.string(),
  locIndia: z.string(),
  locAbroad: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  prefAccom: z.string(),
  specialReq: z.string(),
  metOfComm: z.string(),
});

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const PlanATripForm = () => {
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      emailAddress: "",
      mobileNumber: 0,
      travelType: "",
      prefGetaway: "",
      otherGetaway: "",
      locIndia: "",
      locAbroad: "",
      startDate: "",
      endDate: "",
      prefAccom: "",
      specialReq: "",
      metOfComm: "",
    },
  });

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    console.log("yes", e);

    nowValName = document.getElementById("fullNameVal").value;
    nowValEmail = document.getElementById("emailIdVal").value;
    nowValmobileNumber = document.getElementById("mobileNumberVal").value;
    nowValTravelType = document.querySelector(
      '.travelTypeCstm button[data-state|="checked"]',
    ).value;
    nowValPrefGetaway = document.querySelector(
      '.prefGetawaysCstm button[data-state|="checked"]',
    ).value;
    nowValOtherGetaway = document.getElementById("otherGetawayVal").value;
    nowValLocIndia = document.getElementById("locIndiaVal").value;
    nowValLocAbroad = document.getElementById("locAbroadVal").value;
    nowValStartDate = document.querySelector(".startDateCstm").innerText;
    nowValEndDate = document.querySelector(".endDateCstm").innerText;
    nowValPrefAccom = document.querySelector(
      '.prefAccomCstm button[data-state|="checked"]',
    ).value;
    nowValSpecialReq = document.getElementById("specialReqVal").value;
    nowValMetOfComm = document.querySelector(
      '.metOfCommCstm button[data-state|="checked"]',
    ).value;

    setFormData({
      fullName: nowValName,
      emailAddress: nowValEmail,
      mobileNumber: nowValmobileNumber,
      travelType: nowValTravelType,
      prefGetaway: nowValPrefGetaway,
      otherGetaway: nowValOtherGetaway,
      locIndia: nowValLocIndia,
      locAbroad: nowValLocAbroad,
      startDate: nowValStartDate,
      endDate: nowValEndDate,
      prefAccom: nowValPrefAccom,
      specialReq: nowValSpecialReq,
      metOfComm: nowValMetOfComm,
    });

    console.log("Sending Data: ", FormData);
    const response = await fetch("/api/newlead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(FormData),
    });

    if (response.status === 2000) {
      setFormData({
        fullName: "",
        emailAddress: "",
        mobileNumber: "",
        travelType: "",
        prefGetaway: "",
        otherGetaway: "",
        locIndia: "",
        locAbroad: "",
        startDate: "",
        endDate: "",
        prefAccom: "",
        specialReq: "",
        metOfComm: "",
      });
    }
    console.log("Submit function executed!");
  };

  /* Experimental Usestate */

  let initialFormValues = {
    fullName: "",
    emailAddress: "",
    mobileNumber: "",
    travelType: "",
    prefGetaway: "",
    otherGetaway: "",
    locIndia: "",
    locAbroad: "",
    startDate: "",
    endDate: "",
    prefAccom: "",
    specialReq: "",
    metOfComm: "",
  };

  const [FormData, setFormData] = useState(initialFormValues);

  let nowValName = "",
    nowValEmail = "",
    nowValmobileNumber,
    nowValTravelType,
    nowValPrefGetaway,
    nowValOtherGetaway,
    nowValLocIndia,
    nowValLocAbroad,
    nowValStartDate,
    nowValEndDate,
    nowValPrefAccom,
    nowValSpecialReq,
    nowValMetOfComm;

  const onFormUpdes = (e: z.infer<typeof formSchema>) => {
    

  nowValName = document.getElementById("fullNameVal").value;
  nowValEmail = document.getElementById('emailIdVal').value; 
  nowValmobileNumber = document.getElementById('mobileNumberVal').value;
  nowValTravelType = document.querySelector('.travelTypeCstm button[data-state|="checked"]').value; 
  nowValPrefGetaway = document.querySelector('.prefGetawaysCstm button[data-state|="checked"]').value; 
  nowValOtherGetaway = document.getElementById('otherGetawayVal').value;
  nowValLocIndia = document.getElementById('locIndiaVal').value;
  nowValLocAbroad = document.getElementById('locAbroadVal').value;
  nowValStartDate = document.querySelector('.startDateCstm').innerText; 
  nowValEndDate = document.querySelector('.endDateCstm').innerText; 
  nowValPrefAccom = document.querySelector('.prefAccomCstm button[data-state|="checked"]').value; 
  nowValSpecialReq =  document.getElementById('specialReqVal').value;
  nowValMetOfComm = document.querySelector('.metOfCommCstm button[data-state|="checked"]').value; 


  setFormData({
    fullName: nowValName,
    emailAddress: nowValEmail,
    mobileNumber: nowValmobileNumber, 
    travelType: nowValTravelType, 
    prefGetaway: nowValPrefGetaway, 
    otherGetaway: nowValOtherGetaway,
    locIndia: nowValLocIndia,
    locAbroad: nowValLocAbroad,
    startDate: nowValStartDate, 
    endDate: nowValEndDate, 
    prefAccom: nowValPrefAccom, 
    specialReq: nowValSpecialReq, 
    metOfComm: nowValMetOfComm, 
  });


  };

  return (
    <div className="">
      <div className="">
        <Form {...form}>
          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col pt-2 px-2 gap-6 max-w-[600px] rounded-xl m-auto w-full mb-4 ]"
          >
            <p className="font-bold">
              Personal Information <span className="text-red-600">*</span>
            </p>

            <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-2 rounded-xl">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          id="fullNameVal"
                          placeholder=""
                          type="text"
                          onChange={onFormUpdes}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          id="emailIdVal"
                          placeholder=""
                          type="email"
                          onChange={onFormUpdes}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          id="mobileNumberVal"
                          placeholder=""
                          type="tel"
                          onChange={onFormUpdes}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <p className="font-bold">
              Type of Travel <span className="text-red-600">*</span>
            </p>
            <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-2 rounded-xl">
              <RadioGroup defaultValue="comfortable" onChange={onFormUpdes}>
                <div className="travelTypeCstm flex items-center space-x-2">
                  <RadioGroupItem value="Solo Women" id="r1" />
                  <Label htmlFor="r1">Solo Women</Label>
                </div>
                <div className="travelTypeCstm flex items-center space-x-2">
                  <RadioGroupItem value="Solo Men" id="r2" />
                  <Label htmlFor="r2">Solo Men</Label>
                </div>
                <div className="travelTypeCstm flex items-center space-x-2">
                  <RadioGroupItem value="Couple" id="r3" />
                  <Label htmlFor="r3">Couple</Label>
                </div>
                <div className="travelTypeCstm flex items-center space-x-2">
                  <RadioGroupItem value="Family" id="r4" />
                  <Label htmlFor="r4">Family</Label>
                </div>
                <div className="travelTypeCstm flex items-center space-x-2">
                  <RadioGroupItem value="Group" id="r5" />
                  <Label htmlFor="r5">Group</Label>
                </div>
                <div className="travelTypeCstm flex items-center space-x-2">
                  <RadioGroupItem value="Business" id="r6" />
                  <Label htmlFor="r6">Business</Label>
                </div>
                <div className="travelTypeCstm flex items-center space-x-2">
                  <RadioGroupItem value="Seniors" id="r7" />
                  <Label htmlFor="r7">Seniors</Label>
                </div>
              </RadioGroup>
            </div>

            <p className="font-bold">
              Preferred Getaways <span className="text-red-600">*</span>
            </p>
            <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-2 rounded-xl">
              <RadioGroup defaultValue="" onChange={onFormUpdes}>
                <div className="prefGetawaysCstm flex items-center space-x-2">
                  <RadioGroupItem value="Excursion" id="pg1" />
                  <Label htmlFor="pg1">Excursion</Label>
                </div>
                <div className="prefGetawaysCstm flex items-center space-x-2">
                  <RadioGroupItem value="Countryside" id="pg2" />
                  <Label htmlFor="pg2">Countryside</Label>
                </div>
                <div className="prefGetawaysCstm flex items-center space-x-2">
                  <RadioGroupItem value="Weekend" id="pg3" />
                  <Label htmlFor="pg3">Weekend</Label>
                </div>
                <div className="prefGetawaysCstm flex items-center space-x-2">
                  <RadioGroupItem value="Destination Packages" id="pg4" />
                  <Label htmlFor="pg4">Destination Packages</Label>
                </div>
              </RadioGroup>

              <p className="text-sm text-slate-600">Or</p>

              <FormField
                className=""
                control={form.control}
                name="otherGetaway"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <FormLabel>Others</FormLabel>
                      <FormControl>
                        <Input
                          id="otherGetawayVal"
                          placeholder=""
                          type="text"
                          onChange={onFormUpdes}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <p className="font-bold">
              Preferred Destinations <span className="text-red-600">*</span>
            </p>
            <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-2 rounded-xl">
              <FormField
                className="basis-3/7"
                control={form.control}
                name="locIndia"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <FormLabel>Within India - Name of Destination</FormLabel>
                      <FormControl>
                        <Input
                          id="locIndiaVal"
                          placeholder=""
                          type="text"
                          onChange={onFormUpdes}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <p className="text-sm text-slate-600">Or</p>

              <FormField
                className="basis-3/7"
                control={form.control}
                name="locAbroad"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <FormLabel>Others</FormLabel>
                      <FormControl>
                        <Input
                          id="locAbroadVal"
                          placeholder=""
                          type="text"
                          onChange={onFormUpdes}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <p className="font-bold">
              Travel Dates <span className="text-red-600">*</span>
            </p>

            <div className="flex flex-row gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-2 rounded-xl">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "startDateCstm w-[280px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    onChange={onFormUpdes}
                    minDate={new Date()}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "endDateCstm w-[280px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    onChange={onFormUpdes}
                    minDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <p className="font-bold">
              Preferred Accomodations <span className="text-red-600">*</span>
            </p>
            <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-2 rounded-xl">
              <RadioGroup defaultValue="" onChange={onFormUpdes}>
                <div className="prefAccomCstm flex items-center space-x-2">
                  <RadioGroupItem value="Hotel (3/4/5 Stars)" id="pa1" />
                  <Label htmlFor="pa1">Hotel (3/4/5 Stars)</Label>
                </div>
                <div className="prefAccomCstm flex items-center space-x-2">
                  <RadioGroupItem value="Homestay/Farm stays" id="pa2" />
                  <Label htmlFor="pa2">Homestay/Farm stays</Label>
                </div>
                <div className="prefAccomCstm flex items-center space-x-2">
                  <RadioGroupItem value="Others" id="pa3" />
                  <Label htmlFor="pa3">Others</Label>
                </div>
              </RadioGroup>
            </div>

            <p className="font-bold">Special Request or Requirement</p>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        className="border-2 rounded-xl"
                        id="specialReqVal"
                        placeholder=""
                        type="text"
                        onChange={onFormUpdes}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <p className="font-bold">
              Preferred Method of Communication{" "}
              <span className="text-red-600">*</span>
            </p>
            <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-2 rounded-xl">
              <RadioGroup defaultValue="" onChange={onFormUpdes}>
                <div className="metOfCommCstm flex items-center space-x-2">
                  <RadioGroupItem value="E-mail" id="moc1" />
                  <Label htmlFor="moc1">E-mail</Label>
                </div>
                <div className="metOfCommCstm flex items-center space-x-2">
                  <RadioGroupItem value="Whatsapp-Message" id="moc2" />
                  <Label htmlFor="moc2">WhatsApp Message</Label>
                </div>
                <div className="metOfCommCstm flex items-center space-x-2">
                  <RadioGroupItem value="Phone-Call" id="moc3" />
                  <Label htmlFor="moc3">Phone Call</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="finalConcentCstm items-top flex space-x-2">
              <Checkbox id="terms1" />
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

            <Button type="submit" className="max-w-min">
              Send Me A Plan
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PlanATripForm;
