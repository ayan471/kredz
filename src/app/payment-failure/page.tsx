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

export default function PaymentFailure() {
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
    <div className="container mx-auto max-w-md p-6 flex items-center justify-center min-h-screen">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
          <CardDescription>
            We couldn't process your payment at this time.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>
            There was an issue processing your payment. This could be due to
            insufficient funds, incorrect card details, or a temporary issue
            with the payment gateway.
          </p>
          {id && (
            <p className="mt-4 text-sm text-gray-500">Application ID: {id}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          {id ? (
            <Link href={`/loan-application/step-three?id=${id}`}>
              <Button variant="outline">Try Again</Button>
            </Link>
          ) : (
            <Link href="/loan-application/step-three">
              <Button variant="outline">Try Again</Button>
            </Link>
          )}
          <Link href="/support">
            <Button>Contact Support</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
