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
} from "lucide-react";

export function StepsCard() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-blue-500/15 via-blue-400/10 to-transparent opacity-70 blur-2xl animate-pulse"
        style={{ animationDuration: "3.5s" }}
      />
      <div className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-gradient-to-b from-white to-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg tracking-tight font-semibold text-slate-900">
              Get started in minutes
            </h3>
            <span className="inline-flex items-center text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-2 py-1">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              New
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1.5">
            A guided flow to check your offer with no impact to your score.
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <ol className="space-y-3">
            {[
              {
                icon: Edit3,
                title: "Tell us about yourself",
                desc: "Basic info only — no hard pull.",
              },
              {
                icon: Sliders,
                title: "Choose your terms",
                desc: "Compare monthly payments vs. total cost.",
              },
              {
                icon: CheckCircle2,
                title: "Review and accept",
                desc: "Lock your rate and get funded fast.",
              },
            ].map((step, index) => (
              <li
                key={index}
                className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="h-8 w-8 rounded-md bg-blue-50 text-blue-600 grid place-items-center ring-1 ring-blue-200">
                  <step.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    {step.title}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: ShieldCheck, text: "No hidden fees" },
              { icon: Zap, text: "Fast decisions" },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-white p-3 text-sm"
              >
                <div className="flex items-center gap-2 text-slate-700">
                  <item.icon className="w-4 h-4 text-blue-600" />
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          <a
            href="#apply"
            className="group inline-flex w-full justify-center items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-3 text-sm font-medium hover:brightness-110 hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.99] transition-all ring-1 ring-slate-200 relative overflow-hidden"
          >
            <span className="relative z-10">Start your application</span>
            <ArrowRight className="w-4 h-4 ml-2 relative z-10 transition-transform group-hover:translate-x-0.5" />
            <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/20 skew-x-[-15deg] opacity-0 group-hover:opacity-100 transition duration-700 translate-x-[-20%] group-hover:translate-x-[220%]" />
          </a>

          <div className="flex items-center justify-between text-[12px] text-slate-500">
            <div className="inline-flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              Bank‑level security
            </div>
            <div className="inline-flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Soft credit check
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
