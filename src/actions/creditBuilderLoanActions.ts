"use server";

import { PrismaClient, type Prisma } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const isPDF = file.type === "application/pdf";

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto",
        format: isPDF ? "pdf" : undefined,
        flags: isPDF ? "attachment" : undefined,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result!.secure_url);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

async function calculateEligibleAmount(salary: number): Promise<number> {
  if (salary <= 10000) return 37000;
  if (salary <= 23000) return 53000;
  if (salary <= 30000) return 67000;
  if (salary <= 37000) return 83000;
  if (salary <= 45000) return 108000;
  if (salary <= 55000) return 131000;
  if (salary <= 65000) return 178000;
  if (salary <= 75000) return 216000;
  if (salary <= 85000) return 256000;
  if (salary <= 95000) return 308000;
  if (salary <= 125000) return 376000;
  return 487000;
}

export async function saveCreditBuilderLoanApplication(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const data: Prisma.CreditBuilderLoanApplicationCreateInput = {
      userId: user.id,
      fullName: "",
      mobileNumber: "",
      dateOfBirth: new Date(),
      age: 0,
      address: "",
      loanAmountRequired: 0,
      purpose: "",
      aadharNumber: "",
      panNumber: "",
      employmentType: "",
      monthlyIncome: 0,
      creditScore: 0,
      currentActiveEmis: 0,
      currentActiveOverdues: 0,
      status: "In Progress",
      aadharFrontUrl: null,
      aadharBackUrl: null,
      panCardUrl: null,
      bankStatementUrl: null,
    };

    const fileUploads: Promise<void>[] = [];

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        fileUploads.push(
          uploadToCloudinary(value, "credit_builder_loan_applications").then(
            (url) => {
              if (key === "aadharFront") {
                data.aadharFrontUrl = url;
              } else if (key === "aadharBack") {
                data.aadharBackUrl = url;
              } else if (key === "panCard") {
                data.panCardUrl = url;
              } else if (key === "bankStatement") {
                data.bankStatementUrl = url;
              }
            }
          )
        );
      } else {
        switch (key) {
          case "fullName":
            data.fullName = value as string;
            break;
          case "mobileNumber":
            data.mobileNumber = value as string;
            break;
          case "dateOfBirth":
            data.dateOfBirth = new Date(value as string);
            break;
          case "age":
            data.age = Number.parseInt(value as string, 10);
            break;
          case "address":
            data.address = value as string;
            break;
          case "loanAmountRequired":
            data.loanAmountRequired = Number.parseInt(value as string, 10);
            break;
          case "purpose":
            data.purpose = value as string;
            break;
          case "aadharNumber":
            data.aadharNumber = value as string;
            break;
          case "panNumber":
            data.panNumber = value as string;
            break;
          case "employmentType":
            data.employmentType = value as string;
            break;
          case "monthlyIncome":
            data.monthlyIncome = Number.parseInt(value as string, 10);
            break;
          case "creditScore":
            data.creditScore = Number.parseInt(value as string, 10);
            break;
          case "currentActiveEmis":
            data.currentActiveEmis = Number.parseInt(value as string, 10);
            break;
          case "currentActiveOverdues":
            data.currentActiveOverdues = Number.parseInt(value as string, 10);
            break;
          case "status":
            data.status = value as string;
            break;
        }
      }
    }

    await Promise.all(fileUploads);

    const application = await prisma.creditBuilderLoanApplication.create({
      data: data,
    });

    console.log("Credit Builder Loan application created:", application);
    return { success: true, data: application };
  } catch (error) {
    console.error("Error submitting credit builder loan application:", error);
    return { success: false, error: "Failed to submit application" };
  }
}
export async function getCreditBuilderLoanApplication(userId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const rejectedApplication = await prisma.rejectedLoanApplication.findFirst({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNo: true,
        dateOfBirth: true,
        amtRequired: true,
        prpseOfLoan: true,
        aadharNo: true,
        panNo: true,
        creditScore: true,
        empType: true,
        EmpOthers: true,
        monIncomeRange: true,
        monIncome: true,
        currEmis: true,
        totalActiveLoans: true,
        rejectionReason: true,
        address: true,
        hasSalarySlip: true,
        salaryReceiveMethod: true,
        hasIncomeTaxReturn: true,
        businessRegistration: true,
      },
    });

    if (!rejectedApplication) {
      return { success: false, error: "No rejected application found" };
    }

    console.log("Fetched rejected application:", rejectedApplication);
    return { success: true, data: rejectedApplication };
  } catch (error) {
    console.error("Error fetching rejected loan application:", error);
    return { success: false, error: "Failed to fetch application data" };
  }
}

