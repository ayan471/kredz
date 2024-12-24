import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { orderId: string; timestamp: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your payment has been processed successfully.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Order ID: {searchParams.orderId}
          </p>
        </div>
      </div>
    </div>
  );
}
