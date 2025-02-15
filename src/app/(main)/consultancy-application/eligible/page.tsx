import LoanApplicationStep2Hero from "@/components/custom/LoanApplicationStep2Hero";
import LaStepTwo from "@/components/custom/Services/LoanApplication/LaStepTwo";

const LoanApplicationStep2 = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <LoanApplicationStep2Hero />
      <div className="container mx-auto px-4 py-12">
        <LaStepTwo />
      </div>
    </div>
  );
};

export default LoanApplicationStep2;
