import React from "react";
import InnerHeroOne from "@/components/custom/Global/InnerHeroOne";
import DetailCard from "@/components/custom/Services/LoanApplication/DetailCard";
import LaStepTwo from "@/components/custom/Services/LoanApplication/LaStepTwo";

const LoanApplication = () => {
  return (
    <div>
      <InnerHeroOne
        bgImgUrl="/global/banners/orange-gradient.jpg"
        title="Loan Application"
        subtitle="Step 2"
        ctaText="Apply"
      />

      <div className="flex flex-col justify-center items-center xl:flex-row">
        <div className="flex  flex-1 mx-auto py-4 px-[20px] max-w-[620px] mt-8">
          <LaStepTwo />
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;
