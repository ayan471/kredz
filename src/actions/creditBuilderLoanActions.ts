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

// ─── Helper: safely parse any value to Int, defaulting to 0 ──────────────────
// This is the root-cause fix — formData values are always strings, and
// Number.parseInt("") returns NaN which MongoDB stores as null/string.
function safeInt(value: FormDataEntryValue | null, fallback = 0): number {
  const parsed = Number.parseInt(value as string, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function safeFloat(value: FormDataEntryValue | null, fallback = 0): number {
  const parsed = Number.parseFloat(value as string);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function uploadToCloudinary(
  file: File,
  folder: string,
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
      },
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

export async function updateEligibleAmount(
  applicationId: string,
  eligibleAmount: number,
) {
  try {
    const updatedApplication = await prisma.creditBuilderLoanApplication.update(
      { where: { id: applicationId }, data: { eligibleAmount } },
    );
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

    const existingLoan = await prisma.creditBuilderLoanApplication.findFirst({
      where: { panNumber, status: { in: ["In Progress", "Approved"] } },
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
      // ✅ All numeric fields now go through safeInt/safeFloat — no more strings in DB
      age: safeInt(formData.get("age")),
      address: formData.get("address") as string,
      loanAmountRequired: safeFloat(formData.get("loanAmountRequired")),
      purpose: formData.get("purpose") as string,
      aadharNumber: formData.get("aadharNumber") as string,
      panNumber: panNumber,
      employmentType: formData.get("employmentType") as string,
      monthlyIncome: safeFloat(formData.get("monthlyIncome")),
      creditScore: safeInt(formData.get("creditScore")),
      currentActiveEmis: safeInt(formData.get("currentActiveEmis")),
      currentActiveOverdues: safeInt(formData.get("currentActiveOverdues")), // ✅ was crashing
      currentActiveEmisRange:
        (formData.get("currentActiveEmis") as string) || null,
      currentActiveOverduesRange:
        (formData.get("currentActiveOverdues") as string) || null,
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
          "credit_builder_loan_applications",
        ).then((url) => {
          data.aadharFrontUrl = url;
        }),
      );
    }

    const aadharBack = formData.get("aadharBack") as File;
    if (aadharBack) {
      fileUploads.push(
        uploadToCloudinary(aadharBack, "credit_builder_loan_applications").then(
          (url) => {
            data.aadharBackUrl = url;
          },
        ),
      );
    }

    const panCard = formData.get("panCard") as File;
    if (panCard) {
      fileUploads.push(
        uploadToCloudinary(panCard, "credit_builder_loan_applications").then(
          (url) => {
            data.panCardUrl = url;
          },
        ),
      );
    }

    const bankStatement = formData.get("bankStatement") as string;
    if (bankStatement) {
      data.bankStatementUrl = bankStatement;
    }

    await Promise.all(fileUploads);

    const application = await prisma.creditBuilderLoanApplication.create({
      data,
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
      where: { userId },
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

    return { success: true, data: rejectedApplication };
  } catch (error) {
    console.error("Error fetching rejected loan application:", error);
    return { success: false, error: "Failed to fetch application data" };
  }
}

export async function updateCreditBuilderLoanApplication(
  id: string,
  formData: FormData,
) {
  try {
    const existingApplication =
      await prisma.creditBuilderLoanApplication.findUnique({ where: { id } });

    if (!existingApplication) {
      return { success: false, error: "Application not found" };
    }

    const data: Prisma.CreditBuilderLoanApplicationUpdateInput = {};
    const fileUploads: Promise<void>[] = [];

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        fileUploads.push(
          uploadToCloudinary(value, "credit_builder_loan_applications").then(
            (url) => {
              if (key === "aadharFront") data.aadharFrontUrl = url;
              else if (key === "aadharBack") data.aadharBackUrl = url;
              else if (key === "panCard") data.panCardUrl = url;
              else if (key === "bankStatement") data.bankStatementUrl = url;
            },
          ),
        );
      } else {
        switch (key) {
          case "fullName":
            data.fullName = value;
            break;
          case "mobileNumber":
            data.mobileNumber = value;
            break;
          case "dateOfBirth":
            data.dateOfBirth = new Date(value);
            break;
          case "address":
            data.address = value;
            break;
          case "purpose":
            data.purpose = value;
            break;
          case "aadharNumber":
            data.aadharNumber = value;
            break;
          case "panNumber":
            data.panNumber = value;
            break;
          case "employmentType":
            data.employmentType = value;
            break;
          case "status":
            data.status = value;
            break;
          case "accountNumber":
            data.accountNumber = value;
            break;
          case "bankName":
            data.bankName = value;
            break;
          case "ifscCode":
            data.ifscCode = value;
            break;
          // ✅ All parseInt calls go through safeInt
          case "age":
            data.age = safeInt(value);
            break;
          case "loanAmountRequired":
            data.loanAmountRequired = safeInt(value);
            break;
          case "monthlyIncome":
            data.monthlyIncome = safeInt(value);
            break;
          case "creditScore":
            data.creditScore = safeInt(value);
            break;
          case "currentActiveEmis":
            data.currentActiveEmis = safeInt(value);
            data.currentActiveEmisRange = value || null;
            break;
          case "currentActiveOverdues":
            data.currentActiveOverdues = safeInt(value);
            data.currentActiveOverduesRange = value || null;
            break; // ✅
          case "emiTenure":
            data.emiTenure = safeInt(value);
            break;
        }
      }
    }

    await Promise.all(fileUploads);

    const updatedApplication = await prisma.creditBuilderLoanApplication.update(
      { where: { id }, data },
    );
    return { success: true, data: updatedApplication };
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, error: "Application not found" };
    }
    console.error("Error updating credit builder loan application:", error);
    return { success: false, error: "Failed to update application data" };
  }
}

