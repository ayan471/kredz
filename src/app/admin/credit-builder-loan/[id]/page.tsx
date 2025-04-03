import type React from "react";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadCSV } from "../download-csv";
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
  BanknoteIcon as Bank,
  CheckCircle2,
} from "lucide-react";
import { EditableInfoItem } from "./EditableInfoItem";
import { PDFDownloadButton } from "./PDFDownloadButton";

const prisma = new PrismaClient();

export default async function CreditBuilderLoanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const application = await prisma.creditBuilderLoanApplication.findUnique({
    where: { id: params.id },
    // If you need to explicitly select fields, you can uncomment and modify this:
    // select: {
    //   id: true,
    //   fullName: true,
    //   email: true,
    //   mobileNumber: true,
    //   loanAmountRequired: true,
    //   purpose: true,
    //   aadharNumber: true,
    //   panNumber: true,
    //   employmentType: true,
    //   age: true,
    //   hasSalarySlip: true,
    //   salaryReceiveMethod: true,
    //   hasIncomeTaxReturn: true,
    //   businessRegistration: true,
    //   EmpOthers: true,
    //   monthlyIncome: true,
    //   currentActiveEmis: true,
    //   accountNumber: true,
    //   bankName: true,
    //   ifscCode: true,
    //   createdAt: true,
    //   status: true,
    //   aadharFrontUrl: true,
    //   aadharBackUrl: true,
    //   panCardUrl: true,
    //   bankStatementUrl: true,
    //   eligibleAmount: true,
    //   fasterProcessingPaid: true,
    // }
  });

  if (!application) {
    notFound();
  }

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

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Credit Builder Loan Application Details
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
            <a href={`/admin/credit-builder-loan/${application.id}/edit`}>
              Edit
            </a>
          </Button>
          <DownloadCSV data={[application]} />
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
              label="Mobile Number"
              value={application.mobileNumber}
            />
            <InfoItem
              icon={<DollarSign className="h-5 w-5 text-gray-400" />}
              label="Loan Amount Required"
              value={application.loanAmountRequired}
            />
            <InfoItem
              icon={<FileText className="h-5 w-5 text-gray-400" />}
              label="Purpose of Loan"
              value={application.purpose}
            />
            <Separator />
            <InfoItem
              icon={<CreditCard className="h-5 w-5 text-gray-400" />}
              label="Aadhar Number"
              value={application.aadharNumber}
            />
            <InfoItem
              icon={<CreditCard className="h-5 w-5 text-gray-400" />}
              label="PAN Number"
              value={application.panNumber}
            />
            <InfoItem
              icon={<Briefcase className="h-5 w-5 text-gray-400" />}
              label="Employment Type"
              value={application.employmentType}
            />
            <InfoItem
              icon={<Calendar className="h-5 w-5 text-gray-400" />}
              label="Age"
              value={application.age}
            />

            {/* Employment-specific details based on employment type */}
            {application.employmentType === "Salaried" && (
              <>
                <InfoItem
                  icon={<FileText className="h-5 w-5 text-gray-400" />}
                  label="Has Salary Slip"
                  value={application.hasSalarySlip}
                />
                <InfoItem
                  icon={<Bank className="h-5 w-5 text-gray-400" />}
                  label="Salary Receive Method"
                  value={application.salaryReceiveMethod}
                />
              </>
            )}

            {application.employmentType === "Self Employed" && (
              <>
                <InfoItem
                  icon={<FileText className="h-5 w-5 text-gray-400" />}
                  label="Has Income Tax Return"
                  value={application.hasIncomeTaxReturn}
                />
                <InfoItem
                  icon={<Briefcase className="h-5 w-5 text-gray-400" />}
                  label="Business Registration"
                  value={application.businessRegistration}
                />
              </>
            )}

            {application.employmentType === "Others" && (
              <InfoItem
                icon={<Briefcase className="h-5 w-5 text-gray-400" />}
                label="Other Employment Details"
                value={application.employmentType}
              />
            )}
            <InfoItem
              icon={<DollarSign className="h-5 w-5 text-gray-400" />}
              label="Monthly Income"
              value={application.monthlyIncome}
            />
            <InfoItem
              icon={<DollarSign className="h-5 w-5 text-gray-400" />}
              label="Current Active EMIs"
              value={application.currentActiveEmis}
            />
            <EditableInfoItem
              icon={<Bank className="h-5 w-5 text-gray-400" />}
              label="Account Number"
              value={application.accountNumber || ""}
              field="accountNumber"
              loanId={application.id}
            />
            <EditableInfoItem
              icon={<Bank className="h-5 w-5 text-gray-400" />}
              label="Bank Name"
              value={application.bankName || ""}
              field="bankName"
              loanId={application.id}
            />
            <EditableInfoItem
              icon={<Bank className="h-5 w-5 text-gray-400" />}
              label="IFSC Code"
              value={application.ifscCode || ""}
              field="ifscCode"
              loanId={application.id}
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
                  src={application.aadharFrontUrl || "/placeholder.svg"}
                  alt="Aadhar Front"
                  filename="aadhar_front.jpg"
                />
                <ImageWithDownload
                  src={application.aadharBackUrl || "/placeholder.svg"}
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
                  src={application.panCardUrl || "/placeholder.svg"}
                  alt="PAN Card"
                  filename="pan_card.jpg"
                />
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Bank Statement</h3>
              {application.bankStatementUrl ? (
                <ImageWithDownload
                  src={application.bankStatementUrl || "/placeholder.svg"}
                  alt="Bank Statement"
                  filename="bank_statement.pdf"
                />
              ) : (
                <p className="text-gray-500 italic">
                  Bank statement not uploaded
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Loan Eligibility</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <InfoItem
            icon={<User className="h-5 w-5 text-gray-400" />}
            label="Email ID"
            value={application.email}
          />
          <InfoItem
            icon={<Calendar className="h-5 w-5 text-gray-400" />}
            label="EMI Tenure"
            value={application.emiTenure}
          />
          <InfoItem
            icon={<DollarSign className="h-5 w-5 text-gray-400" />}
            label="Eligible Amount"
            value={`₹${application.eligibleAmount?.toLocaleString() || "N/A"}`}
          />
          <InfoItem
            icon={<DollarSign className="h-5 w-5 text-gray-400" />}
            label="Credit Score"
            value={application.creditScore}
          />
          <InfoItem
            icon={<DollarSign className="h-5 w-5 text-gray-400" />}
            label="Current Active EMIs"
            value={application.currentActiveEmis}
          />
          <InfoItem
            icon={<DollarSign className="h-5 w-5 text-gray-400" />}
            label="Total Active Loans"
            value={application.currentActiveOverdues}
          />
          <InfoItem
            icon={<CheckCircle2 className="h-5 w-5 text-gray-400" />}
            label="Faster Processing Paid"
            value={application.fasterProcessingPaid}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export const dynamic = "force-dynamic";
