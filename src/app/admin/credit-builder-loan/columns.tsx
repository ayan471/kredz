"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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

export type CreditBuilderLoanApplication = {
  id: string;
  userId: string;
  fullName: string;
  mobileNumber: string;
  loanAmountRequired: number;
  eligibleAmount: number | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  emiTenure: number | null;
};

export const columns: ColumnDef<CreditBuilderLoanApplication>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name",
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
    header: "Eligible Amount",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("eligibleAmount"));
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
  },
  {
    accessorKey: "createdAt",
    header: "Application Date",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString();
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
    cell: ({ row }) => {
      const loan = row.original;

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
              onClick={() => navigator.clipboard.writeText(loan.id)}
            >
              Copy Loan ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/credit-builder-loan/${loan.id}`}>
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Update Status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
