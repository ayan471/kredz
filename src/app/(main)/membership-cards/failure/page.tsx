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

export default function MembershipFailure() {
  const searchParams = useSearchParams();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    // Get the clean ID from the URL
    const idParam = searchParams.get("id");
    if (idParam) {
      setId(idParam);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gray-800 border-red-500 border-2">
          <CardHeader className="text-center">
            <div className="mx-auto bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-white">
              Payment Failed
            </CardTitle>
            <CardDescription className="text-gray-300">
              We couldn't process your membership payment.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-gray-300">
            <p>
              There was an issue processing your payment. This could be due to
              insufficient funds, incorrect card details, or a temporary issue
              with the payment gateway.
            </p>
            {id && (
              <p className="mt-4 text-sm text-gray-400">Transaction ID: {id}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Link href="/membership">
              <Button
                variant="outline"
                className="border-gray-500 text-white hover:bg-gray-700"
              >
                Try Again
              </Button>
            </Link>
            <Link href="/support">
              <Button className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 hover:from-orange-600 hover:via-pink-600 hover:to-purple-700">
                Contact Support
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
