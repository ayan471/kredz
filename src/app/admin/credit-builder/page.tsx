import { PrismaClient } from "@prisma/client";
import { columns as subscriptionColumns } from "./subscription-columns";
import { DataTable } from "../data-table";
import { DownloadCSV } from "./download-csv";
import { DateRangeSelector } from "../credit-builder-loan/DateRangeSelector";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

async function getCreditBuilderSubscriptions(dateRange?: {
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

  return await prisma.creditBuilderSubscription.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function CreditBuilderPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const dateRange = searchParams.dateRange
    ? JSON.parse(searchParams.dateRange as string)
    : undefined;

  const subscriptions = await getCreditBuilderSubscriptions(dateRange);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold mb-8 text-blue-900">
            Credit Builder Dashboard
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <DateRangeSelector />
            <DownloadCSV data={subscriptions} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <DataTable columns={subscriptionColumns} data={subscriptions} />
        </div>
      </div>
    </div>
  );
}
