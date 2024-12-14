import InnerHeroOne from "@/components/custom/Global/InnerHeroOne";
import CbStepTwo from "@/components/custom/Services/CreditBuilder/CbStepTwo";

const CreditBuilderSubscription = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <InnerHeroOne
        bgImgUrl="/global/banners/orange-gradient.jpg"
        title="Credit Builder Subscription"
        subtitle="Choose your plan to build your credit score!"
        ctaText=""
      />

      <div className="container mx-auto px-4 py-12">
        <CbStepTwo />
      </div>
    </div>
  );
};

export default CreditBuilderSubscription;
