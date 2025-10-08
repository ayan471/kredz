import { Zap, Shield, CreditCard, Headphones, ArrowRight } from "lucide-react";
import { APRChart } from "./apr-chart";

export function RatesSection() {
  const whyUsFeatures = [
    {
      icon: Zap,
      title: "Fast, transparent approvals",
      description:
        "Pre‑qualified offers in minutes, no impact on your credit score.",
    },
    {
      icon: Shield,
      title: "No hidden fees",
      description:
        "Clear terms, no origination surprises, and no prepayment penalty.",
    },
    {
      icon: CreditCard,
      title: "Flexible terms",
      description:
        "Choose a plan that balances monthly affordability and total cost.",
    },
    {
      icon: Headphones,
      title: "Human support, always",
      description: "Talk to a specialist—no bots—whenever you need help.",
    },
  ];

  return (
    <section id="rates" className="py-12 sm:py-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl tracking-tight font-semibold">
                Today's rates
              </h3>
              <span className="text-[11px] sm:text-xs text-slate-600">
                Updated 5 min ago
              </span>
            </div>
            <div className="mt-4 sm:mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 sm:p-4">
                <div className="text-sm text-slate-700">Starting APR</div>
                <div className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                  7.49%
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
                <div className="text-sm text-slate-700">Avg. APR</div>
                <div className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                  9.12%
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
                <div className="text-sm text-slate-700">Max APR</div>
                <div className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                  22.99%
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-6">
              <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 overflow-hidden">
                <h4 className="text-sm font-medium text-slate-800">
                  Trend (last 12 months)
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Average personal loan APR
                </p>
                <div className="mt-3 h-40 sm:h-56 md:h-64 overflow-hidden">
                  <APRChart />
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-600">
                Your actual rate depends on credit profile, term, and loan
                amount.
              </p>
            </div>
          </div>

          {/* Why us */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl tracking-tight font-semibold">
              Why Kredz
            </h3>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              We designed borrowing that respects your time and protects your
              wallet.
            </p>
            <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4">
              {whyUsFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="group flex flex-col sm:flex-row sm:items-start items-center gap-3 sm:gap-4 rounded-xl border border-slate-200 p-3 sm:p-4 transition-colors hover:border-blue-400/40 text-center sm:text-left"
                >
                  <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 grid place-items-center ring-1 ring-blue-200 flex-shrink-0">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">
                      {feature.title}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="#apply"
                className="group inline-flex justify-center items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-3 text-sm font-medium hover:brightness-110 hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.99] transition-all ring-1 ring-slate-200 relative overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10">Check your offer</span>
                <ArrowRight className="w-4 h-4 ml-2 relative z-10 transition-transform group-hover:translate-x-0.5" />
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/20 skew-x-[-15deg] opacity-0 group-hover:opacity-100 transition duration-700 translate-x-[-20%] group-hover:translate-x-[220%]" />
              </a>
              <a
                href="#learn"
                className="inline-flex justify-center items-center rounded-lg border border-slate-200 bg-white text-slate-700 px-4 py-3 text-sm font-medium hover:border-blue-400/40 hover:text-blue-700 transition-all w-full sm:w-auto"
              >
                Compare rates
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
