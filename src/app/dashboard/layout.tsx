import type React from "react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/components/lib/prisma";
import { Sidebar } from "./components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  // Add debug logging
  console.log("Dashboard layout - userId:", userId);

  // Replace the entire getUserSubscription call with this direct database query
  const subscription = userId
    ? await prisma.creditBuilderSubscription.findFirst({
        where: {
          userId,
          isActive: true, // Only get active subscriptions
        },
        orderBy: { createdAt: "desc" },
      })
    : null;

  // Add debug logging
  console.log("Dashboard layout - direct query result:", {
    exists: !!subscription,
    isActive: subscription?.isActive,
    plan: subscription?.plan,
    expiryDate: subscription?.expiryDate,
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar subscription={subscription} />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
