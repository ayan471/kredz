import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const prisma = new PrismaClient();

export default async function LoanApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const application = await prisma.loanApplication.findUnique({
    where: { id: params.id },
    include: { eligibility: true },
  });

  if (!application) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Loan Application Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>{application.fullName}&apos;s Loan Application</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">User ID</h3>
              <p>{application.userId}</p>
            </div>
            <div>
              <h3 className="font-semibold">Full Name</h3>
              <p>{application.fullName}</p>
            </div>
            <div>
              <h3 className="font-semibold">Phone Number</h3>
              <p>{application.phoneNo}</p>
            </div>
            <div>
              <h3 className="font-semibold">Amount Required</h3>
              <p>{application.amtRequired}</p>
            </div>
            <div>
              <h3 className="font-semibold">Purpose of Loan</h3>
              <p>{application.prpseOfLoan}</p>
            </div>
            <div>
              <h3 className="font-semibold">Aadhar Number</h3>
              <p>{application.aadharNo}</p>
            </div>
            <div>
              <h3 className="font-semibold">PAN Number</h3>
              <p>{application.panNo}</p>
            </div>
            <div>
              <h3 className="font-semibold">Credit Score</h3>
              <p>{application.creditScore}</p>
            </div>
            <div>
              <h3 className="font-semibold">Employment Type</h3>
              <p>{application.empType}</p>
            </div>
            <div>
              <h3 className="font-semibold">Monthly Income</h3>
              <p>{application.monIncome}</p>
            </div>
            <div>
              <h3 className="font-semibold">Current EMIs</h3>
              <p>{application.currEmis || "N/A"}</p>
            </div>
            <div>
              <h3 className="font-semibold">Application Status</h3>
              <p>{application.status}</p>
            </div>
            <div>
              <h3 className="font-semibold">Application Date</h3>
              <p>{application.createdAt.toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Aadhar Image</h3>
            <img
              src={application.aadharImg}
              alt="Aadhar"
              className="mt-2 max-w-full h-auto"
            />
          </div>
          <div>
            <h3 className="font-semibold">PAN Image</h3>
            <img
              src={application.panImg}
              alt="PAN"
              className="mt-2 max-w-full h-auto"
            />
          </div>
          <div>
            <h3 className="font-semibold">Selfie Image</h3>
            <img
              src={application.selfieImg}
              alt="Selfie"
              className="mt-2 max-w-full h-auto"
            />
          </div>
          <div>
            <h3 className="font-semibold">Bank Statement Image</h3>
            <img
              src={application.bankStatmntImg}
              alt="Bank Statement"
              className="mt-2 max-w-full h-auto"
            />
          </div>
          {application.eligibility && (
            <div>
              <h3 className="font-semibold text-lg mt-4">Loan Eligibility</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <h4 className="font-semibold">Email ID</h4>
                  <p>{application.eligibility.emailID}</p>
                </div>
                <div>
                  <h4 className="font-semibold">EMI Tenure</h4>
                  <p>{application.eligibility.emiTenure}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export const dynamic = "force-dynamic";
