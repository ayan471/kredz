"use server";

import { PrismaClient } from "@prisma/client";
import { currentUser, auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { addMonths } from "date-fns";

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
    const fileUploads: Promise<void>[] = [];

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        fileUploads.push(
          uploadToCloudinary(value, "credit_builder").then((url) => {
            data[`${key}Url`] = url;
          })
        );
      } else {
        data[key] = value as string;
      }
    }

    await Promise.all(fileUploads);

    const application = await prisma.creditBuilderApplication.create({
      data: {
        userId: user.id,
        fullName: data.fullName,
        phoneNo: data.phoneNo,
        aadharImgFrontUrl: data.aadharImgFrontUrl,
        aadharImgBackUrl: data.aadharImgBackUrl,
        aadharNo: data.aadharNo,
        panImgFrontUrl: data.panImgFrontUrl,
        panImgBackUrl: data.panImgBackUrl,
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

export async function saveCreditBuilderData(formData: FormData) {
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
          uploadToCloudinary(value, "credit_builder").then((url) => {
            data[`${key}Url`] = url;
          })
        );
      } else {
        data[key] = value as string;
      }
    }

    await Promise.all(fileUploads);

    const creditBuilderData = await prisma.creditBuilderApplication.create({
      data: {
        userId: user.id,
        fullName: data.fullName,
        phoneNo: data.phoneNo,
        aadharImgFrontUrl: data.aadharImgFrontUrl,
        aadharImgBackUrl: data.aadharImgBackUrl,
        aadharNo: data.aadharNo,
        panImgFrontUrl: data.panImgFrontUrl,
        panImgBackUrl: data.panImgBackUrl,
        panNo: data.panNo,
        creditScore: data.creditScore,
        currEmis: data.currEmis,
      },
    });

    revalidatePath("/credit-builder");
    return { success: true, data: creditBuilderData };
  } catch (error) {
    console.error("Error saving credit builder data:", error);
    return { success: false, error: "Failed to save credit builder data" };
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

export async function getUserSubscription(userId: string) {
  try {
    const subscription = await prisma.creditBuilderSubscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (subscription && !subscription.expiryDate) {
      // If expiryDate is null, calculate it based on the plan and createdAt date
      const durationInMonths = parseInt(subscription.plan.split(" ")[0]);
      subscription.expiryDate = addMonths(
        subscription.createdAt,
        durationInMonths
      );

      // Update the subscription in the database
      await prisma.creditBuilderSubscription.update({
        where: { id: subscription.id },
        data: { expiryDate: subscription.expiryDate },
      });
    }

    return subscription;
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
    const durationInMonths = parseInt(data.plan.split(" ")[0]);
    const expiryDate = addMonths(new Date(), durationInMonths);

    await prisma.creditBuilderSubscription.create({
      data: {
        userId,
        fullName: data.fullName,
        phoneNo: data.phoneNo,
        plan: data.plan,
        expiryDate,
      },
    });

    return { success: true };
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
