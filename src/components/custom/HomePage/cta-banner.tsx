import { ArrowRight } from "lucide-react";

export function CTABanner() {
  return (
    <section id="apply" className="py-14 sm:py-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-600/10 via-blue-500/10 to-blue-400/10">
          <div
            className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-spin"
            style={{ animationDuration: "36s" }}
          />
          <div
            className="absolute -left-24 -bottom-24 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-spin"
            style={{ animationDuration: "48s", animationDirection: "reverse" }}
          />
          <div className="relative p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl sm:text-3xl tracking-tight font-semibold text-slate-900">
                Get your personalized rate in minutes
              </h3>
              <p className="mt-2 text-slate-700">
                No impact on your credit score. Unlock lower payments today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/services"
                className="group inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-3 text-sm font-medium hover:brightness-110 hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.99] transition-all ring-1 ring-slate-200 relative overflow-hidden"
              >
                <span className="relative z-10">Start application</span>
                <ArrowRight className="w-4 h-4 ml-2 relative z-10 transition-transform group-hover:translate-x-0.5" />
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/20 skew-x-[-15deg] opacity-0 group-hover:opacity-100 transition duration-700 translate-x-[-20%] group-hover:translate-x-[220%]" />
              </a>
              <a
                href="/services"
                className="inline-flex items-center rounded-lg border border-slate-200 bg-white text-slate-700 px-5 py-3 text-sm font-medium hover:border-blue-400/40 hover:text-blue-700 transition-all"
              >
                View Services
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
