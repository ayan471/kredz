import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import EditLoanApplicationForm from "./edit-form";
import { LoanApplication } from "@/types";

const prisma = new PrismaClient();

export default async function EditLoanApplicationPage({
  params,
}: {
  params: { id: string };
}) {
  const application = await prisma.loanApplication.findUnique({
    where: { id: params.id },
  });

  if (!application) {
    notFound();
  }

  // Convert Prisma model to LoanApplication type
  const loanApplication: LoanApplication = {
    ...application,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
    disbursementDate: application.disbursementDate,
    status: application.status as LoanApplication["status"],
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Edit Loan Application
      </h1>
      <EditLoanApplicationForm application={loanApplication} />
    </div>
  );
}

export const dynamic = "force-dynamic";
