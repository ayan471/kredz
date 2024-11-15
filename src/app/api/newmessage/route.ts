import { NextResponse } from "next/server";
import { Resend } from 'resend'
import { ContactUsEmailTemplate } from '../../../components/custom/EmailTemplateThree'




export async function POST(request:any) {
    
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const body = await request.json(); 

        const { fullName, phoneNo, emailId, message } = body; 

        const { data } = await resend.emails.send({
            from: 'Geranos Getaways <onboarding@resend.dev>', 
            to: 'sashank@geranosgetaways.com', 
            subject: 'New Message | Geranos Getaways',
            html: '', 
            text: '',
            react: ContactUsEmailTemplate({fullName, phoneNo, emailId, message}),
        }); 

        return NextResponse.json({ data });

    } catch (error) {
        return NextResponse.json({error});
    }


}