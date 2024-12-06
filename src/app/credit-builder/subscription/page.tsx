import InnerHeroOne from "@/components/custom/Global/InnerHeroOne";
import CbStepTwo from "@/components/custom/Services/CreditBuilder/CbStepTwo";

const CreditBuilderSubscription = () => {
  return (
    <div>
      <InnerHeroOne
        bgImgUrl="/global/banners/orange-gradient.jpg"
        title="Credit Builder Subscription"
        subtitle="Choose your plan to build your credit score!"
        ctaText=""
      />

      <div className="flex flex-col justify-center items-center xl:flex-row">
        <div className="flex flex-1 mx-auto py-4 px-[20px] max-w-[620px] mt-8">
          <CbStepTwo />
        </div>
      </div>
    </div>
  );
};

export default CreditBuilderSubscription;
