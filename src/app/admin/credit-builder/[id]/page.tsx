import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const prisma = new PrismaClient();

export default async function CreditBuilderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const application = await prisma.creditBuilderApplication.findUnique({
    where: { id: params.id },
  });

  if (!application) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        Credit Builder Application Details
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>{application.fullName}&apos;s Application</CardTitle>
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
              <h3 className="font-semibold">Credit Score</h3>
              <p>{application.creditScore}</p>
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
              <h3 className="font-semibold">Current EMIs</h3>
              <p>{application.currEmis}</p>
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
        </CardContent>
      </Card>
    </div>
  );
}

export const dynamic = "force-dynamic";
