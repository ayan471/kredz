"use server";

import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function submitCreditBuilderApplication(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const application = await prisma.creditBuilderApplication.create({
      data: {
        userId: user.id,
        fullName: formData.get("fullName") as string,
        phoneNo: formData.get("phoneNo") as string,
        aadharImg: (formData.get("aadharImg") as File).name,
        aadharNo: formData.get("aadharNo") as string,
        panImg: (formData.get("panImg") as File).name,
        panNo: formData.get("panNo") as string,
        creditScore: formData.get("creditScore") as string,
        currEmis: formData.get("currEmis") as string,
      },
    });
    return { success: true, data: application };
  } catch (error) {
    console.error("Error submitting credit builder application:", error);
    return { success: false, error: "Failed to submit application" };
  }
}

export async function submitCreditBuilderSubscription(data: any) {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const subscription = await prisma.creditBuilderSubscription.create({
      data: {
        userId: user.id,
        fullName: data.fullName,
        phoneNo: data.phoneNo,
        plan: data.empType,
      },
    });
    return { success: true, data: subscription };
  } catch (error) {
    console.error("Error submitting credit builder subscription:", error);
    return { success: false, error: "Failed to submit subscription" };
  }
}

export async function getAdminDashboardData() {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const creditBuilderApplications =
      await prisma.creditBuilderApplication.findMany();
    const creditBuilderSubscriptions =
      await prisma.creditBuilderSubscription.findMany();

    return {
      success: true,
      data: {
        creditBuilderApplications,
        creditBuilderSubscriptions,
      },
    };
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return { success: false, error: "Failed to fetch admin dashboard data" };
  }
}