export async function fetchCreditBuilderLoanApplication(userId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // ✅ Use a raw MongoDB command to bypass Prisma's strict type deserialization.
    // Existing records in the DB have currentActiveOverdues/currentActiveEmis stored
    // as strings ("0") instead of ints — Prisma throws on findFirst() for those records.
    // The raw command returns the document as-is, then we coerce the int fields ourselves.
    const rawResult = (await prisma.$runCommandRaw({
      find: "CreditBuilderLoanApplication",
      filter: { userId },
      sort: { createdAt: -1 },
      limit: 1,
    })) as { cursor: { firstBatch: any[] } };

    const batch = rawResult?.cursor?.firstBatch;
    if (!batch || batch.length === 0) {
      return { success: false, error: "No application found" };
    }

    const raw = batch[0];

    // Coerce any fields that may have been stored as strings in old records
    const application = {
      ...raw,
      id: raw._id?.$oid ?? raw.id,
      currentActiveEmis: safeInt(String(raw.currentActiveEmis ?? 0)),
      currentActiveOverdues: safeInt(String(raw.currentActiveOverdues ?? 0)),
      creditScore: safeInt(String(raw.creditScore ?? 0)),
      age: safeInt(String(raw.age ?? 0)),
      monthlyIncome: safeFloat(String(raw.monthlyIncome ?? 0)),
      loanAmountRequired: safeFloat(String(raw.loanAmountRequired ?? 0)),
      eligibleAmount:
        raw.eligibleAmount != null
          ? safeFloat(String(raw.eligibleAmount))
          : null,
      createdAt: raw.createdAt?.$date
        ? new Date(raw.createdAt.$date)
        : new Date(raw.createdAt),
      updatedAt: raw.updatedAt?.$date
        ? new Date(raw.updatedAt.$date)
        : new Date(raw.updatedAt),
      dateOfBirth: raw.dateOfBirth?.$date
        ? new Date(raw.dateOfBirth.$date)
        : new Date(raw.dateOfBirth),
    };

    console.log("Fetched credit builder loan application:", application.id);
    return { success: true, data: application };
  } catch (error) {
    console.error("Error fetching credit builder loan application:", error);
    return { success: false, error: "Failed to fetch application data" };
  }
}

// All remaining functions unchanged below ─────────────────────────────────────

export async function checkEligibility(applicationId: string) {
  try {
    const application = await prisma.creditBuilderLoanApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) return { success: false, error: "Application not found" };

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

    await prisma.creditBuilderLoanApplication.update({
      where: { id: applicationId },
      data: { status: "In Progress", eligibleAmount },
    });

    if (eligibleAmount < loanAmountRequired) {
      return {
        success: true,
        eligibleAmount,
        message: `You are eligible for a loan of ₹${eligibleAmount}, which is less than your requested amount.`,
      };
    }

    return { success: true, eligibleAmount, monthlyIncome };
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
  data: Partial<CreditBuilderLoanApplication>,
) {
  try {
    const updatedApplication = await prisma.creditBuilderLoanApplication.update(
      { where: { id }, data },
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
  },
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
    return { success: true, loan: updatedLoan };
  } catch (error) {
    console.error("Error approving loan:", error);
    return { success: false, error: "Failed to approve loan" };
  }
}

export async function updateEMIPaymentLink(
  loanId: string,
  emiPaymentLink: string,
) {
  try {
    const updatedLoan = await prisma.creditBuilderLoanApplication.update({
      where: { id: loanId },
      data: { emiPaymentLink },
    });
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
      data: { status: "Rejected", rejectionReason: reason },
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

    if (!loan) throw new Error("Loan not found");
    if (loan.emiPayments.length >= (loan.tenure || 0))
      throw new Error("All EMIs have been paid for this loan");
    if (!loan.emiPaymentLink) throw new Error("EMI payment link not available");

    const payment = await prisma.eMIPayment.create({
      data: { loanId, amount, paymentDate: new Date() },
    });

    await prisma.creditBuilderLoanApplication.update({
      where: { id: loanId },
      data: { emiPaymentLink: null },
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
  isPaid: boolean,
) {
  try {
    if (!applicationId || applicationId.length !== 24) {
      return { success: false, error: "Invalid application ID format" };
    }

    const beforeUpdate = await prisma.creditBuilderLoanApplication.findUnique({
      where: { id: applicationId },
    });

    if (!beforeUpdate) {
      return { success: false, error: "Application not found" };
    }

    await prisma.$runCommandRaw({
      update: "CreditBuilderLoanApplication",
      updates: [
        {
          q: { _id: { $oid: applicationId } },
          u: { $set: { fasterProcessingPaid: isPaid } },
        },
      ],
    });

    const updatedApplication = await prisma.creditBuilderLoanApplication.update(
      {
        where: { id: applicationId },
        data: { fasterProcessingPaid: isPaid },
      },
    );

    revalidatePath("/admin/credit-builder-loan");
    revalidatePath("/admin/credit-builder-loans");
    revalidatePath(`/admin/credit-builder-loans/${applicationId}`);

    return { success: true, data: updatedApplication };
  } catch (error) {
    console.error("CRITICAL ERROR updating faster processing status:", error);
    return {
      success: false,
      error: "Failed to update faster processing status",
    };
  }
}
