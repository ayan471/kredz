import LoanApplicationHero from "@/components/custom/LoanApplicationHero";
import LaStepOne from "@/components/custom/Services/LoanApplication/LaStepOne";

const LoanApplication = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <LoanApplicationHero />
      <div className="container mx-auto px-4 py-12">
        <LaStepOne />
      </div>
    </div>
  );
};

export default LoanApplication;
