import type React from "react";
import { DollarSign } from "lucide-react";
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
  FileText,
  CreditCard,
  Briefcase,
  Calendar,
  BanknoteIcon as Bank,
  Cake,
  Mail,
  Clock,
} from "lucide-react";
import { EditableInfoItem } from "./EditableInfoItem";
import { PDFDownloadButton } from "./PDFDownloadButton";

interface ApplicationData {
  eligibleAmount?: number;
  emiTenure?: number;
  accountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  eMandate?: boolean;
  id?: string;
}

interface Application {
  eligibleAmount: number;
  fullName: string;
  email: string;
  phoneNo: string;
  age: number;
  dateOfBirth: Date;
  amtRequired: string;
  prpseOfLoan: string;
  aadharNo: string;
  panNo: string;
  empType: string;
  monIncome: string;
  currEmis: string;
  totalActiveLoans: number;
  creditScore: number;
  createdAt: Date;
  aadharImgFrontUrl: string;
  aadharImgBackUrl: string;
  panImgFrontUrl: string;
  selfieImgUrl: string;
  bankStatmntImgUrl: string;
  status: string;
  id: string;
  userId: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  eMandate: boolean;
  eligibility: any;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined;
}

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

  // Debug logging (this will show in your server console)
  console.log("Application ID:", application.id);
  console.log("User ID:", application.userId);
  console.log("Application Data:", applicationData);
  console.log("EMI Tenure from applicationData:", applicationData?.emiTenure);
  console.log(
    "EMI Tenure from eligibility:",
    application.eligibility?.emiTenure
  );
  console.log("Eligible Amount from application:", application.eligibleAmount);
  console.log(
    "Eligible Amount from applicationData:",
    applicationData?.eligibleAmount
  );

  // Get EMI tenure from multiple sources
  const emiTenure =
    applicationData?.emiTenure || application.eligibility?.emiTenure || null;

  // Get eligible amount from stored data (same as la-step-three.tsx)
  const eligibleAmount = applicationData?.eligibleAmount || null;
  const requestedAmount = applicationData?.amtRequired
    ? Number.parseFloat(applicationData.amtRequired)
    : null;

  console.log("Eligible Amount from stored data:", eligibleAmount);
  console.log("Requested Amount from stored data:", requestedAmount);

  console.log("Final EMI Tenure:", emiTenure);

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
              src={src || "/placeholder.svg"}
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

  // Format currency function
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "N/A";
    return `₹${amount.toLocaleString("en-IN")}`;
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

      {/* Eligible Amount Card - Highlighted */}
      <Card className="mb-6 border-green-200 bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-green-800">
            Loan Eligibility Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <p className="text-sm text-gray-500">Requested Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(Number.parseFloat(application.amtRequired))}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <p className="text-sm text-gray-500">Eligible Amount</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(eligibleAmount)}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <p className="text-sm text-gray-500">EMI Tenure</p>
              <p className="text-2xl font-bold text-gray-900">
                {emiTenure ? `${emiTenure} months` : "N/A"}
              </p>
            </div>
          </div>
          {requestedAmount && eligibleAmount && (
            <div className="mt-4 p-3 rounded-lg border">
              {requestedAmount > eligibleAmount ? (
                <div className="bg-yellow-50 border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Eligible amount is lower than
                    requested amount.
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Great!</strong> Eligible for full requested amount.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              label="Email"
              value={application.email}
            />
            <InfoItem
              icon={<Phone className="h-5 w-5 text-gray-400" />}
              label="Phone Number"
              value={application.phoneNo}
            />
            <InfoItem
              icon={<Cake className="h-5 w-5 text-gray-400" />}
              label="Age"
              value={application.age}
            />
            <InfoItem
              icon={<Cake className="h-5 w-5 text-gray-400" />}
              label="Date of birth"
              value={
                application.dateOfBirth
                  ? application.dateOfBirth.toLocaleDateString()
                  : "N/A"
              }
            />
            <InfoItem
              icon={<DollarSign className="h-5 w-5 text-gray-400" />}
              label="Amount Required"
              value={formatCurrency(Number.parseFloat(application.amtRequired))}
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
              value={formatCurrency(Number.parseFloat(application.monIncome))}
            />
            <InfoItem
              icon={<DollarSign className="h-5 w-5 text-gray-400" />}
              label="Eligible Amount"
              value={formatCurrency(eligibleAmount)}
            />
            <InfoItem
              icon={<DollarSign className="h-5 w-5 text-gray-400" />}
              label="Current EMIs"
              value={
                application.currEmis
                  ? formatCurrency(Number.parseFloat(application.currEmis))
                  : "N/A"
              }
            />
            <InfoItem
              icon={<DollarSign className="h-5 w-5 text-gray-400" />}
              label="Total Active Loans"
              value={application.totalActiveLoans}
            />
            <InfoItem
              icon={<DollarSign className="h-5 w-5 text-gray-400" />}
              label="Credit Score"
              value={application.creditScore}
            />

            {/* Add EMI Tenure here in the main section */}
            <InfoItem
              icon={<Clock className="h-5 w-5 text-gray-400" />}
              label="EMI Tenure"
              value={emiTenure ? `${emiTenure} months` : "N/A"}
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
                  src={application.aadharImgFrontUrl || "/placeholder.svg"}
                  alt="Aadhar Front"
                  filename="aadhar_front.jpg"
                />
                <ImageWithDownload
                  src={application.aadharImgBackUrl || "/placeholder.svg"}
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
                  src={application.panImgFrontUrl || "/placeholder.svg"}
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
                  src={application.selfieImgUrl || "/placeholder.svg"}
                  alt="Selfie"
                  filename="selfie.jpg"
                />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Bank Statement</h3>
                {application.bankStatmntImgUrl ? (
                  <ImageWithDownload
                    src={application.bankStatmntImgUrl || "/placeholder.svg"}
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
              value={emiTenure ? `${emiTenure} months` : "N/A"}
            />
            <InfoItem
              icon={<DollarSign className="h-5 w-5 text-gray-400" />}
              label="Loan Eligibility"
              value={formatCurrency(application.eligibility.loanEligibility)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
