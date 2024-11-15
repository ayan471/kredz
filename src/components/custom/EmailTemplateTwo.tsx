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

  MethodOfComnctn: string; 
  PreferdAcmdn: string; 
  destinationIndia: string; 
  destinationOther: string; 
  eMail: string; 
  fromDate: string; 
  fullName: string; 
  msgForUs: string; 
  phone: string; 
  preferredGetaways: string;
  preferredGetawaysOther: string; 
  toDate: string;
  typeOfTravel: string;
}
  
const baseUrl = 'https://demo.react.email/'
  

  
  export const NetlifyWelcomeEmail = ({
    MethodOfComnctn, PreferdAcmdn, destinationIndia, destinationOther, eMail, fromDate, fullName, msgForUs, phone, preferredGetaways, preferredGetawaysOther, toDate, typeOfTravel  
  }: NetlifyWelcomeEmailProps) => {
    return (
      <Html>

        <Tailwind>
        <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[565px]">

        <Head>
            <title>New Lead | Geranos Getaways</title>
        </Head>

        <Img className="m-auto" src="https://geranosgetaways.com/wp-content/uploads/2024/08/logo-3.png" alt="Geranos Logo" width="180" height="90" />



        
        <Preview>Here is a New Plan a Tour request.</Preview>


        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[20px] mx-0">
              New <strong>Plan a tour</strong> request
        </Heading>

        <Hr />

        <div className="gap-8 px-2 py-8 max-w-[440px] m-auto">

        <div className="py-2 px-4 mb-4 border-2 bg-slate-50 rounded-xl">
          <p>Full Name: {fullName}</p>
          <p>Email ID: {eMail}</p>
          <p>Phone No: {phone}</p>
        </div>

        <div className="py-2 px-4 mb-4 border-2 bg-slate-50 rounded-xl">
          <p>Preferred Method of Communication: {MethodOfComnctn}</p>
        </div>


        <div className="py-2 px-4 mb-4 border-2 bg-slate-50 rounded-xl">
          { destinationIndia !== "" &&   
            <p>Location | India: {destinationIndia}</p>
          }
          { destinationOther !== "" &&
            <p>Location | Other: {destinationOther}</p>
          }
          <p>Travel Type: {typeOfTravel}</p>
          
          
          <p>Preferred Getaway: {preferredGetaways}</p>

          { (preferredGetawaysOther !== "") &&
            <p>Other Getaway: {preferredGetawaysOther}</p>
          }

          <p>Preferred Accomodation: {PreferdAcmdn}</p>
        </div>
        
        <div className="py-2 px-4 mb-4 border-2 bg-slate-50 rounded-xl">
          <p>Start Date: <span className="font-bold">{fromDate}</span></p>
          <p>End Date: <span className="font-bold">{toDate}</span></p>
        </div>


 
      
        <div className="py-2 px-4 border-2 bg-slate-50 rounded-xl">
        <p>Special Request: {msgForUs}</p>
        </div>


        </div>
   

        <div className="flex align-middle justify-center">
   
          <Button 
          href={`tel:${phone}`} 
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
  
  export default NetlifyWelcomeEmail;
  