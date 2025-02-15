import { PrismaClient } from "@prisma/client";
import { columns } from "./columns";
import { DownloadCSV } from "./download-csv";
import { DataTable } from "../data-table";
import { DateRangeSelector } from "./DateRangeSelector";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

async function getCreditBuilderLoanApplications(dateRange?: {
  from: string;
  to: string;
}) {
  const where = dateRange
    ? {
        createdAt: {
          gte: new Date(dateRange.from),
          lte: new Date(dateRange.to),
        },
      }
    : {};

  const applications = await prisma.creditBuilderLoanApplication.findMany({
    where,
    select: {
      id: true,
      userId: true,
      fullName: true,
      mobileNumber: true,
      loanAmountRequired: true,
      eligibleAmount: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      emiTenure: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return applications;
}

export default async function AdminCreditBuilderLoansPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const dateRange = searchParams.dateRange
    ? JSON.parse(searchParams.dateRange as string)
    : undefined;

  const loanApplications = await getCreditBuilderLoanApplications(dateRange);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
            Credit Builder Loan Applications
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <DateRangeSelector />
            <DownloadCSV data={loanApplications} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
          <DataTable columns={columns} data={loanApplications} />
        </div>
      </div>
    </div>
  );
}
