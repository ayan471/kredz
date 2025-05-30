"use server";

import {
  CreditBuilderLoanApplication,
  PrismaClient,
  type Prisma,
} from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { EditableCreditBuilderLoanApplication } from "@/types";

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

/**
 * Calculates the eligible loan amount based on the applicant's monthly income.
 * The eligible amount increases with higher income levels according to predefined thresholds.
 * @param salary - The applicant's monthly income in rupees
 * @returns The maximum eligible loan amount in rupees
 */

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

export async function updateEligibleAmount(
  applicationId: string,
  eligibleAmount: number
) {
  try {
    const updatedApplication = await prisma.creditBuilderLoanApplication.update(
      {
        where: { id: applicationId },
        data: { eligibleAmount },
      }
    );

    console.log("Updated eligible amount:", updatedApplication);
    return { success: true, data: updatedApplication };
  } catch (error) {
    console.error("Error updating eligible amount:", error);
    return { success: false, error: "Failed to update eligible amount" };
  }
}

export async function saveCreditBuilderLoanApplication(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const panNumber = formData.get("panNumber") as string;

    // Check for existing active loan
    const existingLoan = await prisma.creditBuilderLoanApplication.findFirst({
      where: {
        panNumber: panNumber,
        status: {
          in: ["In Progress", "Approved"],
        },
      },
    });

    if (existingLoan) {
      return {
        success: false,
        error:
          "You already have an active loan application. You cannot apply for a new loan at this time.",
      };
    }

    const data: Prisma.CreditBuilderLoanApplicationCreateInput = {
      userId: user.id,
      fullName: formData.get("fullName") as string,
      mobileNumber: formData.get("mobileNumber") as string,
      email: formData.get("email") as string,
      dateOfBirth: new Date(formData.get("dateOfBirth") as string),
      age: Number.parseInt(formData.get("age") as string),
      address: formData.get("address") as string,
      loanAmountRequired: Number.parseFloat(
        formData.get("loanAmountRequired") as string
      ),
      purpose: formData.get("purpose") as string,
      aadharNumber: formData.get("aadharNumber") as string,
      panNumber: panNumber,
      employmentType: formData.get("employmentType") as string,
      monthlyIncome: Number.parseFloat(formData.get("monthlyIncome") as string),
      creditScore: Number.parseInt(formData.get("creditScore") as string),
      currentActiveEmis: Number.parseInt(
        formData.get("currentActiveEmis") as string
      ),
      currentActiveOverdues: Number.parseInt(
        formData.get("currentActiveOverdues") as string
      ),
      status: "In Progress",
      aadharFrontUrl: null,
      aadharBackUrl: null,
      panCardUrl: null,
      bankStatementUrl: null,
      accountNumber: null,
      bankName: null,
      ifscCode: null,
      emiTenure: null,
      hasSalarySlip: formData.get("hasSalarySlip") === "true",
      salaryReceiveMethod: formData.get("salaryReceiveMethod") as string,
      hasIncomeTaxReturn: formData.get("hasIncomeTaxReturn") === "true",
      businessRegistration: formData.get("businessRegistration") as string,
    };

    const fileUploads: Promise<void>[] = [];

    const aadharFront = formData.get("aadharFront") as File;
    if (aadharFront) {
      fileUploads.push(
        uploadToCloudinary(
          aadharFront,
          "credit_builder_loan_applications"
        ).then((url) => {
          data.aadharFrontUrl = url;
        })
      );
    }

    const aadharBack = formData.get("aadharBack") as File;
    if (aadharBack) {
      fileUploads.push(
        uploadToCloudinary(aadharBack, "credit_builder_loan_applications").then(
          (url) => {
            data.aadharBackUrl = url;
          }
        )
      );
    }

    const panCard = formData.get("panCard") as File;
    if (panCard) {
      fileUploads.push(
        uploadToCloudinary(panCard, "credit_builder_loan_applications").then(
          (url) => {
            data.panCardUrl = url;
          }
        )
      );
    }

    const bankStatement = formData.get("bankStatement") as string;
    if (bankStatement) {
      data.bankStatementUrl = bankStatement;
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
          // New fields for bank details and EMI tenure
          case "accountNumber":
            data.accountNumber = value as string;
            break;
          case "bankName":
            data.bankName = value as string;
            break;
          case "ifscCode":
            data.ifscCode = value as string;
            break;
          case "emiTenure":
            data.emiTenure = Number.parseInt(value as string, 10);
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
        data: { status: "In Progress", eligibleAmount },
      });
      return {
        success: true,
        eligibleAmount,
        message: `You are eligible for a loan of ₹${eligibleAmount}, which is less than your requested amount.`,
      };
    }

    await prisma.creditBuilderLoanApplication.update({
      where: { id: applicationId },
      data: { status: "In Progress", eligibleAmount },
    });
    return { success: true, eligibleAmount, monthlyIncome: monthlyIncome };
  } catch (error) {
    console.error("Error checking eligibility:", error);
    return {
      success: false,
      error: "An error occurred while checking eligibility",
    };
  }
}

