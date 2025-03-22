"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // We don't clear the plan from localStorage here so the user can try again

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-red-500 border-2">
          <CardHeader className="bg-red-500 text-white text-center">
            <CardTitle className="text-2xl flex justify-center items-center">
              <AlertCircle className="mr-2 h-6 w-6" />
              Payment Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
              Payment Unsuccessful
            </h2>

            <p className="text-center text-gray-600 mb-6">
              We couldn't process your payment. This could be due to
              insufficient funds, incorrect card details, or a temporary issue
              with the payment gateway.
            </p>

            <div className="space-y-4">
              <Link href="/credit-builder/form">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Try Again
                </Button>
              </Link>

              <Link href="/credit-builder">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Plans
                </Button>
              </Link>

              <Link href="/support">
                <Button variant="ghost" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
