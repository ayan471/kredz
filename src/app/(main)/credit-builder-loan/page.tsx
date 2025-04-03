import CreditBuilderLoanForm from "@/components/CreditBuilderLoan/credit-builder-loan-form";
import CreditBuilderLoanApplicationHero from "@/components/custom/CreditBuilderLoanApplicationHero";

const CreditBuilderLoan = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CreditBuilderLoanApplicationHero />
      <div className="container mx-auto px-4 py-12">
        <CreditBuilderLoanForm />
      </div>
    </div>
  );
};

export default CreditBuilderLoan;
