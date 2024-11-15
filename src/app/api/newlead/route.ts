import { NextResponse } from "next/server";
import { Resend } from 'resend'
import { NetlifyWelcomeEmail } from '../../../components/custom/EmailTemplateTwo'




export async function POST(request:any) {
    
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const body = await request.json(); 

        const { MethodOfComnctn, PreferdAcmdn, destinationIndia, destinationOther, eMail, fromDate, fullName, msgForUs, phone, preferredGetaways, preferredGetawaysOther, toDate, typeOfTravel } = body; 

        const { data } = await resend.emails.send({
            from: 'Geranos Getaways <onboarding@resend.dev>', 
            to: 'sashank@geranosgetaways.com', 
            subject: 'Plan A Getaway Request',
            html: '', 
            text: '',
            react: NetlifyWelcomeEmail({MethodOfComnctn, PreferdAcmdn, destinationIndia, destinationOther, eMail, fromDate, fullName, msgForUs, phone, preferredGetaways, preferredGetawaysOther, toDate, typeOfTravel}), 
        }); 
        return NextResponse.json({ data });
        console.log(data); 

    } catch (error) {
        return NextResponse.json({error});
    }


}