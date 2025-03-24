"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  UserCheck,
  CreditCard,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { makeUserEligible } from "@/actions/creditBuilderLoanActions";
import { ApprovalModal } from "./components/approval-modal";
import { EMIModal } from "./components/emi-modal";
import { RejectedModal } from "./components/rejected-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type CreditBuilderLoanApplication = {
  id: string;
  userId: string;
  fullName: string;
  mobileNumber: string;
  loanAmountRequired: number;
  eligibleAmount: number | null;
  emiTenure: number | null;
  amtRequired?: string;
  approvedAmount: number | null;
  createdAt: Date;
  updatedAt: Date;
  status: string | null;
  tenure: number | null;
  fasterProcessingPaid?: boolean; // New field for faster processing payment status
};

export const columns: ColumnDef<CreditBuilderLoanApplication>[] = [
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
    accessorKey: "mobileNumber",
    header: "Mobile Number",
  },
  {
    accessorKey: "loanAmountRequired",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Loan Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("loanAmountRequired"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "eligibleAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Eligible Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("eligibleAmount") as number | null;
      const formatted = amount
        ? new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(amount)
        : "N/A";
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.getValue("status") as string) || "In Progress";
      return (
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center justify-center min-w-[120px] px-4 py-2 rounded-full text-sm font-medium ${
              status === "Incomplete"
                ? "bg-gray-200 text-gray-800"
                : status === "In Progress"
                  ? "bg-blue-200 text-blue-800"
                  : status === "Approved"
                    ? "bg-green-200 text-green-800"
                    : status === "Eligible"
                      ? "bg-yellow-200 text-yellow-800"
                      : status === "Rejected"
                        ? "bg-red-200 text-red-800"
                        : "bg-blue-200 text-blue-800"
            }`}
          >
            {status}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "fasterProcessingPaid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Faster Processing
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPaid = row.getValue("fasterProcessingPaid") as boolean;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex justify-center">
                {isPaid ? (
                  <div className="flex items-center text-green-600">
                    <Zap className="h-5 w-5 mr-1" />
                    <span className="font-medium">Paid</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <XCircle className="h-5 w-5 mr-1" />
                    <span className="font-medium">Not Paid</span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {isPaid
                ? "Customer has paid ₹118 for faster processing"
                : "Customer has not paid for faster processing"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
          Application Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "emiTenure",
    header: "EMI Tenure",
    cell: ({ row }) => {
      const tenure = row.getValue("emiTenure");
      return tenure ? `${tenure} months` : "N/A";
    },
  },
  {
    id: "actions",
    cell: function ActionCell({ row }) {
      const application = row.original;
      const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
      const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false);
      const [isEMIModalOpen, setIsEMIModalOpen] = useState(false);

      const handleOpenEMIModal = () => {
        setIsEMIModalOpen(true);
      };

      const handleCloseEMIModal = () => {
        setIsEMIModalOpen(false);
      };

      return (
        <>
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
                onClick={() => navigator.clipboard.writeText(application.id)}
              >
                Copy application ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/credit-builder-loan/${application.id}`}>
                  View details
                </Link>
              </DropdownMenuItem>
              {application.status === "Approved" ? (
                <>
                  <DropdownMenuItem onClick={handleOpenEMIModal}>
                    <CreditCard className="mr-2 h-4 w-4 text-blue-600" />
                    Manage EMI
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => makeUserEligible(application.id)}
                  >
                    <UserCheck className="mr-2 h-4 w-4 text-yellow-600" />
                    Make Eligible Again
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem
                    onClick={() => setIsApprovalModalOpen(true)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                    Approve application
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsRejectedModalOpen(true)}
                  >
                    <XCircle className="mr-2 h-4 w-4 text-red-600" />
                    Reject application
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem
                onClick={() => makeUserEligible(application.id)}
              >
                <UserCheck className="mr-2 h-4 w-4 text-yellow-600" />
                Make eligible
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Modals */}
          <ApprovalModal
            isOpen={isApprovalModalOpen}
            onClose={() => setIsApprovalModalOpen(false)}
            applicationId={application.id}
          />
          <RejectedModal
            isOpen={isRejectedModalOpen}
            onClose={() => setIsRejectedModalOpen(false)}
            applicationId={application.id}
          />
          <EMIModal
            isOpen={isEMIModalOpen}
            onClose={handleCloseEMIModal}
            application={{
              ...application,
              tenure: application.emiTenure || 0,
            }}
          />
        </>
      );
    },
  },
];
