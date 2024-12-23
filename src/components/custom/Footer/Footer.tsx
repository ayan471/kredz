import React from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import BottomAccordionDesktop from "./BottomAccordionDesktop";
import BottomAccordionMobile from "./BottomAccordionMobile";
import LastBarLeft from "./LastBarLeft";
import LastBarRight from "./LastBarRight";
import { Youtube } from "lucide-react";

const Footer = () => {
  return (
    <>
      <div className=" sm:bg-white border-b-[10px] border-slate-300 w-full  min-h-[90px] flex flex-col justify-around px-4 sm:px-6 pt-12 pb-8 sm:pt-12 sm:pb-4">
        <div className="max-w-[1800px] w-full mx-auto">
          <div className="flex flex-col sm:flex-row justify-between mb-12">
            <div className="mt-2 flex mb-4 sm:mb-0 justify-center sm:justify-start">
              <div>
                <p className="text-md mt-2 text-slate-600">© Kredz 2024</p>
              </div>
            </div>

            <p className="flex gap-2 justify-center sm:justify-end">
              {/*
              <Link href="https://x.com" className="flex flex-col align-middle justify-center">
                <Image src="/global/social/x.png" className="rounded max-w-[32px] sm:max-w-[40px]" alt="Social" width="40" height="40"/>
              </Link>
              */}

              <Link
                target="_blank"
                href="https://www.facebook.com/share/187jupHMLF/"
                className="flex flex-col align-middle justify-center"
              >
                <Image
                  src="/global/social/facebook.png"
                  className="rounded max-w-[32px] sm:max-w-[40px]"
                  alt="Social"
                  width="40"
                  height="40"
                />
              </Link>
              <Link
                target="_blank"
                href="https://www.instagram.com/kredz.in?igsh=MTdnYTIwd2IyOG5zdQ=="
                className="flex flex-col align-middle justify-center"
              >
                <Image
                  src="/global/social/instagram.png"
                  className="rounded max-w-[32px] sm:max-w-[40px]"
                  alt="Social"
                  width="40"
                  height="40"
                />
              </Link>
              <Link
                target="_blank"
                href="https://youtube.com/@kredzcredit?si=wM5z5v5unh4xxHUg"
                className="flex flex-col align-middle justify-center"
              >
                <Youtube size={30} />
              </Link>
            </p>
          </div>
          <Separator className="mb-12" />

          <div className="hidden xl:flex flex-row justify-between mb-12">
            <BottomAccordionDesktop />
          </div>
          <div className="flex xl:hidden flex-row justify-between mb-12 ">
            <BottomAccordionMobile />
          </div>

          <Separator className="mb-12" />

          <div className="flex flex-col sm:flex-row align-middle justify-between">
            <LastBarLeft />
            <LastBarRight />
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
