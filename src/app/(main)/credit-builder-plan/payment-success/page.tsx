"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Clear any stored plan data since payment is complete
    localStorage.removeItem("selectedCreditBuilderPlan");

    // Get the transaction ID from the URL or localStorage
    const idFromUrl = searchParams.get("id");
    const idFromStorage =
      localStorage.getItem("creditBuilderTxnId") ||
      localStorage.getItem("lastSabpaisaTxnId");
    const userEmail = localStorage.getItem("lastPayerEmail");

    console.log("Payment success page - transaction IDs:", {
      idFromUrl,
      idFromStorage,
      userEmail,
      allParams: Object.fromEntries(searchParams.entries()),
    });

    // If we have a transaction ID in localStorage but not in the URL, try to update the URL
    if (!idFromUrl && idFromStorage) {
      console.log(
        "Updating URL with transaction ID from localStorage:",
        idFromStorage
      );
      router.replace(
        `/credit-builder-plan/payment-success?id=${idFromStorage}`
      );
    }

    // Send success notification email if we have an email address
    if (userEmail) {
      const txnId = idFromUrl || idFromStorage || `RECOVERY-${Date.now()}`;
      console.log("Sending success notification email to:", userEmail);

      fetch("/api/test-payment-email?email=" + encodeURIComponent(userEmail), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to send email notification");
          }
          return response.json();
        })
        .then((data) => console.log("Email notification sent:", data))
        .catch((error) =>
          console.error("Error sending email notification:", error)
        );
    }

    // Clear transaction IDs from localStorage after a delay
    setTimeout(() => {
      localStorage.removeItem("creditBuilderTxnId");
      localStorage.removeItem("lastSabpaisaTxnId");
      localStorage.removeItem("lastPayerEmail");
    }, 30000); // Clear after 30 seconds
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-green-500 border-2">
          <CardHeader className="bg-green-500 text-white text-center">
            <CardTitle className="text-2xl flex justify-center items-center">
              <CheckCircle className="mr-2 h-6 w-6" />
              Payment Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
              Thank You for Your Subscription!
            </h2>

            <p className="text-center text-gray-600 mb-6">
              Your Credit Builder plan has been activated successfully. We've
              sent the confirmation details to your registered email address.
            </p>

            <div className="space-y-4">
              <Link href="/dashboard">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
