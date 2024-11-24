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

      <div className="flex flex-col justify-center xl:flex-row">
        <div className="flex flex-1 mx-auto px-[20px] justify-center w-full py-8 ">
          <DetailCard />
        </div>

        <div className="flex  flex-1 mx-auto py-4 px-[20px] max-w-[620px] mt-8">
          <LaStepTwo />
        </div>

        <div className="flex flex-1 max-w-[620px] w-full  2xl:block"></div>
      </div>
    </div>
  );
};

export default LoanApplication;
