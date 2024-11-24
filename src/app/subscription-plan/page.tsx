import React from "react";
import InnerHeroOne from "@/components/custom/Global/InnerHeroOne";
import DetailCard from "./DetailCard";
import SubscriptionPlanForm from "./SubscriptionPlanForm";

const SubscriptionPlan = () => {
  return (
    <div className="min-h-[400px] flex flex-col my-12 mb-0">
      <InnerHeroOne
        bgImgUrl="/global/banners/orange-gradient.jpg"
        title="Subscription Plan"
        subtitle="Get Your upto 3X of monthly income"
        ctaText="Get A Subscription Plan"
      />

      <div className="flex flex-col justify-center xl:flex-row">
        <div className="flex flex-1 mx-auto px-[20px]  justify-center w-full py-8 ">
          <DetailCard />
        </div>

        <div className="flex  flex-1 mx-auto py-4 px-[20px] max-w-[620px] mt-8">
          <SubscriptionPlanForm />
        </div>

        <div className="flex flex-1 max-w-[620px] w-full  2xl:block"></div>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
