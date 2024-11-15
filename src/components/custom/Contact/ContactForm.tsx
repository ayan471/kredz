'use client'

import React from 'react'
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'

const initialFields = [
    {
        label: 'Full Name', 
        component: 'INPUT', 
        type: 'text', 
        name: 'full-name',
        id: 'name',
        validation_error: false, 
        validation_message: '',
    },
    {
        label: 'Email ID', 
        component: 'INPUT', 
        type: 'email', 
        name: 'email',
        id: 'email',
        validation_error: false, 
        validation_message: '',        
    }, 
    {
        label: 'Phone Number', 
        component: 'INPUT', 
        type: 'phone', 
        name: 'phone',
        id: 'phone',
        validation_error: false, 
        validation_message: '',        
    },     
    {
        label: 'Message', 
        component: 'TEXTAREA', 
        type: 'text', 
        name: 'message',
        id: 'message',
        validation_error: false, 
        validation_message: '',        
    },   

    

]


const ContactForm = () => {


    const [fields, setFields] = useState(initialFields);
    const [finalMsg, setFinalMsg] = useState('');
    const handleSubmit = async(event:any) => {
        event.preventDefault(); 

        setFields(fields.map(field => ({
            ...field,
            validation_eror: false, 
            validation_message: '',
        })));

        const formData= new FormData(event.target);


    

        const reqOptions = {
            method: 'POST', 
            body: formData,
        }
        const req = await fetch('https://grhealthy.in/wp-json/contact-form-7/v1/contact-forms/784/feedback', reqOptions);
        const response = await req.json();
        await console.log("yes", formData);

        if(!response) return alert('An unexpected error'); 

        if(response.invalid_fields && response.invalid_fields.length>0) {
            return setFields(fields.map(field => {
                const error = response.invalid_fields.find((x:any) => x.field === field.name);

                return{
                    ...field, 
                    validation_error: error ? true : false, 
                    validation_message: error ? error.message : '',
                };

            }));
        }

        setFinalMsg("Your message has been sent! Thanks..."); 


    }


  return (
    <div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-[600px] m-auto w-full mt-12 mb-0 p-6 bg-slate-50">

        {fields.map(field => (
            <fieldset key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                {field.component === "INPUT" && <Input type={field.type}  id={field.id} name={field.name}/>}
                {field.component === "TEXTAREA" && <Textarea id={field.id} name={field.name}/>}
                {field.validation_error && <div className="text-sm text-red-700">{field.validation_message}</div>}
            </fieldset>

        ))}
            <Input type="hidden" className="hidden" name="_wpcf7_unit_tag" value="wpcf7-f784-p785-o1"/>

            <Button type="submit" className="max-w-min">Send</Button>

            {finalMsg && <div className="text-md bg-green-700 text-white p-2 rounded">{finalMsg}</div>}
        </form>

    </div>
  )
}

export default ContactForm