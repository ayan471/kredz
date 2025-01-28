import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { CreditBuilderLoanEditForm } from "./CreditBuilderLoanEditForm";

const prisma = new PrismaClient();

export default async function EditCreditBuilderLoanPage({
  params,
}: {
  params: { id: string };
}) {
  const application = await prisma.creditBuilderLoanApplication.findUnique({
    where: { id: params.id },
  });

  if (!application) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">
        Edit Credit Builder Loan Application
      </h1>
      <CreditBuilderLoanEditForm application={application} />
    </div>
  );
}

export const dynamic = "force-dynamic";
