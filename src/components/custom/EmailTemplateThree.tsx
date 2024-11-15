import * as React from "react";

import {
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Hr,
  Tailwind,
} from "@react-email/components";
  
interface NetlifyWelcomeEmailProps {
    fullName:string;
    phoneNo:string;
    emailId:string;
    message:string; 
}
  
const baseUrl = 'https://demo.react.email/'
  

  
  export const ContactUsEmailTemplate = ({
    fullName, phoneNo, emailId, message
  }: NetlifyWelcomeEmailProps) => {
    return (
      <Html>

        <Tailwind>
        <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[565px]">

        <Head>
            <title>New Message | Geranos Getaways</title>
        </Head>

        <Img className="m-auto" src="https://geranosgetaways.com/wp-content/uploads/2024/08/logo-3.png" alt="Geranos Logo" width="180" height="90" />

        <Preview>Here is a New message.</Preview>


        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[20px] mx-0">
              New <strong>Message</strong> from our website
        </Heading>

        <Hr />

        <div className="gap-8 px-2 py-8 max-w-[540px] m-auto">

        <div className="py-2 px-4 mb-4 border-2 bg-slate-50 rounded-xl">
          <p className="text-sm sm:text-xl">Full Name: {fullName}</p>
          <p className="text-sm sm:text-xl">Phone No: {phoneNo}</p>
          <p className="text-sm sm:text-xl">Email ID: {emailId}</p>
        </div>

        <div className="py-2 px-4 mb-4 border-2 bg-slate-50 rounded-xl">
          <p className="text-sm sm:text-xl">Message: {message}</p>
        </div>

        </div>
   
        <div className="flex align-middle justify-center">
          <Button 
          href={`tel:${phoneNo}`} 
          className="bg-[#000000] max-w-min min-w-[120px] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-4 mb-2 mx-auto">        
          Call The Prospect
          </Button>
        </div>

        <Hr />

        <p className="text-center">Geranos Getaways ・ Chandigarh ❤️ IN</p>
        <p className="text-center text-slate-400 max-w-[360px] m-auto">This email is sent from &quot;Let Us Plan Your Getaway!&quot; form from Geranos Getaways website.</p>

        </Container>
        </Tailwind>
      </Html>
    );
  };
  
  export default ContactUsEmailTemplate;
  