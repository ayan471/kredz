"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { useRouter } from "next/navigation";
import { updateLoanStatus } from "@/actions/loanApplicationActions";

export type LoanStatus = "In Progress" | "Approved" | "Rejected";

export type LoanApplication = {
  id: string;
  userId: string;
  fullName: string;
  phoneNo: string;
  panNo: string;
  aadharNo: string;
  amtRequired: string;
  prpseOfLoan: string;
  creditScore: string | null;
  createdAt: Date;
  updatedAt: Date;
  status: LoanStatus | null;
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
    header: "Amount Required",
  },
  {
    accessorKey: "prpseOfLoan",
    header: "Purpose of Loan",
  },
  {
    accessorKey: "creditScore",
    header: "Credit Score",
  },
  {
    accessorKey: "createdAt",
    header: "Application Date",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "status",
    header: "Loan Status",
    cell: ({ row }) => {
      const router = useRouter();
      const loanApplication = row.original;
      const [status, setStatus] = useState<LoanStatus>(
        (loanApplication.status as LoanStatus) || "In Progress"
      );

      const statusColors: Record<LoanStatus, string> = {
        "In Progress": "bg-yellow-200 text-yellow-800",
        Approved: "bg-green-200 text-green-800",
        Rejected: "bg-red-200 text-red-800",
      };

      const handleStatusChange = async (newStatus: LoanStatus) => {
        const result = await updateLoanStatus(loanApplication.id, newStatus);
        if (result.success) {
          setStatus(newStatus);
          router.refresh();
        } else {
          console.error("Failed to update status:", result.error);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 px-2 py-1">
              <Badge className={statusColors[status]}>{status}</Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleStatusChange("In Progress")}>
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("Approved")}>
              Approved
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("Rejected")}>
              Rejected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const application = row.original;

      const handleStatusChange = async (newStatus: LoanStatus) => {
        const result = await updateLoanStatus(application.id, newStatus);
        if (result.success) {
          router.refresh();
        } else {
          console.error("Failed to update status:", result.error);
        }
      };

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
              onClick={() => navigator.clipboard.writeText(application.id)}
            >
              Copy application ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("Approved")}>
              Approve application
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("Rejected")}>
              Reject application
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
