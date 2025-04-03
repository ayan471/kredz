import React from "react";
import {
  DollarSign,
  Clock,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

interface FeatureItemProps {
  icon: React.ReactElement<LucideIcon>;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
    <div className="flex-shrink-0 rounded-full bg-orange-500 p-2">
      {React.cloneElement(icon as React.ReactElement<any>, {
        className: "h-5 w-5 text-white",
      })}
    </div>
    <div>
      <h3 className="text-base font-medium">{title}</h3>
      <p className="text-xs text-orange-200">{description}</p>
    </div>
  </div>
);

const CreditBuilderLoanApplicationHero: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-orange-500 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Credit Builder Loan Application
            <span className="block text-orange-200 mt-1 text-xl sm:text-2xl">
              Simple. Fast. Secure.
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-orange-100">
            Start your journey towards financial empowerment with our
            streamlined process.
          </p>
        </div>

        <div className="mt-8 hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureItem
            icon={<DollarSign />}
            title="Best Rates"
            description="Competitive market rates"
          />
          <FeatureItem
            icon={<Clock />}
            title="Quick Approval"
            description="Decision within minutes"
          />
          <FeatureItem
            icon={<ShieldCheck />}
            title="Secure"
            description="Bank-level security"
          />
          <FeatureItem
            icon={<Users />}
            title="Support"
            description="Dedicated assistance"
          />
        </div>
      </div>
    </div>
  );
};

export default CreditBuilderLoanApplicationHero;