export async function updateCreditBuilderLoanApplicationData(
  id: string,
  data: Partial<CreditBuilderLoanApplication>
) {
  try {
    const updatedApplication = await prisma.creditBuilderLoanApplication.update(
      {
        where: { id },
        data,
      }
    );
    return updatedApplication;
  } catch (error) {
    console.error("Error updating Credit Builder Loan application:", error);
    throw new Error("Failed to update Credit Builder Loan application");
  }
}

export async function makeUserEligible(id: string) {
  try {
    await prisma.creditBuilderLoanApplication.update({
      where: { id },
      data: { status: "Eligible" },
    });
    revalidatePath("/admin/credit-builder-loan");
    return { success: true };
  } catch (error) {
    console.error("Failed to make user eligible:", error);
    return { success: false, error: "Failed to make user eligible" };
  }
}

export async function approveLoanWithDetails(
  applicationId: string,
  data: {
    approvedAmount: string;
    processingFees: string;
    gst: string;
    otherCharges: string;
    rateOfInterest: string;
    tenure: string;
    netDisbursement: string;
    disbursementAccount: string;
    disbursementDate: string;
    lender: string;
    emi: string;
  }
) {
  try {
    const updatedLoan = await prisma.creditBuilderLoanApplication.update({
      where: { id: applicationId },
      data: {
        status: "Approved",
        approvedAmount: parseFloat(data.approvedAmount),
        processingFees: parseFloat(data.processingFees),
        gst: parseFloat(data.gst),
        otherCharges: parseFloat(data.otherCharges),
        rateOfInterest: parseFloat(data.rateOfInterest),
        tenure: parseInt(data.tenure),
        netDisbursement: parseFloat(data.netDisbursement),
        disbursementAccount: data.disbursementAccount,
        disbursementDate: new Date(data.disbursementDate),
        lender: data.lender,
        emi: parseFloat(data.emi),
      },
    });

    console.log("Updated loan in database:", updatedLoan);
    return { success: true, loan: updatedLoan };
  } catch (error) {
    console.error("Error approving loan:", error);
    return { success: false, error: "Failed to approve loan" };
  }
}

export async function updateEMIPaymentLink(
  loanId: string,
  emiPaymentLink: string
) {
  try {
    const updatedLoan = await prisma.creditBuilderLoanApplication.update({
      where: { id: loanId },
      data: { emiPaymentLink },
    });

    console.log("Updated EMI payment link:", updatedLoan);
    return { success: true, loan: updatedLoan };
  } catch (error) {
    console.error("Error updating EMI payment link:", error);
    return { success: false, error: "Failed to update EMI payment link" };
  }
}

export async function rejectLoan(id: string, reason: string) {
  try {
    await prisma.creditBuilderLoanApplication.update({
      where: { id },
      data: {
        status: "Rejected",
        rejectionReason: reason,
      },
    });
    revalidatePath("/admin/credit-builder-loan");
    return { success: true };
  } catch (error) {
    console.error("Failed to reject loan:", error);
    return { success: false, error: "Failed to reject loan" };
  }
}

