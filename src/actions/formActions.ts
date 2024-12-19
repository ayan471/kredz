"use server";

import { PrismaClient } from "@prisma/client";
import { currentUser, auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { addMonths } from "date-fns";

const prisma = new PrismaClient();

interface CreditFactors {
  creditUtilization: number;
  paymentHistory: number;
  creditAge: { years: number; months: number; days: number };
  creditMix: number;
  totalActiveAccounts: { count: number; lenders: string };
  delayHistory: { count: number; lenders: string };
  inquiries: { count: number; lenders: string };
  overdueAccounts: { count: number; lenders: string };
  scoringFactors: string;
  recommendation: string;
}

interface PaymentOrderResponse {
  cf_order_id: string;
  order_id: string;
  payment_session_id: string;
}

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
    cloudinary.uploader
      .upload_stream({ folder: folder }, (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      })
      .end(buffer);
  });
}

export async function submitCreditBuilderApplication(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const data: Record<string, string> = {};

    const application = await prisma.creditBuilderApplication.create({
      data: {
        userId: user.id,
        fullName: data.fullName,
        phoneNo: data.phoneNo,
        aadharNo: data.aadharNo,
        panNo: data.panNo,
        creditScore: data.creditScore,
        currEmis: data.currEmis,
      },
    });
    return { success: true, data: application };
  } catch (error) {
    console.error("Error submitting credit builder application:", error);
    return { success: false, error: "Failed to submit application" };
  }
}

export async function saveCreditBuilderData(data: {
  fullName: string;
  phoneNo: string;
  aadharNo: string;
  panNo: string;
  creditScore: string;
  currEmis: string;
}) {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const creditBuilderData = await prisma.creditBuilderApplicationData.upsert({
      where: { userId: user.id },
      update: data,
      create: {
        userId: user.id,
        ...data,
      },
    });

    revalidatePath("/credit-builder");
    return { success: true, data: creditBuilderData };
  } catch (error) {
    console.error("Error saving credit builder data:", error);
    return { success: false, error: "Failed to save credit builder data" };
  }
}

export async function getCreditScoreData(userId: string) {
  try {
    const creditData = await prisma.creditBuilderApplicationData.findUnique({
      where: { userId },
    });

    if (!creditData) {
      console.log(`No credit data found for user ${userId}`);
      return null;
    }

    console.log(`Credit data for user ${userId}:`, creditData);
    return creditData;
  } catch (error) {
    console.error("Failed to fetch credit score data:", error);
    throw error;
  }
}

export async function getCreditBuilderData(userId: string) {
  try {
    const data = await prisma.creditBuilderApplicationData.findUnique({
      where: { userId },
    });
    return data;
  } catch (error) {
    console.error("Error fetching credit builder data:", error);
    return null;
  }
}

export async function updateCreditHealth(
  subscriptionId: string,
  creditFactors: CreditFactors,
  month: string
) {
  try {
    const subscription = await prisma.creditBuilderSubscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    let creditHealth = subscription.creditHealth
      ? JSON.parse(subscription.creditHealth)
      : {};

    creditHealth[month] = [
      { name: "Credit Utilization", score: creditFactors.creditUtilization },
      { name: "Payment History", score: creditFactors.paymentHistory },
      { name: "Credit Age", score: 0, details: creditFactors.creditAge },
      { name: "Credit Mix", score: creditFactors.creditMix },
      {
        name: "Total Active Accounts",
        score: creditFactors.totalActiveAccounts.count,
        details: creditFactors.totalActiveAccounts,
      },
      {
        name: "Delay History",
        score: creditFactors.delayHistory.count,
        details: creditFactors.delayHistory,
      },
      {
        name: "No. of Inquiries",
        score: creditFactors.inquiries.count,
        details: creditFactors.inquiries,
      },
      {
        name: "Overdue Accounts",
        score: creditFactors.overdueAccounts.count,
        details: creditFactors.overdueAccounts,
      },
      {
        name: "Scoring Factors",
        score: 0,
        details: { factors: creditFactors.scoringFactors },
      },
      {
        name: "Our Recommendation",
        score: 0,
        details: { recommendation: creditFactors.recommendation },
      },
    ];

    const updatedSubscription = await prisma.creditBuilderSubscription.update({
      where: { id: subscriptionId },
      data: {
        creditHealth: JSON.stringify(creditHealth),
      },
    });

    revalidatePath("/admin/credit-builder");
    revalidatePath("/dashboard/credit-health");

    return { success: true, data: updatedSubscription };
  } catch (error) {
    console.error("Error updating credit health:", error);
    return { success: false, error: "Failed to update credit health" };
  }
}

