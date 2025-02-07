import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SuccessImage from "../../../../../public/images/success.png";

const SuccessPage = () => {
  return (
    <div className="min-h-[440px] flex flex-col text-center align-center justify-center">
      <Image
        className="m-auto max-w-[240px]"
        src={SuccessImage}
        alt="Success Image"
        width="520"
        height="520"
      />
      <p className="mb-4 text-xl max-w-[600px] mx-auto">
        Thank You for purchasing the Subscription our loan processing team will
        contact with you within 24hrs
      </p>
      <Link href="/dashboard">
        <Button className="max-w-min m-auto">Go To Dashboard</Button>
      </Link>
    </div>
  );
};

export default SuccessPage;
