import type React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface RejectionMessageProps {
  reason: string;
}

export const RejectionMessage: React.FC<RejectionMessageProps> = ({
  reason,
}) => {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-[520px] text-center">
      <h2 className="text-2xl font-bold mb-4">Application Rejected</h2>
      <p className="mb-6">
        Sorry, currently you are not eligible for a personal loan due to:{" "}
        {reason}. You can try to check eligibility for a credit builder loan.
      </p>
      <Button onClick={() => router.push("/credit-builder-loan")}>
        Check Eligibility for Credit Builder Loan
      </Button>
    </div>
  );
};
