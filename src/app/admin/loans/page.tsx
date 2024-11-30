import { PrismaClient } from "@prisma/client";

import { columns } from "./columns";
import { DataTable } from "../data-table";

export default async function LoansPage() {
  const prisma = new PrismaClient();
  const applications = await prisma.loanApplication.findMany();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Loan Applications</h1>
      <DataTable columns={columns} data={applications} />
    </div>
  );
}
