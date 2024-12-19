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
  <div className="flex items-center space-x-4">
    <div className="flex-shrink-0 rounded-full bg-orange-600 p-3">{icon}</div>
    <div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-1 text-sm text-orange-200">{description}</p>
    </div>
  </div>
);

const LoanApplicationHero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white overflow-hidden">
      <div className="absolute inset-0">
        <svg
          className="absolute right-0 bottom-0 h-64 w-64 text-orange-800 opacity-20 transform translate-x-1/3 translate-y-1/3"
          fill="currentColor"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 0 L100 0 L100 100 Z" />
        </svg>
      </div>
      <div className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
              <span className="block">Consultancy Application</span>
              <span className="block text-orange-200 mt-2">
                Simple. Fast. Secure.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-orange-100">
              Start your journey towards financial empowerment. Our streamlined
              process ensures quick decisions and competitive rates.
            </p>
          </div>
        </div>
      </div>
      <div className="relative bg-orange-800 bg-opacity-75 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureItem
              icon={<DollarSign className="h-8 w-8" />}
              title="Competitive Rates"
              description="We offer some of the best rates in the market"
            />
            <FeatureItem
              icon={<Clock className="h-8 w-8" />}
              title="Quick Approval"
              description="Get a decision within minutes, not days"
            />
            <FeatureItem
              icon={<ShieldCheck className="h-8 w-8" />}
              title="Secure Process"
              description="Your data is protected with bank-level security"
            />
            <FeatureItem
              icon={<Users className="h-8 w-8" />}
              title="Dedicated Support"
              description="Our team is here to help you every step of the way"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationHero;
