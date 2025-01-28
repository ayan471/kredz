import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

interface MobileNavigationProps {
  isLoggedIn: boolean;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isLoggedIn }) => {
  const getServiceLink = (path: string) => {
    return isLoggedIn ? path : "/sign-in";
  };

  return (
    <div className="text-left">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <p className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180">
            <Link href="/">Home</Link>
          </p>
        </AccordionItem>

        {isLoggedIn && (
          <AccordionItem value="item-dashboard">
            <p className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180">
              <Link href="/dashboard">Dashboard</Link>
            </p>
          </AccordionItem>
        )}

        <AccordionItem value="item-2">
          <p className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180">
            <Link href="/about">About</Link>
          </p>
        </AccordionItem>
        <AccordionItem value="item-2">
          <p className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180">
            <Link href="/services">Services</Link>
          </p>
        </AccordionItem>

        {/* <AccordionItem value="item-3">
          <AccordionTrigger>Services</AccordionTrigger>
          <AccordionContent>
            <ul className="text-md flex flex-col gap-4 text-slate-800 font-semibold">
              <li>
                <Link href={getServiceLink("/consultancy-application")}>
                  Personal Consultancy
                </Link>
              </li>
              <li>
                <Link href={getServiceLink("/credit-builder")}>
                  Credit Builder Plans
                </Link>
              </li>
              <li>
                Channel Partner
                <span className="text-xs border rounded-full px-2 py-1 ml-2">
                  Coming Soon
                </span>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem> */}

        <AccordionItem value="item-4">
          <p className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180">
            <Link href="/contact">Contact</Link>
          </p>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MobileNavigation;
