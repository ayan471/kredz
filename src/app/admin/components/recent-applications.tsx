import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getRecentLoanApplications() {
  const loanApplications = await prisma.loanApplication.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      fullName: true,
      amtRequired: true,
      status: true,
      createdAt: true,
    },
  });

  return loanApplications.map((app) => ({
    id: app.id,
    name: app.fullName,
    amount: `₹${app.amtRequired}`,
    status: app.status || "Pending",
    date: app.createdAt.toLocaleDateString(),
  }));
}

export async function RecentApplications() {
  const recentApplications = await getRecentLoanApplications();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recent Loan Applications</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentApplications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>{application.name}</TableCell>
              <TableCell>{application.amount}</TableCell>
              <TableCell>{application.status}</TableCell>
              <TableCell>{application.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
