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
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FasterProcessingFailure() {
  const searchParams = useSearchParams();
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() => {
    // Get the application ID from the URL
    const appId = searchParams.get("applicationId");
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
        <Card className="border-red-500 border-2">
          <CardHeader className="text-center">
            <div className="mx-auto bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Payment Failed</CardTitle>
            <CardDescription>
              We couldn't process your instant processing payment.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p>
              There was an issue processing your payment. This could be due to
              insufficient funds, incorrect card details, or a temporary issue
              with the payment gateway.
            </p>
            <p className="mt-4">
              Don't worry, your loan application will still be processed, but it
              may take the standard processing time.
            </p>
            {applicationId && (
              <p className="mt-4 text-sm text-gray-500">
                Application ID: {applicationId}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            {applicationId ? (
              <Link href={`/contact`}>
                <Button variant="outline">Contact Support</Button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button variant="outline">Go to Dashboard</Button>
              </Link>
            )}
            <Link href="/support">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Contact Support
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
