import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { rejectLoan } from "@/actions/loanApplicationActions";
import { toast } from "@/components/ui/use-toast";

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Loan Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reason">Rejection Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for rejection"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Rejecting..." : "Reject Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
