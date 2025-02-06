import CreditBuilderLoanForm from "@/components/CreditBuilderLoan/credit-builder-loan-form";
import LoanApplicationHero from "@/components/custom/LoanApplicationHero";

const CreditBuilderLoan = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <LoanApplicationHero />
      <div className="container mx-auto px-4 py-12">
        <CreditBuilderLoanForm />
      </div>
    </div>
  );
};

export default CreditBuilderLoan;
