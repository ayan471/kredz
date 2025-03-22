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

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    // Get the clean ID from the URL
    const idParam = searchParams.get("id");
    if (idParam) {
      setId(idParam);

      // Here you could fetch the application details using the ID
      // For example: fetchApplicationDetails(idParam);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto max-w-md p-6 flex items-center justify-center min-h-screen">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Your membership payment has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>
            Thank you for your payment. Your application is now being processed.
            You will receive updates on your registered email and phone number.
          </p>
          {id && (
            <p className="mt-4 text-sm text-gray-500">Application ID: {id}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
