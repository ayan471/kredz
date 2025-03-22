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
import { CheckCircle, CreditCard } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MembershipSuccess() {
  const searchParams = useSearchParams();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    // Get the clean ID from the URL
    const idParam = searchParams.get("id");
    if (idParam) {
      setId(idParam);

      // Here you could fetch the membership details using the ID
      // For example: fetchMembershipDetails(idParam);
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
        <Card className="bg-gray-800 border-green-500 border-2">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-white">
              Membership Activated!
            </CardTitle>
            <CardDescription className="text-gray-300">
              Your premium membership has been successfully activated.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-gray-300">
            <p>
              Thank you for joining Kredz Premium Membership. Your account has
              been upgraded and you now have access to all the premium features.
            </p>
            {id && (
              <p className="mt-4 text-sm text-gray-400">Transaction ID: {id}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 hover:from-orange-600 hover:via-pink-600 hover:to-purple-700">
                <CreditCard className="w-5 h-5 mr-2" />
                View Membership
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