export async function updateCreditBuilderLoanApplication(
  id: string,
  formData: FormData
) {
  try {
    // First, check if the record exists
    const existingApplication =
      await prisma.creditBuilderLoanApplication.findUnique({
        where: { id },
      });

    if (!existingApplication) {
      console.log(`No application found with id: ${id}`);
      return { success: false, error: "Application not found" };
    }

    // If the record exists, proceed with the update
    const data: Prisma.CreditBuilderLoanApplicationUpdateInput = {};
    const fileUploads: Promise<void>[] = [];

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        fileUploads.push(
          uploadToCloudinary(value, "credit_builder_loan_applications").then(
            (url) => {
              if (key === "aadharFront") {
                data.aadharFrontUrl = url;
              } else if (key === "aadharBack") {
                data.aadharBackUrl = url;
              } else if (key === "panCard") {
                data.panCardUrl = url;
              } else if (key === "bankStatement") {
                data.bankStatementUrl = url;
              }
            }
          )
        );
      } else {
        switch (key) {
          case "fullName":
            data.fullName = value as string;
            break;
          case "mobileNumber":
            data.mobileNumber = value as string;
            break;
          case "dateOfBirth":
            data.dateOfBirth = new Date(value as string);
            break;
          case "age":
            data.age = Number.parseInt(value as string, 10);
            break;
          case "address":
            data.address = value as string;
            break;
          case "loanAmountRequired":
            data.loanAmountRequired = Number.parseInt(value as string, 10);
            break;
          case "purpose":
            data.purpose = value as string;
            break;
          case "aadharNumber":
            data.aadharNumber = value as string;
            break;
          case "panNumber":
            data.panNumber = value as string;
            break;
          case "employmentType":
            data.employmentType = value as string;
            break;
          case "monthlyIncome":
            data.monthlyIncome = Number.parseInt(value as string, 10);
            break;
          case "creditScore":
            data.creditScore = Number.parseInt(value as string, 10);
            break;
          case "currentActiveEmis":
            data.currentActiveEmis = Number.parseInt(value as string, 10);
            break;
          case "currentActiveOverdues":
            data.currentActiveOverdues = Number.parseInt(value as string, 10);
            break;
          case "status":
            data.status = value as string;
            break;
        }
      }
    }

    await Promise.all(fileUploads);

    const updatedApplication = await prisma.creditBuilderLoanApplication.update(
      {
        where: { id },
        data: data,
      }
    );

    console.log("Credit Builder Loan application updated:", updatedApplication);
    return { success: true, data: updatedApplication };
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      console.error(
        "Error updating credit builder loan application: Record not found"
      );
      return { success: false, error: "Application not found" };
    }
    console.error("Error updating credit builder loan application:", error);
    return { success: false, error: "Failed to update application data" };
  }
}

export async function checkEligibility(applicationId: string) {
  try {
    const application = await prisma.creditBuilderLoanApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return { success: false, error: "Application not found" };
    }

    const { monthlyIncome, loanAmountRequired } = application;

    if (
      typeof monthlyIncome !== "number" ||
      typeof loanAmountRequired !== "number"
    ) {
      return { success: false, error: "Invalid monthly income or loan amount" };
    }

    const eligibleAmount = await calculateEligibleAmount(monthlyIncome);

    if (eligibleAmount === 0) {
      await prisma.creditBuilderLoanApplication.update({
        where: { id: applicationId },
        data: { status: "Rejected", eligibleAmount: 0 },
      });
      return { success: false, error: "Not eligible for a loan at this time" };
    }

    if (eligibleAmount < loanAmountRequired) {
      await prisma.creditBuilderLoanApplication.update({
        where: { id: applicationId },
        data: { status: "Partially Approved", eligibleAmount },
      });
      return {
        success: true,
        eligibleAmount,
        message: `You are eligible for a loan of ₹${eligibleAmount}, which is less than your requested amount.`,
      };
    }

    await prisma.creditBuilderLoanApplication.update({
      where: { id: applicationId },
      data: { status: "Approved", eligibleAmount },
    });
    return { success: true, eligibleAmount };
  } catch (error) {
    console.error("Error checking eligibility:", error);
    return {
      success: false,
      error: "An error occurred while checking eligibility",
    };
  }
}
