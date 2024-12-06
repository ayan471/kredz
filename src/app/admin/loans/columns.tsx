"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  UserCheck,
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
  makeUserEligible,
  rejectLoan,
} from "@/actions/loanApplicationActions";

export type LoanApplication = {
  id: string;
  userId: string;
  fullName: string;
  phoneNo: string;
  amtRequired: string;
  createdAt: Date;
  status: string | null;
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
    accessorKey: "createdAt",
    header: "Application Date",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const application = row.original;

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
            <DropdownMenuItem asChild>
              <Link href={`/admin/loans/${application.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => approveLoan(application.id)}>
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              Approve application
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => rejectLoan(application.id)}>
              <XCircle className="mr-2 h-4 w-4 text-red-600" />
              Reject application
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => makeUserEligible(application.id)}>
              <UserCheck className="mr-2 h-4 w-4 text-yellow-600" />
              Make eligible
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
