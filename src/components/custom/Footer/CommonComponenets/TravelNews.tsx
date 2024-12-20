import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TravelNews = () => {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-UrbanistLight tracking-wide">
        At Kredz, we combine expert loan consulting, innovative credit-building
        services, and strategic partnerships to help you achieve your financial
        goals. We partner with RBI-registered Banks and NBFCs to offer the best
        loan options and tailored credit improvement strategies.
      </p>
    </div>
  );
};

export default TravelNews;
