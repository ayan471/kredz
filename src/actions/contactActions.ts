"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !phone || !message) {
    return { success: false, message: "All fields are required" };
  }

  try {
    await prisma.contactFormSubmission.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });
    return { success: true, message: "Thank you for your submission!" };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    };
  }
}

export async function getContactSubmissions() {
  try {
    const submissions = await prisma.contactFormSubmission.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return submissions.map((submission) => ({
      ...submission,
      createdAt: submission.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    throw new Error("Failed to fetch contact submissions");
  } finally {
    await prisma.$disconnect();
  }
}
