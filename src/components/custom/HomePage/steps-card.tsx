"use client";

import {
  Sparkles,
  Edit3,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Lock,
  FileText,
  Check,
} from "lucide-react";

export function StepsCard() {
  return (
    <div className="relative max-w-xl mx-auto">
      <div
        className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-blue-600/20 opacity-60 blur-3xl animate-pulse"
        style={{ animationDuration: "4s" }}
      />

      <div className="relative rounded-3xl border border-slate-200/80 bg-white shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="relative p-4 sm:p-8 pb-4 sm:pb-6 bg-gradient-to-br from-blue-50 via-white to-white border-b border-slate-100">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-white grid place-items-center shadow-lg shadow-blue-500/30">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Get Started
                </h3>
                <p className="text-xs text-blue-600 font-medium mt-0.5">
                  3 simple steps
                </p>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-100 rounded-full px-3 py-1.5 shadow-sm">
              No credit impact
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Complete these simple steps to check your offer with no impact to
            your credit score.
          </p>
        </div>

        <div className="p-4 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                icon: Edit3,
                title: "Tell us about yourself",
                desc: "Share basic information — no hard credit pull required.",
                number: "01",
              },
              {
                icon: Sliders,
                title: "Choose your terms",
                desc: "Compare options and find the best monthly payment for you.",
                number: "02",
              },
              {
                icon: CheckCircle2,
                title: "Review and accept",
                desc: "Lock in your rate and receive funds quickly.",
                number: "03",
              },
            ].map((step, index) => (
              <div key={index} className="relative group">
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white grid place-items-center shadow-lg shadow-green-500/40 animate-check-pop z-10"
                  style={{
                    animationDelay: `${index * 0.8}s`,
                    animationFillMode: "backwards",
                  }}
                >
                  <Check
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                    strokeWidth={3}
                  />
                </div>

                <div className="relative h-full rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-4 sm:p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white grid place-items-center shadow-lg shadow-blue-500/30">
                      <step.icon
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        strokeWidth={2}
                      />
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold text-slate-200">
                      {step.number}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-2 leading-snug">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {index < 2 && (
                  <div className="hidden sm:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                    <ArrowRight
                      className="w-5 h-5 text-blue-400"
                      strokeWidth={2.5}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {[
              {
                icon: ShieldCheck,
                text: "No hidden fees",
                subtext: "Transparent pricing",
              },
              {
                icon: Zap,
                text: "Fast decisions",
                subtext: "Get approved quickly",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 grid place-items-center ring-1 ring-blue-200/50">
                    <item.icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {item.text}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {item.subtext}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <a
            href="#apply"
            className="group relative inline-flex w-full justify-center items-center rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold hover:shadow-2xl hover:shadow-blue-600/30 active:scale-[0.98] transition-all overflow-hidden"
          >
            <span className="relative z-10">Start your application</span>
            <ArrowRight className="w-5 h-5 ml-2 relative z-10 transition-transform group-hover:translate-x-1" />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]" />
          </a>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-slate-500 mt-5">
            <div className="inline-flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-100 grid place-items-center">
                <Lock className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <span className="font-medium">Bank-level security</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-100 grid place-items-center">
                <FileText className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <span className="font-medium">Soft credit check</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes check-pop {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          60% {
            transform: scale(1.15) rotate(10deg);
          }
          80% {
            transform: scale(0.95) rotate(-5deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        .animate-check-pop {
          animation: check-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
