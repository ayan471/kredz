import { PiggyBank, Home, Briefcase, Check } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: PiggyBank,
      title: "Debt consolidation",
      description:
        "Combine high‑interest balances into a single low monthly payment.",
      benefits: ["Fixed rates", "No prepayment fees"],
    },
    {
      icon: Home,
      title: "Home improvement",
      description:
        "Upgrade your space with predictable payments and flexible terms.",
      benefits: ["Fund in 24–48h", "₹1k–₹50k"],
    },
    {
      icon: Briefcase,
      title: "Big purchases",
      description: "Finance life's essentials without the credit card crunch.",
      benefits: ["Transparent fees", "Early payoff savings"],
    },
  ];

  return (
    <section id="products" className="py-14 sm:py-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl tracking-tight font-semibold">
            Borrow for what matters
          </h2>
          <p className="mt-2 text-slate-600">
            Personal loans that fit your life—transparent terms and no
            surprises.
          </p>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1.5 hover:shadow-lg hover:border-blue-400/40 overflow-hidden"
            >
              <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-200/0 group-hover:ring-slate-200/60 transition" />
              <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-slate-400/20 to-transparent skew-x-[-15deg] translate-x-[-30%] group-hover:translate-x-[220%] transition-transform duration-700" />
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 grid place-items-center ring-1 ring-blue-200">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 text-xl tracking-tight font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {feature.description}
              </p>
              <ul className="mt-4 text-sm text-slate-700 space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
