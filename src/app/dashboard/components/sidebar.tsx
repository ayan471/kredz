"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Home,
  CreditCard,
  FileText,
  User,
  Wallet,
  Star,
  BookOpen,
  Activity,
  Users,
  Menu,
} from "lucide-react";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-20 p-2 bg-gray-800 text-white rounded"
        onClick={toggleSidebar}
      >
        <Menu />
      </button>
      <div
        className={`flex flex-col w-[340px] bg-gray-800 text-white fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out z-10`}
      >
        <div className="flex items-center justify-center h-20 shadow-md">
          <h1 className="text-3xl font-bold">
            {user ? `${user.firstName}'s Dashboard` : "Dashboard"}
          </h1>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="flex flex-col py-4">
            {[
              { href: "/dashboard", icon: Home, label: "Dashboard" },
              { href: "/dashboard/account", icon: User, label: "My Account" },
              { href: "/dashboard/loans", icon: FileText, label: "My Loans" },
              {
                href: "/dashboard/membership",
                icon: Star,
                label: "My Membership",
              },
              {
                href: "/dashboard/subscription",
                icon: BookOpen,
                label: "My Subscription",
              },
              {
                href: "/dashboard/credit-health",
                icon: Activity,
                label: "Credit Health Analysis",
              },
              {
                href: "#",
                icon: Users,
                label: "Channel Partner",
                comingSoon: true,
              },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                    <item.icon />
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.comingSoon && (
                    <span className="ml-2 px-2 py-1 text-xs font-semibold text-gray-800 bg-yellow-400 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
