"use server";

import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

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
    return { success: true, id: applicationData.id };
  } catch (error) {
    console.error("Error saving loan application data:", error);
    return { success: false, error: "Failed to save application data" };
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
        status: "Incomplete",
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

export async function getLoanApplicationData(id: string) {
  try {
    const data = await prisma.loanApplicationData.findUnique({
      where: { id },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching loan application data:", error);
    return { success: false, error: "Failed to fetch application data" };
  }
}

export async function updateLoanApplicationData(
  id: string,
  data: Record<string, any>
) {
  try {
    const updatedData = await prisma.loanApplicationData.update({
      where: { id },
      data: {
        ...data,
        step: data.step || 1,
      },
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
