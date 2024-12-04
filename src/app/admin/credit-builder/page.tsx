import { PrismaClient } from "@prisma/client";
import { columns as applicationColumns } from "./application-columns";
import { columns as subscriptionColumns } from "./subscription-columns";
import { DataTable } from "../data-table";

const prisma = new PrismaClient();

async function getCreditBuilderApplications() {
  return await prisma.creditBuilderApplication.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getCreditBuilderSubscriptions() {
  return await prisma.creditBuilderSubscription.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function CreditBuilderPage() {
  const applications = await getCreditBuilderApplications();
  const subscriptions = await getCreditBuilderSubscriptions();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Credit Builder Dashboard</h1>

      <DataTable columns={subscriptionColumns} data={subscriptions} />
    </div>
  );
}
