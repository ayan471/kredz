import { PrismaClient } from "@prisma/client";

import { columns as subscriptionColumns } from "./subscription-columns";
import { DataTable } from "../data-table";

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
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Credit Builder Dashboard</h1>

      <h2 className="text-2xl font-semibold mb-4 mt-8">Subscriptions</h2>
      <DataTable columns={subscriptionColumns} data={subscriptions} />
    </div>
  );
}
