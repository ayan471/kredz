import React from 'react'
import Image from 'next/image'
import MainNavigation from './mainNavigation'
import AlgoliaBlueButton from "@/components/animata/text/button/algolia-blue-button";
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import HamburgerIcon from './hamburger.webp'

import { Button } from '@/components/ui/button';
import MobileNavigation from './MobileNavigation';
import HeaderAccountDetails from './HeaderAccountDetails';
import { auth, currentUser } from '@clerk/nextjs/server'
import { UserButton, UserProfile } from '@clerk/nextjs';

const Header = async() => {

  const user = await currentUser()

  return (
    <div className="max-w-[1920px] border-t-[10px] border-slate-400 fixed top-0 z-50 w-full bg-white min-h-[80px]">
    <div className="flex flex-row align-middle justify-between px-2 sm:px-6 py-2">
 
    <Link href="/" className="xl:min-w-[200px] flex flex-col align-start justify-center">
    <Image src="/global/credit-samdhan-logo.png" width="600" height="420" alt="logo" className="max-w-[160px]"/>        
    </Link>




    <div className="hidden xl:flex">
    <MainNavigation/>
    </div>


    <div className="flex flex-row gap-8 xl:min-w-[200px] justify-end">


    <div className="flex gap-4 flex-row align-middle justify-center">





      {
        user?<div className="max-h-[40px] my-auto"><UserButton/></div>:<Button asChild className="text-xl"><Link href="/sign-in" className="my-auto">Account</Link></Button>
      }



    </div>



   <div className="flex xl:hidden flex-col  align-middle justify-center">





   <Sheet>
  <SheetTrigger>
    <Image src={HamburgerIcon} width="40" height="40" alt="Hamburger Menu Icon"/>

  </SheetTrigger>
  <SheetContent className="overflow-y-scroll">
    <SheetHeader className="mb-8">
      <SheetTitle className="text-left mt-4">Credit Samdhan</SheetTitle>
      <SheetDescription className="text-left mb-8">
      We are dedicated microfinance institution empowering small businesses and promoting financial inclusion for all.
      </SheetDescription>

    </SheetHeader>

    <div className="mb-4">
    <HeaderAccountDetails/>
    </div>

    <MobileNavigation/>

  </SheetContent>
</Sheet>









    </div>

   </div>


   </div>

    </div>
  )
}

export default Header
