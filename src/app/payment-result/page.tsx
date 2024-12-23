import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = auth();
  const status = searchParams.status as string;
  const transactionId = searchParams.transactionId as string;

  if (!userId) {
    redirect("/sign-in");
  }

  if (status === "SUCCESS") {
    redirect(`/dashboard?payment=pending&txnId=${transactionId || ""}`);
  } else {
    redirect(`/error?message=payment-failed&txnId=${transactionId || ""}`);
  }
}
