"use client";

import {
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useEffect, useState } from "react";

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2024);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="flex-1">
            <a href="/" className="inline-flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-900 grid place-items-center ring-1 ring-slate-200">
                <span className="text-xs font-semibold tracking-tight">Kz</span>
              </div>
              <span className="text-base font-medium tracking-tight text-slate-900">
                Kredz
              </span>
            </a>
            <p className="mt-3 text-sm text-slate-600 max-w-sm">
              Kredz Loans is a financial technology company, not a bank. Banking
              services provided by partner institutions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
            <div>
              <div className="font-medium text-slate-900">Company</div>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href="/about-us"
                    className="text-slate-600 hover:text-blue-600"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-slate-600 hover:text-blue-600">
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-slate-600 hover:text-blue-600"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-slate-900">Resources</div>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href="/refund"
                    className="text-slate-600 hover:text-blue-600"
                  >
                    Refund & Cancellation Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/disclaimer"
                    className="text-slate-600 hover:text-blue-600"
                  >
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-slate-900">Legal</div>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-slate-600 hover:text-blue-600"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms-of-use"
                    className="text-slate-600 hover:text-blue-600"
                  >
                    Terms Of Use
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-slate-900">Contact</div>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href="tel:+917724034238"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600"
                    aria-label="Call +91 77240 34238"
                  >
                    <Phone className="h-4 w-4" />
                    +91 77240 34238
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+918120950068"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600"
                    aria-label="Call +91 81209 50068"
                  >
                    <Phone className="h-4 w-4" />
                    +91 81209 50068
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/918068213011"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600"
                    aria-label="WhatsApp +91 8068213011"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    +91 8068213011
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@kredz.in"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600"
                    aria-label="Email support at kredz.in"
                  >
                    <Mail className="h-4 w-4" />
                    support@kredz.in
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} Kredz. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[
              {
                icon: Instagram,
                href: "https://www.instagram.com/kredz.in?igsh=MTdnYTIwd2IyOG5zdQ==",
              },
              {
                icon: Youtube,
                href: "https://youtube.com/@kredzcredit?si=wM5z5v5unh4xxHUg",
              },
              {
                icon: Facebook,
                href: "https://www.facebook.com/share/187jupHMLF/",
              },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 text-slate-600 hover:border-blue-400/40 hover:text-blue-600 transition-colors"
              >
                <social.icon className="w-4.5 h-4.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
