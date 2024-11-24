import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const MobileNavigation = () => {
  return (
    <div className="text-left">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-3">
          <p className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180">
            <a href="/">Home</a>
          </p>
        </AccordionItem>

        <AccordionItem value="item-4">
          <p className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180">
            <a href="/contact">About</a>
          </p>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Services</AccordionTrigger>
          <AccordionContent>
            <ul className="text-md flex flex-col gap-4 text-slate-800 font-semibold">
              <Link href="/loan-application">
                <li>Loan Application</li>
              </Link>
              <li>Credit Builder Plans</li>
              <li>
                Channel Partner
                <span className="text-xs border rounded-full px-2 py-1 ml-2">
                  Coming Soon
                </span>
              </li>
              <li>
                Loan Consultancy
                <span className="text-xs border rounded-full px-2 py-1 ml-2">
                  Coming Soon
                </span>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <p className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180">
            <a href="/contact">Contact</a>
          </p>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MobileNavigation;
