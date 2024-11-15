import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/custom/Header/Header";
import Footer from "@/components/custom/Footer/Footer";
import { Toaster } from "@/components/ui/toaster"
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kredz",
  description: "Micro Credit Service",
};

import localfont from 'next/font/local'

const myFont = localfont({
      src: [
        {
        path: "../../public/fonts/Rumburak.ttf",
        weight: "700",
        }
      ], 
      variable: "--font-myFont",
  });


  const dancingScript = localfont({
    src: [
      {
      path: "../../public/fonts/DancingScript-VariableFont_wght.ttf",
      weight: "700",
      }
    ], 
    variable: "--font-dancingScript",
});  


const SedgwickAve = localfont({
  src: [
    {
    path: "../../public/fonts/SedgwickAve-Regular.ttf",
    weight: "500",
    }
  ], 
  variable: "--font-SedgwickAve",
});  


const BethEllen = localfont({
  src: [
    {
    path: "../../public/fonts/BethEllen-Regular.ttf",
    weight: "500",
    }
  ], 
  variable: "--font-BethEllen",
});  

const EduVICWANTBeginner = localfont({
  src: [
    {
    path: "../../public/fonts/EduVICWANTBeginner-VariableFont_wght.ttf",
    weight: "700",
    }
  ], 
  variable: "--font-EduVICWANTBeginner",
});  

const UrbanistLight = localfont({
  src: [
    {
    path: "../../public/fonts/Urbanist-Light.ttf",
    weight: "300",
    }
  ], 
  variable: "--font-UrbanistLight",
});  


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <ClerkProvider
    
    appearance={{
      layout: {
        unsafe_disableDevelopmentModeWarnings: true,
      },
    }}
    
    >
    <html lang="en" className={`max-w-[1920px] mx-auto w-full ${myFont.variable} ${dancingScript.variable} ${SedgwickAve.variable} ${BethEllen.variable} ${EduVICWANTBeginner.variable} ${UrbanistLight.variable} scroll-smooth`}>

      <body className={inter.className}>
      <Header/>
      <div className="mt-20">
        {children}
      </div>

      <div className="">
      <Footer/>
      </div>
      <Toaster />
      </body>
    </html>
    </ClerkProvider>
  );
}
