import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PaymentSuccessPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl transform transition-all hover:scale-105">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-xl text-gray-600">
            Thank you for your purchase.
          </p>
          <div className="mt-8 space-y-6">
            <p className="text-sm text-gray-500">
              Your transaction has been completed.
            </p>
            <Button
              asChild
              className="w-full py-3 px-4 text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-md shadow-md hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
