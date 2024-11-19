"use client"

import {useForm} from 'react-hook-form'
import { DevTool } from '@hookform/devtools'


import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast"


type FormValues = {
    userName: string
    phone: string
    eMail: string
    panNumber: string
    aadharNumber:  string
}

const SubscriptionPlanForm = () => {


  const { toast } = useToast()

  const form = useForm<FormValues>();
  const { register, control, handleSubmit } = form;

  const onSubmit = async(data:FormValues) => {

    /* Showing form data in console */

    console.log('Form Submitted', data);

    /* Showing Toast after submit */

    toast({
        title: "Message Sent!",
        description: "We've received your message. We'll reply via email in the next 24 hours.",
      })

  }



  return (
    <div className="mx-auto">

      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>

        {/*****************/}
        {/* Input Group 1 */}
        {/*****************/}

        <p className="font-bold">Personal Information <span className="text-red-600">*</span></p>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">

          <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="userName">Username</Label>
          <Input type="text" id="userName" value="Rajen Roy" {...register("userName")}  />
          </div>

          <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input type="tel"  id="phone" value="+91 8699 81 2196" {...register("phone")}  />
          </div>

          <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="eMail">Email ID</Label>
          <Input type="email" id="eMail" value="rajen.roy@gmail.com" {...register("eMail")}  />
          </div>

        </div>

        {/*****************/}
        {/* Input Group 2 */}
        {/*****************/}

        <p className="font-bold">For Verification <span className="text-red-600">*</span></p>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">

          <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="panNumber">PAN Number</Label>
          <Input type="text"  id="panNumber" placeholder="" {...register("panNumber")}  />
          </div>

          <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="aadharNumber">Aadhar Number</Label>
          <Input type="text" id="aadharNumber" placeholder="" {...register("aadharNumber")}  />
          </div>

        </div>











        <div className="finalConcentCstm items-top flex space-x-2">
              <Checkbox id="terms1"  />
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







            <Button type="submit" className="mt-8 text-md">Buy Subscription Plan</Button>

      </form>





      <DevTool control={control}/>


    </div>

  )
}

export default SubscriptionPlanForm