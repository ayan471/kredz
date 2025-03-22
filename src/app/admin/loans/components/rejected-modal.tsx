import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { rejectLoan } from "@/actions/loanApplicationActions";
import { toast } from "@/components/ui/use-toast";
import { XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RejectedModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
}

export function RejectedModal({
  isOpen,
  onClose,
  applicationId,
}: RejectedModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await rejectLoan(applicationId, reason);
      if (result.success) {
        toast({
          title: "Loan Rejected",
          description: "The loan application has been rejected successfully.",
        });
        onClose();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to reject loan:", error);
      toast({
        title: "Error",
        description: "Failed to reject the loan application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-orange-50 to-blue-50 max-h-[90vh] overflow-y-auto scrollbar-hide lg:scrollbar-default">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-950 flex items-center">
            <XCircle className="w-6 h-6 text-red-500 mr-2" />
            Reject Loan Application
          </DialogTitle>
          <DialogDescription className="text-orange-700">
            Please provide a reason for rejecting this loan application.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Label htmlFor="reason" className="text-blue-950 font-semibold">
                  Rejection Reason
                </Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter the reason for rejection"
                  required
                  className="border-orange-300 focus:border-orange-500 focus:ring-orange-500 min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              {isSubmitting ? "Rejecting..." : "Reject Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
