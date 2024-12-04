"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  CreditBuilderApplication,
  CreditBuilderSubscription,
} from "@prisma/client";
import { Button } from "@/components/ui/button";
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
import { formatCurrency } from "@/components/lib/utils";

export const applicationColumns: ColumnDef<CreditBuilderApplication>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "phoneNo",
    header: "Phone Number",
  },
  {
    accessorKey: "creditScore",
    header: "Credit Score",
  },
  {
    accessorKey: "currEmis",
    header: "Current EMIs",
  },
  {
    accessorKey: "createdAt",
    header: "Application Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
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
              <Link
                href={`/admin/credit-builder/application/${application.id}`}
              >
                View details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Approve application</DropdownMenuItem>
            <DropdownMenuItem>Reject application</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const subscriptionColumns: ColumnDef<CreditBuilderSubscription>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "phoneNo",
    header: "Phone Number",
  },
  {
    accessorKey: "plan",
    header: "Subscription Plan",
  },
  {
    accessorKey: "createdAt",
    header: "Subscription Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
];
