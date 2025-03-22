"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CreditBuilderForm from "@/components/custom/Services/CreditBuilder/CreditBuilderForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const CreditBuilderFormPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the plan from URL parameters or localStorage
    const planFromUrl = searchParams.get("plan");
    const planFromStorage = localStorage.getItem("selectedCreditBuilderPlan");

    const plan = planFromUrl || planFromStorage;

    if (!plan) {
      toast({
        title: "No Plan Selected",
        description: "Please select a plan before proceeding to the form.",
        variant: "destructive",
      });
      router.push("/credit-builder-plan");
      return;
    }

    // Clear any previously stored transaction IDs to avoid duplicates
    localStorage.removeItem("creditBuilderTxnId");

    setSelectedPlan(plan);
    setIsLoading(false);
  }, [searchParams, router, toast]);

  const handleBackToPlans = () => {
    router.push("/credit-builder-plan");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center text-orange-600"
          onClick={handleBackToPlans}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plans
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <div className="flex items-center">
                <Package className="h-6 w-6 mr-2" />
                <CardTitle>Complete Your Credit Builder Application</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700">
                  Selected Plan:{" "}
                  <span className="text-orange-600">{selectedPlan}</span>
                </h2>
                <p className="text-gray-600 mt-2">
                  Please complete the form below to finalize your application
                  for the selected plan.
                </p>
              </div>

              <CreditBuilderForm selectedPlan={selectedPlan} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CreditBuilderFormPage;
