"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
  X,
} from "lucide-react";
import { CreditBuilderSubscription } from "@prisma/client";

interface SidebarProps {
  subscription: CreditBuilderSubscription | null;
}

export function Sidebar({ subscription }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isOpen &&
        (event.target as HTMLElement).closest(".sidebar") === null
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  const isSubscriptionExpired =
    subscription && subscription.expiryDate
      ? new Date(subscription.expiryDate) < new Date()
      : true;

  const navigation = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/account", icon: User, label: "My Account" },
    { href: "/dashboard/loans", icon: FileText, label: "My Loans" },
    { href: "/dashboard/membership", icon: Star, label: "My Membership" },
    {
      href: "/dashboard/subscription",
      icon: BookOpen,
      label: "My Subscription",
    },
    {
      href: "/dashboard/credit-health",
      icon: Activity,
      label: "Credit Health Analysis",
      locked: isSubscriptionExpired,
    },
    { href: "#", icon: Users, label: "Channel Partner", comingSoon: true },
  ];

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-gray-800 text-white rounded-full shadow-lg"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div
        className={`sidebar fixed inset-y-0 left-0 z-20 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
          <h1 className="text-xl font-bold truncate">
            {user ? `${user.firstName}'s Dashboard` : "Dashboard"}
          </h1>
          <button
            className="md:hidden p-1 rounded-md hover:bg-gray-700"
            onClick={toggleSidebar}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="mt-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.href} className="px-4">
                {item.locked ? (
                  <span
                    className="flex items-center py-2 text-gray-500 cursor-not-allowed"
                    title="Subscription required"
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="ml-2 text-xs">(Locked)</span>
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.comingSoon && (
                      <span className="ml-2 px-2 py-1 text-xs font-semibold text-gray-800 bg-yellow-400 rounded-full">
                        Soon
                      </span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
