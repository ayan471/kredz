"use client";

import { useState, useEffect } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { DataTable } from "../../data-table";

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
};

const columns: ColumnDef<ContactSubmission>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const message = row.getValue("message") as string;
      return <div className="max-w-xs truncate">{message}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Submitted",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return <div>{formatDistanceToNow(date, { addSuffix: true })}</div>;
    },
  },
];

export function ContactSubmissionsTable({
  initialSubmissions,
}: {
  initialSubmissions: ContactSubmission[];
}) {
  const [submissions, setSubmissions] =
    useState<ContactSubmission[]>(initialSubmissions);

  return <DataTable columns={columns} data={submissions} />;
}