export async function payEMI(loanId: string, amount: number) {
  try {
    const loan = await prisma.creditBuilderLoanApplication.findUnique({
      where: { id: loanId },
      include: { emiPayments: true },
    });

    if (!loan) {
      throw new Error("Loan not found");
    }

    if (loan.emiPayments.length >= (loan.tenure || 0)) {
      throw new Error("All EMIs have been paid for this loan");
    }

    if (!loan.emiPaymentLink) {
      throw new Error("EMI payment link not available");
    }

    // Here, you would typically integrate with your payment gateway
    // using the emiPaymentLink. For this example, we'll simulate a successful payment.

    const payment = await prisma.eMIPayment.create({
      data: {
        loanId,
        amount,
        paymentDate: new Date(),
      },
    });

    // After successful payment, you might want to update the emiPaymentLink
    // for the next payment or mark it as used.
    await prisma.creditBuilderLoanApplication.update({
      where: { id: loanId },
      data: {
        emiPaymentLink: null, // or generate a new link for the next payment
      },
    });

    revalidatePath(`/dashboard/credit-builder-loan/${loanId}`);

    return { success: true, payment };
  } catch (error) {
    console.error("Error processing EMI payment:", error);
    return { success: false, error: "Failed to process EMI payment" };
  }
}

export async function updateFasterProcessingStatus(
  applicationId: string,
  isPaid: boolean
) {
  try {
    console.log(
      `DIRECT DB UPDATE: Updating faster processing status for application ${applicationId} to ${isPaid}`
    );

    // MongoDB requires ObjectId to be properly formatted
    // Make sure the ID is valid before attempting the update
    if (!applicationId || applicationId.length !== 24) {
      console.error(`Invalid MongoDB ObjectId format: ${applicationId}`);
      return {
        success: false,
        error: "Invalid application ID format",
      };
    }

    // Add more detailed logging
    const beforeUpdate = await prisma.creditBuilderLoanApplication.findUnique({
      where: { id: applicationId },
    });

    if (!beforeUpdate) {
      console.error(`Application not found with ID: ${applicationId}`);
      return {
        success: false,
        error: "Application not found",
      };
    }

    console.log("Before update:", {
      id: beforeUpdate.id,
      fullName: beforeUpdate.fullName,
      fasterProcessingPaid: beforeUpdate.fasterProcessingPaid,
    });

    // Try a direct database update using Prisma's executeRaw for MongoDB
    // This bypasses any potential Prisma caching or validation issues
    const result = await prisma.$runCommandRaw({
      update: "CreditBuilderLoanApplication",
      updates: [
        {
          q: { _id: { $oid: applicationId } },
          u: { $set: { fasterProcessingPaid: isPaid } },
        },
      ],
    });

    console.log("MongoDB direct update result:", result);

    // Also try the standard Prisma update as a fallback
    const updatedApplication = await prisma.creditBuilderLoanApplication.update(
      {
        where: { id: applicationId },
        data: { fasterProcessingPaid: isPaid },
      }
    );

    console.log("After update - Updated faster processing status:", {
      id: updatedApplication.id,
      fullName: updatedApplication.fullName,
      fasterProcessingPaid: updatedApplication.fasterProcessingPaid,
    });

    // Revalidate multiple paths to ensure UI is updated
    revalidatePath("/admin/credit-builder-loan");
    revalidatePath("/admin/credit-builder-loans");
    revalidatePath(`/admin/credit-builder-loans/${applicationId}`);

    return { success: true, data: updatedApplication };
  } catch (error) {
    console.error("CRITICAL ERROR updating faster processing status:", error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return {
      success: false,
      error: "Failed to update faster processing status",
    };
  }
}

export async function fetchCreditBuilderLoanApplication(userId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // Query the CreditBuilderLoanApplication model
    const application = await prisma.creditBuilderLoanApplication.findFirst({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });

    if (!application) {
      return { success: false, error: "No application found" };
    }

    console.log("Fetched credit builder loan application:", application);
    return { success: true, data: application };
  } catch (error) {
    console.error("Error fetching credit builder loan application:", error);
    return { success: false, error: "Failed to fetch application data" };
  }
}
