"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import HamburgerIcon from "./hamburger.webp";
import MobileNavigation from "./MobileNavigation";

interface MobileSheetProps {
  isLoggedIn: boolean;
}

const MobileSheet: React.FC<MobileSheetProps> = ({ isLoggedIn }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex xl:hidden flex-col align-middle justify-center">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src={HamburgerIcon}
            width="40"
            height="40"
            alt="Hamburger Menu Icon"
          />
        </SheetTrigger>
        <SheetContent className="overflow-y-scroll">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-left mt-4">Kredz</SheetTitle>
            <SheetDescription className="text-left mb-8">
              At Kredz, we combine expert loan consulting, innovative
              credit-building services, and strategic partnerships to help you
              achieve your financial goals. We partner with RBI-registered Banks
              and NBFCs to offer the best loan options and tailored credit
              improvement strategies.
            </SheetDescription>
          </SheetHeader>
          <div className="mb-4"></div>
          <MobileNavigation
            isLoggedIn={isLoggedIn}
            onNavigate={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileSheet;
