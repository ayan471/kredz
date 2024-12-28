"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  UserCheck,
  CreditCard,
} from "lucide-react";
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
  approveLoan,
  rejectLoan,
  getMembershipStatus,
  makeUserEligible,
} from "@/actions/loanApplicationActions";
import { ApprovalModal } from "./components/approval-modal";
import { EMIModal } from "./components/emi-modal";
import { RejectedModal } from "./components/rejected-modal";
import { Badge } from "@/components/ui/badge";

export type LoanApplication = {
  id: string;
  userId: string;
  fullName: string;
  phoneNo: string;
  amtRequired: string;
  approvedAmount: number | null;
  createdAt: Date;
  updatedAt: Date;
  status: string | null;
  tenure: number | null;
  membershipActive: boolean | null;
};

export const columns: ColumnDef<LoanApplication>[] = [
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
    header: "Phone Number",
  },
  {
    accessorKey: "amtRequired",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount Required
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amtRequired"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "approvedAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Approved Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("approvedAmount") as number | null;
      if (amount === null || amount === undefined) return "N/A";
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string | null;
      if (!status) return "N/A";
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            status === "Incomplete"
              ? "bg-gray-200 text-gray-800"
              : status === "In Progress"
                ? "bg-blue-200 text-blue-800"
                : status === "Approved"
                  ? "bg-green-200 text-green-800"
                  : status === "Eligible"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-red-200 text-red-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    header: "Membership",
    accessorKey: "membershipActive",
    cell: ({ row }) => {
      const [isActive, setIsActive] = useState<boolean | null>(null);

      useEffect(() => {
        const fetchMembershipStatus = async () => {
          const result = await getMembershipStatus(row.original.id);
          if (result.success) {
            setIsActive(result.membershipActive ?? false);
          } else {
            console.error("Failed to fetch membership status");
            setIsActive(false);
          }
        };

        fetchMembershipStatus();
      }, [row.original.id]);

      if (isActive === null) {
        return <span>Loading...</span>;
      }

      return (
        <Badge variant={isActive ? "success" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
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
    id: "actions",
    cell: ({ row }) => {
      const application = row.original;
      const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
      const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false);
      const [isEMIModalOpen, setIsEMIModalOpen] = useState(false);

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
                <Link href={`/admin/loans/${application.id}`}>
                  View details
                </Link>
              </DropdownMenuItem>
              {application.status === "Approved" ? (
                <>
                  <DropdownMenuItem onClick={() => setIsEMIModalOpen(true)}>
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
            onClose={() => setIsEMIModalOpen(false)}
            application={{
              ...application,
              tenure: application.tenure || 0,
            }}
          />
        </>
      );
    },
  },
];
