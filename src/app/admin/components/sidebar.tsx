"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  CreditCard,
  FileText,
  MessageSquare,
  Menu,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    {
      href: "/admin/credit-builder",
      icon: CreditCard,
      label: "Credit Builder",
    },
    { href: "/admin/loans", icon: FileText, label: "Loans" },
    {
      href: "/admin/credit-builder-loan",
      icon: Banknote,
      label: "Credit Builder Loan",
    },
    {
      href: "/admin/contact-submissions",
      icon: MessageSquare,
      label: "Contact Submissions",
    },
  ];

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-orange-500 text-white hover:bg-orange-600"
        onClick={toggleMobileMenu}
      >
        <Menu className="h-4 w-4" />
      </Button>
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-blue-900 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
      `}
      >
        <div className="flex items-center justify-center h-16 shadow-md bg-orange-500">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        </div>
        <nav className="mt-5">
          <ul className="flex flex-col py-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-orange-100 hover:text-white hover:bg-orange-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-orange-300">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
