"use server";

import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function submitLoanApplicationStep1(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const application = await prisma.loanApplication.create({
      data: {
        userId: user.id,
        fullName: formData.get("fullName") as string,
        phoneNo: formData.get("phoneNo") as string,
        amtRequired: formData.get("amtRequired") as string,
        prpseOfLoan: formData.get("prpseOfLoan") as string,
        aadharImg: (formData.get("aadharImg") as File).name,
        aadharNo: formData.get("aadharNo") as string,
        panImg: (formData.get("panImg") as File).name,
        panNo: formData.get("panNo") as string,
        creditScore: formData.get("creditScore") as string,
        empType: formData.get("empType") as string,
        EmpOthers: formData.get("EmpOthers") as string,
        monIncome: formData.get("monIncome") as string,
        currEmis: formData.get("currEmis") as string,
        selfieImg: (formData.get("selfieImg") as File).name,
        bankStatmntImg: (formData.get("bankStatmntImg") as File).name,
      },
    });
    return { success: true, data: application };
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
