"use server";

import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { LoanApplication, LoanApplicationData } from "@/types";

const prisma = new PrismaClient();

type ApprovalDetails = {
  loanAmount: string;
  processingFees: string;
  gst: string;
  otherCharges: string;
  rateOfInterest: string;
  tenure: string;
  netDisbursement: string;
  disbursementAccount: string;
  disbursementDate: string;
  lender: string;
  approvedAmount: string;
};
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
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

export async function saveLoanApplicationData(data: Record<string, string>) {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const membershipPlan = await determineMembershipPlan(
      parseFloat(data.monIncome)
    );
    console.log("Saving loan application data:", data);
    const applicationData = await prisma.loanApplicationData.create({
      data: {
        userId: user.id,
        fullName: data.fullName,
        phoneNo: data.phoneNo,
        amtRequired: data.amtRequired,
        prpseOfLoan: data.prpseOfLoan,
        aadharNo: data.aadharNo,
        panNo: data.panNo,
        creditScore: data.creditScore,
        empType: data.empType,
        EmpOthers: data.EmpOthers,
        monIncome: data.monIncome,
        currEmis: data.currEmis,
        step: 1,
        membershipPlan,
      },
    });
    console.log("Loan application data saved:", applicationData);
    return { success: true, id: applicationData.id, membershipPlan };
  } catch (error) {
    console.error("Error saving loan application data:", error);
    return { success: false, error: "Failed to save application data" };
  }
}

export async function getUserMembership(userId: string) {
  console.log("Fetching membership for user:", userId);
  try {
    const loanApplication = await prisma.loanApplication.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    console.log("Fetched loan application:", loanApplication);

    return loanApplication;
  } catch (error) {
    console.error("Error fetching loan application:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export async function submitLoanApplicationStep1(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const data: Record<string, string> = {};
    const fileUploads: Promise<void>[] = [];

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        fileUploads.push(
          uploadToCloudinary(value, "loan_applications").then((url) => {
            data[`${key}Url`] = url;
          })
        );
      } else {
        data[key] = value as string;
      }
    }

    await Promise.all(fileUploads);

    console.log("Submitting loan application step 1:", data);
    const applicationData = await saveLoanApplicationData(data);
    if (!applicationData.success) {
      throw new Error(applicationData.error);
    }

    const application = await prisma.loanApplication.create({
      data: {
        userId: user.id,
        fullName: data.fullName,
        phoneNo: data.phoneNo,
        amtRequired: data.amtRequired,
        prpseOfLoan: data.prpseOfLoan,
        aadharImgFrontUrl: data.aadharImgFrontUrl,
        aadharImgBackUrl: data.aadharImgBackUrl,
        aadharNo: data.aadharNo,
        panImgFrontUrl: data.panImgFrontUrl,
        panImgBackUrl: data.panImgBackUrl,
        panNo: data.panNo,
        creditScore: data.creditScore,
        empType: data.empType,
        EmpOthers: data.EmpOthers,
        monIncome: data.monIncome,
        currEmis: data.currEmis,
        selfieImgUrl: data.selfieImgUrl,
        bankStatmntImgUrl: data.bankStatmntImgUrl,
        status: "In Progress",
        membershipPlan: applicationData.membershipPlan, // Changed from "Incomplete" to "In Progress"
      },
    });
    console.log("Loan application created:", application);
    return { success: true, data: application, id: applicationData.id };
  } catch (error) {
    console.error("Error submitting loan application:", error);
    return { success: false, error: "Failed to submit application" };
  }
}

export async function submitLoanEligibility(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const application = await prisma.loanApplication.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!application) {
      return { success: false, error: "No loan application found" };
    }

    const eligibility = await prisma.loanEligibility.create({
      data: {
        userId: user.id,
        applicationId: application.id,
        fullName: formData.get("fullName") as string,
        phoneNo: formData.get("phoneNo") as string,
        emailID: formData.get("emailID") as string,
        panNo: formData.get("panNo") as string,
        aadharNo: formData.get("aadharNo") as string,
        emiTenure: formData.get("emiTenure") as string,
      },
    });
    return { success: true, data: eligibility };
  } catch (error) {
    console.error("Error submitting loan eligibility:", error);
    return { success: false, error: "Failed to submit eligibility" };
  }
}

