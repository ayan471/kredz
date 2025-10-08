import { ChevronDown } from "lucide-react";

export function FAQ() {
  const faqs = [
    {
      question: "Will checking my rate affect my credit score?",
      answer:
        "No. We use a soft inquiry to show you pre‑qualified options. Accepting an offer may involve a hard pull.",
    },
    {
      question: "How fast can I get funded?",
      answer:
        "Many customers receive funds within 24–48 hours after approval and verification.",
    },
    {
      question: "Are there any fees?",
      answer:
        "No hidden fees. We don't charge prepayment penalties. Any origination costs are disclosed upfront.",
    },
    {
      question: "What loan amounts and terms are available?",
      answer:
        "Borrow from $1,000 to $50,000 with terms from 12 to 60 months, subject to credit approval.",
    },
  ];

  return (
    <section id="faq" className="py-14 sm:py-16 border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl tracking-tight font-semibold">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-slate-600">
            Everything you need to know about eligibility, rates, and
            repayments.
          </p>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-5">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-2xl border border-slate-200 bg-white p-5 open:border-blue-400/40 transition-colors"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <span className="font-medium text-slate-900">
                  {faq.question}
                </span>
                <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-3 text-sm text-slate-700">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
