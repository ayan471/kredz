import React from "react";
import Image from "next/image";
import MainNavigation from "./mainNavigation";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import HamburgerIcon from "./hamburger.webp";

import { Button } from "@/components/ui/button";
import MobileNavigation from "./MobileNavigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

const Header = async () => {
  const user = await currentUser();
  const isLoggedIn = !!user;

  return (
    <div className="max-w-[1920px] border-t-[10px] border-slate-400 fixed top-0 z-50 w-full bg-white min-h-[80px]">
      <div className="flex flex-row align-middle justify-between px-2 sm:px-6 py-2">
        <Link
          href="/"
          className="xl:min-w-[200px] flex flex-col align-start justify-center"
        >
          <Image
            src="/global/kredz-logo.png"
            width="600"
            height="420"
            alt="logo"
            className="max-w-[160px]"
          />
        </Link>

        <div className="hidden xl:flex">
          <MainNavigation />
        </div>

        <div className="flex flex-row gap-8 xl:min-w-[200px] justify-end">
          <div className="flex gap-4 flex-row align-middle justify-center">
            {isLoggedIn ? (
              <div className="max-h-[40px] my-auto">
                <UserButton />
              </div>
            ) : (
              <Button asChild className="text-xl">
                <Link href="/sign-in" className="my-auto">
                  Account
                </Link>
              </Button>
            )}
          </div>

          <div className="flex xl:hidden flex-col align-middle justify-center">
            <Sheet>
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
                    credit-building services, and strategic partnerships to help
                    you achieve your financial goals. We partner with
                    RBI-registered Banks and NBFCs to offer the best loan
                    options and tailored credit improvement strategies.
                  </SheetDescription>
                </SheetHeader>

                <div className="mb-4"></div>

                <MobileNavigation isLoggedIn={isLoggedIn} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
