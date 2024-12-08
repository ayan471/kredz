import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadCSV } from "./download-csv";

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

  const ImageWithDownload = ({
    src,
    alt,
    filename,
  }: {
    src: string | null;
    alt: string;
    filename: string;
  }) => {
    if (!src) {
      return <p>No image available</p>;
    }

    return (
      <div className="mt-2">
        <div className="relative w-full h-48">
          <Image
            src={src}
            alt={alt}
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <Button asChild className="mt-2">
          <a href={src} download={filename}>
            Download {alt}
          </a>
        </Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Loan Application Details</h1>
        <DownloadCSV data={application} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{application.fullName}&apos;s Loan Application</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Aadhar Image (Front)</h3>
              <ImageWithDownload
                src={application.aadharImgFrontUrl}
                alt="Aadhar Front"
                filename="aadhar_front.jpg"
              />
            </div>
            <div>
              <h3 className="font-semibold">Aadhar Image (Back)</h3>
              <ImageWithDownload
                src={application.aadharImgBackUrl}
                alt="Aadhar Back"
                filename="aadhar_back.jpg"
              />
            </div>
            <div>
              <h3 className="font-semibold">PAN Image (Front)</h3>
              <ImageWithDownload
                src={application.panImgFrontUrl}
                alt="PAN Front"
                filename="pan_front.jpg"
              />
            </div>
            <div>
              <h3 className="font-semibold">PAN Image (Back)</h3>
              <ImageWithDownload
                src={application.panImgBackUrl}
                alt="PAN Back"
                filename="pan_back.jpg"
              />
            </div>
            <div>
              <h3 className="font-semibold">Selfie Image</h3>
              <ImageWithDownload
                src={application.selfieImgUrl}
                alt="Selfie"
                filename="selfie.jpg"
              />
            </div>
            <div>
              <h3 className="font-semibold">Bank Statement Image</h3>
              <ImageWithDownload
                src={application.bankStatmntImgUrl}
                alt="Bank Statement"
                filename="bank_statement.jpg"
              />
            </div>
          </div>
          {application.eligibility && (
            <div>
              <h3 className="font-semibold text-lg mt-4">Loan Eligibility</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
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
