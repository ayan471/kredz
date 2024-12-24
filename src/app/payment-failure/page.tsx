import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-400 to-pink-500">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl transform transition-all hover:scale-105">
        <div className="text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Error
          </h2>
          <p className="mt-2 text-xl text-gray-600">
            We couldn't process your payment.
          </p>
          <div className="mt-8 space-y-6">
            <p className="text-sm text-gray-500">
              We couldn't retrieve the necessary information to complete your
              transaction. Please check your payment details and try again.
            </p>
            <div className="space-y-4">
              <Button
                asChild
                variant="outline"
                className="w-full py-3 px-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Link href="/">Return to Homepage</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