export async function getLoanApplicationData(id: string): Promise<{
  success: boolean;
  data: LoanApplicationData | null;
  error?: string;
}> {
  try {
    const data = await prisma.loanApplicationData.findUnique({
      where: { id },
    });

    if (data) {
      let eligibleAmount: number | null = null;
      if (data.monIncome) {
        eligibleAmount = await calculateEligibleAmount(
          parseFloat(data.monIncome)
        );
      }

      const loanApplicationData: LoanApplicationData = {
        ...data,
        eligibleAmount,
      };

      return { success: true, data: loanApplicationData };
    }

    return { success: true, data: null };
  } catch (error) {
    console.error("Error fetching loan application data:", error);
    return {
      success: false,
      data: null,
      error: "Failed to fetch application data",
    };
  }
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

export async function updateLoanApplicationData(
  id: string,
  data: Record<string, any>
) {
  try {
    // Create a new object with only the fields that exist in the LoanApplicationData model
    const updateData = {
      fullName: data.fullName,
      phoneNo: data.phoneNo,
      emailID: data.emailID,
      panNo: data.panNo,
      aadharNo: data.aadharNo,
      emiTenure: data.emiTenure,
      step: data.step || 1,
      // Add any other fields that exist in your LoanApplicationData model
    };

    const updatedData = await prisma.loanApplicationData.update({
      where: { id },
      data: updateData,
    });
    return { success: true, id: updatedData.id };
  } catch (error) {
    console.error("Error updating loan application data:", error);
    return { success: false, error: "Failed to update application data" };
  }
}

export async function determineMembershipPlan(salary: number): Promise<string> {
  // Simulating an async operation
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (salary <= 15000) return "Bronze";
  if (salary <= 25000) return "Silver";
  if (salary <= 35000) return "Gold";
  return "Platinum";
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
    const updatedLoan = await prisma.loanApplication.update({
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

export async function submitLoanMembership(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const eligibility = await prisma.loanEligibility.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!eligibility) {
      return { success: false, error: "No loan eligibility found" };
    }

    const membership = await prisma.loanMembership.create({
      data: {
        userId: user.id,
        eligibilityId: eligibility.id,
        fullName: formData.get("fullName") as string,
        phoneNo: formData.get("phoneNo") as string,
        emailID: formData.get("emailID") as string,
        panNo: formData.get("panNo") as string,
        aadharNo: formData.get("aadharNo") as string,
        membershipPlan: formData.get("membershipPlan") as string,
      },
    });
    return { success: true, data: membership };
  } catch (error) {
    console.error("Error submitting loan membership:", error);
    return { success: false, error: "Failed to submit membership" };
  }
}

export async function getLoanApplicationDashboardData(userId: string) {
  try {
    const loanApplication = await prisma.loanApplication.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        eligibility: {
          include: {
            membership: true,
          },
        },
      },
    });
    return { success: true, data: loanApplication };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { success: false, error: "Failed to fetch dashboard data" };
  }
}

export async function updateLoanStatus(id: string, status: string) {
  try {
    await prisma.loanApplication.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/loans");
    return { success: true };
  } catch (error) {
    console.error("Failed to update loan status:", error);
    return { success: false, error: "Failed to update loan status" };
  }
}

export async function approveLoan(id: string) {
  try {
    await prisma.loanApplication.update({
      where: { id },
      data: { status: "Approved" },
    });
    revalidatePath("/admin/loans");
    return { success: true };
  } catch (error) {
    console.error("Failed to approve loan:", error);
    return { success: false, error: "Failed to approve loan" };
  }
}

export async function rejectLoan(id: string) {
  try {
    await prisma.loanApplication.update({
      where: { id },
      data: { status: "Rejected" },
    });
    revalidatePath("/admin/loans");
    return { success: false };
  } catch (error) {
    console.error("Failed to reject loan:", error);
    return { success: false, error: "Failed to reject loan" };
  }
}

export async function checkExistingLoanApplication(): Promise<{
  success: boolean;
  hasExistingApplication: boolean;
  applicationData: LoanApplication | null;
  error?: string;
}> {
  const user = await currentUser();
  if (!user) {
    return {
      success: false,
      hasExistingApplication: false,
      applicationData: null,
      error: "User not authenticated",
    };
  }

  try {
    const existingApplication = await prisma.loanApplication.findFirst({
      where: {
        userId: user.id,
        status: {
          in: ["In Progress", "Approved", "Eligible"],
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      hasExistingApplication: !!existingApplication,
      applicationData: existingApplication as LoanApplication | null,
    };
  } catch (error) {
    console.error("Error checking existing loan application:", error);
    return {
      success: false,
      hasExistingApplication: false,
      applicationData: null,
      error: "Failed to check existing application",
    };
  }
}

export async function makeUserEligible(id: string) {
  try {
    await prisma.loanApplication.update({
      where: { id },
      data: { status: "Eligible" },
    });
    revalidatePath("/admin/loans");
    return { success: true };
  } catch (error) {
    console.error("Failed to make user eligible:", error);
    return { success: false, error: "Failed to make user eligible" };
  }
}

export async function payEMI(loanId: string, amount: number) {
  try {
    const loan = await prisma.loanApplication.findUnique({
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
    await prisma.loanApplication.update({
      where: { id: loanId },
      data: {
        emiPaymentLink: null, // or generate a new link for the next payment
      },
    });

    revalidatePath(`/dashboard/loans/${loanId}`);

    return { success: true, payment };
  } catch (error) {
    console.error("Error processing EMI payment:", error);
    return { success: false, error: "Failed to process EMI payment" };
  }
}

export async function updateEMIPaymentLink(
  loanId: string,
  emiPaymentLink: string
) {
  try {
    const updatedLoan = await prisma.loanApplication.update({
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
