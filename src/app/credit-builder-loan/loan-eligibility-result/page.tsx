"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { updateCreditBuilderLoanApplication } from "@/actions/creditBuilderLoanActions";
import { useToast } from "@/components/ui/use-toast";

export default function LoanEligibilityResult() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eligibleAmount = searchParams.get("eligibleAmount");
  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const applicationId = searchParams.get("applicationId");
  const customerName = searchParams.get("customerName") || "";
  const customerPhone = searchParams.get("customerPhone") || "";
  const customerEmail = searchParams.get("customerEmail") || "";
  const { toast } = useToast();

  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    emiTenure: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationId) {
      toast({
        title: "Error",
        description: "Application ID not found",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    Object.entries(bankDetails).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await updateCreditBuilderLoanApplication(
      applicationId,
      formData
    );

    if (result.success) {
      toast({
        title: "Success",
        description: "Bank details updated successfully",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update bank details",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/initiate-phonepe-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 118, // The fixed amount for faster processing
          orderId: `FASTER-${applicationId}`,
          customerName,
          customerPhone,
          customerEmail,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(data.paymentUrl);
      } else {
        throw new Error(data.error || "Failed to initiate payment");
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during payment initiation",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Loan Eligibility Result</CardTitle>
        </CardHeader>
        <CardContent>
          {status === "Approved" && (
            <>
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                Congratulations!
              </h2>
              <p className="mb-4">
                You are eligible for a pre-approved Credit Builder Loan of up to
                ₹{Number.parseInt(eligibleAmount || "0").toLocaleString()}.
              </p>
              <p className="mb-4">
                Please provide your bank details and select an EMI tenure to
                proceed.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    value={bankDetails.accountNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    value={bankDetails.bankName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    name="ifscCode"
                    value={bankDetails.ifscCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="emiTenure">EMI Tenure (in months)</Label>
                  <Input
                    id="emiTenure"
                    name="emiTenure"
                    type="number"
                    value={bankDetails.emiTenure}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Submit Bank Details
                </Button>
              </form>
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">
                  For faster processing, you can pay a fee of ₹118.
                </p>
                <Button
                  onClick={handlePayment}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? "Processing..."
                    : "Pay ₹118 for Faster Processing"}
                </Button>
              </div>
            </>
          )}
          {status === "Partially Approved" && (
            <>
              <h2 className="text-xl font-bold text-yellow-600 mb-4">
                Partially Approved
              </h2>
              <p className="mb-4">{message}</p>
            </>
          )}
          {status === "Rejected" && (
            <>
              <h2 className="text-xl font-bold text-red-600 mb-4">
                Application Status
              </h2>
              <p className="mb-4">
                {message ||
                  "Unfortunately, your loan application was not approved at this time."}
              </p>
            </>
          )}
          <Link href="/">
            <Button className="w-full mt-4">Back to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
