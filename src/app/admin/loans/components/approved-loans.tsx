import { formatCurrency } from "@/components/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Loan {
  id: string;
  fullName: string;
  amtRequired: string;
  createdAt: Date;
}

interface ApprovedLoansProps {
  loans: Loan[];
}

export function ApprovedLoans({ loans }: ApprovedLoansProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Approved Loans</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {loans.map((loan) => (
            <div
              key={loan.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {loan.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(parseFloat(loan.amtRequired))}
                </p>
              </div>
              <div className="text-sm font-medium mt-2 sm:mt-0">
                {new Date(loan.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
