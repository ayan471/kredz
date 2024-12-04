import { formatCurrency } from "@/components/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Loan {
  id: string;
  fullName: string;
  amtRequired: string;
  createdAt: Date;
}

interface RejectedLoansProps {
  loans: Loan[];
}

export function RejectedLoans({ loans }: RejectedLoansProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Rejected Loans</CardTitle>
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
                {new Date(loan.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
