"use client";

import type React from "react";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  Home,
  FileText,
  User,
  Star,
  BookOpen,
  Activity,
  Users,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import type { CreditBuilderSubscription } from "@prisma/client";

// Update the NavigationItem interface to ensure all properties are properly defined
interface NavigationItem {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  comingSoon?: boolean;
  locked?: boolean;
}

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

  // Update the hasActiveSubscription check to be more direct and explicit
  const hasActiveSubscription =
    subscription !== null && subscription.isActive === true;

  // Add more detailed logging to help debug the issue
  console.log("Sidebar subscription check:", {
    exists: !!subscription,
    isActive: subscription?.isActive,
    expiryDate: subscription?.expiryDate,
    hasActiveSubscription,
    subscriptionObject: subscription,
  });

  // Update the navigation array to use the simplified check
  const navigation: NavigationItem[] = [
    { href: "/", icon: ArrowLeft, label: "Back to Home" },
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/account", icon: User, label: "My Account" },
    { href: "/dashboard/loans", icon: FileText, label: "My Loans" },
    {
      href: "/dashboard/credit-builder-loan",
      icon: FileText,
      label: "Credit Builder Loans",
    },
    { href: "/dashboard/membership", icon: Star, label: "My Membership" },
  ];

  // Only add subscription and credit health links if hasActiveSubscription is true
  if (hasActiveSubscription) {
    navigation.push(
      {
        href: "/dashboard/subscription",
        icon: BookOpen,
        label: "My Subscription",
      },
      {
        href: "/dashboard/credit-health",
        icon: Activity,
        label: "Credit Health Analysis",
      }
    );
  }

  // Add the channel partner link at the end
  navigation.push({
    href: "#",
    icon: Users,
    label: "Channel Partner",
    comingSoon: true,
  });

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-blue-900 text-white rounded-full shadow-lg"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div
        className={`sidebar fixed inset-y-0 left-0 z-20 w-64 bg-blue-900 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-blue-950">
          <h1 className="text-xl font-bold truncate">
            {user ? `${user.firstName}'s Dashboard` : "Dashboard"}
          </h1>
          <button
            className="md:hidden p-1 rounded-md hover:bg-blue-800"
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
                    className="flex items-center py-2 text-gray-400 cursor-not-allowed"
                    title="Subscription required"
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="ml-2 text-xs">(Locked)</span>
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center py-2 text-blue-100 hover:text-white hover:bg-orange-500 rounded-md transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.comingSoon && (
                      <span className="ml-2 px-2 py-1 text-xs font-semibold text-blue-900 bg-orange-300 rounded-full">
                        Soon
                      </span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <UserButton afterSignOutUrl="/" />
        </div>
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
