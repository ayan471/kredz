import React from "react";
import Image from "next/image";
import MainNavigation from "./mainNavigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MobileSheet from "./MobileSheet";
import { currentUser } from "@clerk/nextjs/server";
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
              <Button asChild className="text-xl bg-blue-600 hover:bg-blue-800">
                <Link href="/sign-in" className="my-auto">
                  Account
                </Link>
              </Button>
            )}
          </div>
          <MobileSheet isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </div>
  );
};

export default Header;
