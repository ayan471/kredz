import { formatCurrency, formatDate } from "@/components/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Loan {
  id: string;
  fullName: string;
  amtRequired: string;
  createdAt: Date;
}

interface InProgressLoansProps {
  loans: Loan[];
}

export function InProgressLoans({ loans }: InProgressLoansProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>In Progress Loans</CardTitle>
        <CardDescription>Recent loan applications in progress.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {loans.map((loan) => (
            <div key={loan.id} className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {loan.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(parseFloat(loan.amtRequired))}
                </p>
              </div>
              <div className="ml-auto font-medium">
                {formatDate(loan.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