export async function updateMonthlyCreditHealth(
  subscriptionId: string,
  month: number,
  year: number,
  creditFactors: CreditFactors
) {
  try {
    const subscription = await prisma.creditBuilderSubscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    let monthlyHealthData = subscription.monthlyHealthData
      ? JSON.parse(subscription.monthlyHealthData)
      : {};
    monthlyHealthData[`${year}-${month}`] = creditFactors;

    const updatedSubscription = await prisma.creditBuilderSubscription.update({
      where: { id: subscriptionId },
      data: {
        monthlyHealthData: JSON.stringify(monthlyHealthData),
      },
    });

    revalidatePath("/admin/credit-builder");
    revalidatePath("/dashboard/credit-health");

    return { success: true, data: updatedSubscription };
  } catch (error) {
    console.error("Error updating monthly credit health:", error);
    return { success: false, error: "Failed to update monthly credit health" };
  }
}
export async function getUserSubscription(userId: string) {
  try {
    const subscription = await prisma.creditBuilderSubscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (subscription) {
      const now = new Date();
      const isExpired =
        subscription.expiryDate && subscription.expiryDate < now;

      return {
        ...subscription,
        isActive: !isExpired,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return null;
  }
}

export async function submitCreditBuilderSubscription(data: {
  fullName: string;
  phoneNo: string;
  plan: string;
}) {
  const { userId } = auth();

  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    // Validate required fields
    if (!data.fullName || !data.phoneNo || !data.plan) {
      return { success: false, error: "All fields are required" };
    }

    const durationInMonths = parseInt(data.plan.split(" ")[0]);
    const expiryDate = addMonths(new Date(), durationInMonths);

    const subscription = await prisma.creditBuilderSubscription.create({
      data: {
        userId,
        fullName: data.fullName,
        phoneNo: data.phoneNo,
        plan: data.plan,
        expiryDate,
      },
    });

    revalidatePath("/credit-builder/subscription");
    return { success: true, data: subscription };
  } catch (error) {
    console.error("Error submitting credit builder subscription:", error);
    return { success: false, error: "Failed to submit subscription" };
  }
}

export async function getAllSubscriptions() {
  try {
    const subscriptions = await prisma.creditBuilderSubscription.findMany({
      orderBy: { createdAt: "desc" },
    });

    return subscriptions.map((subscription) => ({
      ...subscription,
      isActive: subscription.expiryDate
        ? new Date(subscription.expiryDate) > new Date()
        : false,
    }));
  } catch (error) {
    console.error("Error fetching all subscriptions:", error);
    return [];
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
    const loanApplications = await prisma.loanApplication.findMany();
    const channelPartners = await prisma.channelPartner.findMany();

    return {
      success: true,
      data: {
        creditBuilderApplications,
        creditBuilderSubscriptions,
        loanApplications,
        channelPartners,
      },
    };
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return { success: false, error: "Failed to fetch admin dashboard data" };
  }
}

export async function initiateCashfreePayment(
  amount: number,
  orderId: string
): Promise<PaymentOrderResponse> {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.creditBuilderApplicationData.findUnique({
    where: { userId },
  });

  if (!user) {
    throw new Error("User data not found");
  }

  const payload = {
    order_id: orderId,
    order_amount: amount,
    order_currency: "INR",
    customer_details: {
      customer_id: userId,
      customer_name: user.fullName || "",
      customer_email: user.email || "", // Use empty string as fallback
      customer_phone: user.phoneNo || "",
    },
    order_meta: {
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/credit-builder/subscription/payment-status?order_id={order_id}`,
    },
  };

  const response = await fetch("https://sandbox.cashfree.com/pg/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": process.env.CASHFREE_APP_ID!,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
      "x-api-version": "2022-09-01",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to initiate payment");
  }

  const data: PaymentOrderResponse = await response.json();
  return data;
}
