"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FasterProcessingSuccess() {
  const searchParams = useSearchParams();
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() => {
    // Get the application ID from the URL
    let appId = searchParams.get("applicationId");

    // If no application ID in URL, try to get from localStorage
    if (!appId) {
      appId = localStorage.getItem("lastFasterProcessingApplication");
      // Clear from localStorage after retrieving
      if (appId) {
        localStorage.removeItem("lastFasterProcessingApplication");
      }
    }

    if (appId) {
      setApplicationId(appId);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-green-500 border-2">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>
              Your faster processing fee has been received.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p>
              Thank you for your payment. Your loan application will now be
              processed on priority. You will receive updates on your registered
              email and phone number.
            </p>
            {applicationId && (
              <p className="mt-4 text-sm text-gray-500">
                Application ID: {applicationId}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Go to Dashboard
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
