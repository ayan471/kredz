"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreditBuilderSubscription } from "@prisma/client";

import { useRouter } from "next/navigation";
import { updateCreditHealth } from "@/actions/formActions";

export const columns: ColumnDef<CreditBuilderSubscription>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "phoneNo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "plan",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Subscription Plan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Subscription Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString();
    },
  },
  {
    id: "updateCreditHealth",
    header: "Update Credit Health",
    cell: ({ row }) => {
      const subscription = row.original;
      const [isUpdating, setIsUpdating] = useState(false);
      const [creditFactors, setCreditFactors] = useState({
        creditUtilizationRatio: 0,
        creditBehavior: 0,
        paymentHistory: 0,
        ageOfCredit: 0,
      });
      const [isOpen, setIsOpen] = useState(false); // Added isOpen state
      const router = useRouter();

      const handleUpdateCreditHealth = async () => {
        setIsUpdating(true);
        try {
          const result = await updateCreditHealth(
            subscription.id,
            creditFactors
          );
          if (result.success) {
            console.log("Credit health updated successfully");
            router.refresh();
            setIsOpen(false); // Close the dialog after successful update
          } else {
            console.error("Failed to update credit health:", result.error);
          }
        } catch (error) {
          console.error("Error updating credit health:", error);
        } finally {
          setIsUpdating(false);
        }
      };

      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          {" "}
          {/* Updated Dialog component */}
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setIsOpen(true)}>
              {" "}
              {/* Updated DialogTrigger */}
              Update Credit Health
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Credit Health</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <label
                  htmlFor="creditUtilizationRatio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Credit Utilization Ratio
                </label>
                <Input
                  id="creditUtilizationRatio"
                  type="number"
                  min="0"
                  max="100"
                  value={creditFactors.creditUtilizationRatio}
                  onChange={(e) =>
                    setCreditFactors({
                      ...creditFactors,
                      creditUtilizationRatio: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="creditBehavior"
                  className="block text-sm font-medium text-gray-700"
                >
                  Credit Behavior
                </label>
                <Input
                  id="creditBehavior"
                  type="number"
                  min="0"
                  max="100"
                  value={creditFactors.creditBehavior}
                  onChange={(e) =>
                    setCreditFactors({
                      ...creditFactors,
                      creditBehavior: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="paymentHistory"
                  className="block text-sm font-medium text-gray-700"
                >
                  Payment History
                </label>
                <Input
                  id="paymentHistory"
                  type="number"
                  min="0"
                  max="100"
                  value={creditFactors.paymentHistory}
                  onChange={(e) =>
                    setCreditFactors({
                      ...creditFactors,
                      paymentHistory: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="ageOfCredit"
                  className="block text-sm font-medium text-gray-700"
                >
                  Age of Credit
                </label>
                <Input
                  id="ageOfCredit"
                  type="number"
                  min="0"
                  max="100"
                  value={creditFactors.ageOfCredit}
                  onChange={(e) =>
                    setCreditFactors({
                      ...creditFactors,
                      ageOfCredit: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                {" "}
                {/* Updated Cancel button */}
                Cancel
              </Button>
              <Button onClick={handleUpdateCreditHealth} disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Confirm Update"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const subscription = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(subscription.id)}
            >
              Copy subscription ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/credit-builder/subscription/${subscription.id}`}
              >
                View details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
