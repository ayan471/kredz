import { PrismaClient } from "@prisma/client";
import { columns, type LoanApplication } from "./columns";
import { DataTable } from "../data-table";
import { DownloadCSV } from "./download-csv";
import { DateRangeSelector } from "../credit-builder-loan/DateRangeSelector";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

async function getLoanApplications(dateRange?: {
  from: string;
  to: string;
}): Promise<LoanApplication[]> {
  const where = dateRange
    ? {
        createdAt: {
          gte: new Date(dateRange.from),
          lte: new Date(dateRange.to),
        },
      }
    : {};

  const applications = await prisma.loanApplication.findMany({
    where,
    select: {
      id: true,
      userId: true,
      fullName: true,
      phoneNo: true,
      amtRequired: true,
      approvedAmount: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      tenure: true,
      membershipActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return applications;
}

export default async function AdminLoansPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const dateRange = searchParams.dateRange
    ? JSON.parse(searchParams.dateRange as string)
    : undefined;

  const loanApplications = await getLoanApplications(dateRange);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
            Loan Applications
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
