import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadCSV } from "./download-csv";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Phone,
  DollarSign,
  FileText,
  CreditCard,
  Briefcase,
  Calendar,
  Download,
  Camera,
  BanknoteIcon as Bank,
} from "lucide-react";
import { EditableInfoItem } from "./EditableInfoItem";
import { PDFDownloadButton } from "./PDFDownloadButton";

const prisma = new PrismaClient();

export default async function LoanApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const application = await prisma.loanApplication.findUnique({
    where: { id: params.id },
    include: {
      eligibility: true,
    },
  });

  if (!application) {
    notFound();
  }

  // Fetch the corresponding LoanApplicationData
  const applicationData = await prisma.loanApplicationData.findFirst({
    where: { userId: application.userId },
    orderBy: { createdAt: "desc" },
  });

  const InfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number | boolean | null | undefined;
  }) => (
    <div className="flex items-center space-x-2">
      {icon}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">
          {value === true ? "Yes" : value === false ? "No" : value || "N/A"}
        </p>
      </div>
    </div>
  );

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
      return <p className="text-gray-500 italic">No file available</p>;
    }

    const isPDF = filename.toLowerCase().endsWith(".pdf");

    return (
      <div className="mt-2 space-y-2">
        {isPDF ? (
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex flex-col items-center justify-center">
            <FileText className="h-16 w-16 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">{filename}</p>
          </div>
        ) : (
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={src}
              alt={alt}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="flex gap-2">
          {isPDF ? (
            <>
              <Button asChild variant="outline" size="sm" className="flex-1">
                <a href={src} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4" />
                  View PDF
                </a>
              </Button>
              <PDFDownloadButton url={src} filename={filename} isPDF={isPDF} />
            </>
          ) : (
            <PDFDownloadButton url={src} filename={filename} isPDF={isPDF} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Loan Application Details
          </h1>
          <p className="text-gray-500 mt-1">Application ID: {application.id}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge
            variant={
              application.status === "In Progress"
                ? "default"
                : application.status === "Approved"
                  ? "success"
                  : "destructive"
            }
          >
            {application.status}
          </Badge>
          <Button variant="outline" asChild>
            <a href={`/admin/loans/${application.id}/edit`}>Edit</a>
          </Button>
          <DownloadCSV data={application} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Applicant Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <InfoItem
              icon={<User className="h-5 w-5 text-gray-400" />}
              label="Full Name"
              value={application.fullName}
            />
            <InfoItem
              icon={<Phone className="h-5 w-5 text-gray-400" />}
              label="Phone Number"
              value={application.phoneNo}
            />
            <InfoItem
              icon={<DollarSign className="h-5 w-5 text-gray-400" />}
              label="Amount Required"
              value={application.amtRequired}
            />
            <InfoItem
              icon={<FileText className="h-5 w-5 text-gray-400" />}
              label="Purpose of Loan"
              value={application.prpseOfLoan}
            />
            <Separator />
            <InfoItem
              icon={<CreditCard className="h-5 w-5 text-gray-400" />}
              label="Aadhar Number"
              value={application.aadharNo}
            />
            <InfoItem
              icon={<CreditCard className="h-5 w-5 text-gray-400" />}
              label="PAN Number"
              value={application.panNo}
            />
            <InfoItem
              icon={<Briefcase className="h-5 w-5 text-gray-400" />}
              label="Employment Type"
              value={application.empType}
            />
            <InfoItem
              icon={<DollarSign className="h-5 w-5 text-gray-400" />}
              label="Monthly Income"
              value={application.monIncome}
            />
            <InfoItem
              icon={<DollarSign className="h-5 w-5 text-gray-400" />}
              label="Current EMIs"
              value={application.currEmis}
            />
            <EditableInfoItem
              icon={<Bank className="h-5 w-5 text-gray-400" />}
              label="Account Number"
              value={
                applicationData?.accountNumber ||
                application.accountNumber ||
                ""
              }
              field="accountNumber"
              loanId={applicationData?.id || application.id}
              modelType={
                applicationData ? "LoanApplicationData" : "LoanApplication"
              }
            />
            <EditableInfoItem
              icon={<Bank className="h-5 w-5 text-gray-400" />}
              label="Bank Name"
              value={applicationData?.bankName || application.bankName || ""}
              field="bankName"
              loanId={applicationData?.id || application.id}
              modelType={
                applicationData ? "LoanApplicationData" : "LoanApplication"
              }
            />
            <EditableInfoItem
              icon={<Bank className="h-5 w-5 text-gray-400" />}
              label="IFSC Code"
              value={applicationData?.ifscCode || application.ifscCode || ""}
              field="ifscCode"
              loanId={applicationData?.id || application.id}
              modelType={
                applicationData ? "LoanApplicationData" : "LoanApplication"
              }
            />
            <InfoItem
              icon={<Bank className="h-5 w-5 text-gray-400" />}
              label="E-Mandate"
              value={
                applicationData?.eMandate !== undefined
                  ? applicationData.eMandate
                  : application.eMandate
              }
            />
            <Separator />
            <InfoItem
              icon={<Calendar className="h-5 w-5 text-gray-400" />}
              label="Application Date"
              value={application.createdAt.toLocaleDateString()}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Document Verification</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div>
              <h3 className="font-semibold mb-2">Aadhar Card</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <ImageWithDownload
                  src={application.aadharImgFrontUrl}
                  alt="Aadhar Front"
                  filename="aadhar_front.jpg"
                />
                <ImageWithDownload
                  src={application.aadharImgBackUrl}
                  alt="Aadhar Back"
                  filename="aadhar_back.jpg"
                />
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">PAN Card</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <ImageWithDownload
                  src={application.panImgFrontUrl}
                  alt="PAN Front"
                  filename="pan_front.jpg"
                />
              </div>
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Selfie</h3>
                <ImageWithDownload
                  src={application.selfieImgUrl}
                  alt="Selfie"
                  filename="selfie.jpg"
                />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Bank Statement</h3>
                {application.bankStatmntImgUrl ? (
                  <ImageWithDownload
                    src={application.bankStatmntImgUrl}
                    alt="Bank Statement"
                    filename="bank_statement.pdf"
                  />
                ) : (
                  <p className="text-gray-500 italic">
                    Bank statement not uploaded
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {application.eligibility && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl">Loan Eligibility</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <InfoItem
              icon={<User className="h-5 w-5 text-gray-400" />}
              label="Email ID"
              value={application.eligibility.emailID}
            />
            <InfoItem
              icon={<Calendar className="h-5 w-5 text-gray-400" />}
              label="EMI Tenure"
              value={application.eligibility.emiTenure}
            />
            <InfoItem
              icon={<DollarSign className="h-5 w-5 text-gray-400" />}
              label="Loan Eligibility"
              value={`₹${application.eligibility.loanEligibility?.toLocaleString() || "N/A"}`}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
