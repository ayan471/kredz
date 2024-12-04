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

type Application = {
  id: string;
  fullName: string;
  type: "Loan" | "Credit Builder";
  amount?: string;
  creditScore?: string;
  status: string;
  createdAt: Date;
};

async function getRecentApplications(): Promise<Application[]> {
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

  const creditBuilderApplications =
    await prisma.creditBuilderApplication.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        fullName: true,
        creditScore: true,
        createdAt: true,
      },
    });

  const allApplications: Application[] = [
    ...loanApplications.map((app) => ({
      id: app.id,
      fullName: app.fullName,
      type: "Loan" as const,
      amount: app.amtRequired,
      status: app.status || "Pending",
      createdAt: app.createdAt,
    })),
    ...creditBuilderApplications.map((app) => ({
      id: app.id,
      fullName: app.fullName,
      type: "Credit Builder" as const,
      creditScore: app.creditScore,
      status: "N/A",
      createdAt: app.createdAt,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return allApplications;
}

export async function RecentApplications() {
  const recentApplications = await getRecentApplications();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recent Applications</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount/Credit Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentApplications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>{application.fullName}</TableCell>
              <TableCell>{application.type}</TableCell>
              <TableCell>
                {application.type === "Loan"
                  ? application.amount
                  : application.creditScore}
              </TableCell>
              <TableCell>{application.status}</TableCell>
              <TableCell>
                {application.createdAt.toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
