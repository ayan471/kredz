import { PrismaClient } from "@prisma/client";
import { columns as subscriptionColumns } from "./subscription-columns";
import { DataTable } from "../data-table";
import { DownloadCSV } from "./download-csv";

const prisma = new PrismaClient();

async function getCreditBuilderSubscriptions() {
  return await prisma.creditBuilderSubscription.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function CreditBuilderPage() {
  const subscriptions = await getCreditBuilderSubscriptions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold mb-8 text-blue-900">
            Credit Builder Dashboard
          </h1>
          <DownloadCSV data={subscriptions} />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <DataTable columns={subscriptionColumns} data={subscriptions} />
        </div>
      </div>
    </div>
  );
}
