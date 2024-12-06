import React from "react";
import InnerHeroOne from "@/components/custom/Global/InnerHeroOne";
import DetailCard from "@/components/custom/Services/LoanApplication/DetailCard";
import LaStepOne from "@/components/custom/Services/LoanApplication/LaStepOne";

const LoanApplication = () => {
  return (
    <div>
      <InnerHeroOne
        bgImgUrl="/global/banners/orange-gradient.jpg"
        title="Loan Application"
        subtitle="We are happy to assist!"
        ctaText="Apply"
      />

      <div className="flex flex-col justify-center items-center xl:flex-row">
        <div className="flex  flex-1 mx-auto py-4 px-[20px] max-w-[620px] mt-8">
          <LaStepOne />
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;
