"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { updateApplicationData } from "@/actions/formActions";

interface ApplicationData {
  id: string;
  fullName: string | null;
  email: string | null;
  phoneNo: string | null;
  aadharNo: string | null;
  panNo: string | null;
  creditScore: number | null;
  step: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export function EditApplicationForm({
  applicationData,
}: {
  applicationData: ApplicationData;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: applicationData.fullName || "",
    email: applicationData.email || "",
    phoneNo: applicationData.phoneNo || "",
    aadharNo: applicationData.aadharNo || "",
    panNo: applicationData.panNo || "",
    creditScore: applicationData.creditScore || "",
    step: applicationData.step,
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "creditScore" || name === "step" ? Number(value) || "" : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateApplicationData(applicationData.id, {
        fullName: formData.fullName || undefined,
        email: formData.email || undefined,
        phoneNo: formData.phoneNo || undefined,
        aadharNo: formData.aadharNo || undefined,
        panNo: formData.panNo || undefined,
        creditScore: formData.creditScore
          ? Number(formData.creditScore)
          : undefined,
        step: Number(formData.step),
      });

      if (result.success) {
        toast({
          title: "Application Updated",
          description:
            "The application details have been successfully updated.",
        });
        setIsOpen(false);
        router.refresh();
      } else {
        toast({
          title: "Update Failed",
          description: result.error || "Failed to update application details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating application:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Pencil className="h-4 w-4" />
          Edit Application
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Application Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNo">Phone Number</Label>
              <Input
                id="phoneNo"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                placeholder="Phone Number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aadharNo">Aadhar Number</Label>
              <Input
                id="aadharNo"
                name="aadharNo"
                value={formData.aadharNo}
                onChange={handleChange}
                placeholder="Aadhar Number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="panNo">PAN Number</Label>
              <Input
                id="panNo"
                name="panNo"
                value={formData.panNo}
                onChange={handleChange}
                placeholder="PAN Number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="creditScore">Credit Score</Label>
              <Input
                id="creditScore"
                name="creditScore"
                type="number"
                min="300"
                max="900"
                value={formData.creditScore}
                onChange={handleChange}
                placeholder="Credit Score"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="step">Current Step</Label>
              <Input
                id="step"
                name="step"
                type="number"
                min="1"
                value={formData.step}
                onChange={handleChange}
                placeholder="Current Step"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
