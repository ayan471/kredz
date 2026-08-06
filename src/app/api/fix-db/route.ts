// src/app/api/fix-db/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const result = (await prisma.$runCommandRaw({
      find: "CreditBuilderLoanApplication",
      filter: {},
      projection: {
        _id: 1,
        currentActiveOverdues: 1,
        currentActiveEmis: 1,
        creditScore: 1,
        age: 1,
        monthlyIncome: 1,
        loanAmountRequired: 1,
      },
    })) as { cursor: { firstBatch: any[] } };

    const docs = result?.cursor?.firstBatch ?? [];
    let fixed = 0;
    let skipped = 0;

    for (const doc of docs) {
      const id = doc._id?.$oid ?? doc._id;

      const needsFix = [
        "currentActiveOverdues",
        "currentActiveEmis",
        "creditScore",
        "age",
        "monthlyIncome",
        "loanAmountRequired",
      ].some((field) => typeof doc[field] === "string");

      if (!needsFix) {
        skipped++;
        continue;
      }

      const setFields: Record<string, number> = {};

      if (typeof doc.currentActiveOverdues === "string")
        setFields.currentActiveOverdues =
          parseInt(doc.currentActiveOverdues, 10) || 0;
      if (typeof doc.currentActiveEmis === "string")
        setFields.currentActiveEmis = parseInt(doc.currentActiveEmis, 10) || 0;
      if (typeof doc.creditScore === "string")
        setFields.creditScore = parseInt(doc.creditScore, 10) || 0;
      if (typeof doc.age === "string")
        setFields.age = parseInt(doc.age, 10) || 0;
      if (typeof doc.monthlyIncome === "string")
        setFields.monthlyIncome = parseFloat(doc.monthlyIncome) || 0;
      if (typeof doc.loanAmountRequired === "string")
        setFields.loanAmountRequired = parseFloat(doc.loanAmountRequired) || 0;

      await prisma.$runCommandRaw({
        update: "CreditBuilderLoanApplication",
        updates: [{ q: { _id: { $oid: id } }, u: { $set: setFields } }],
      });

      fixed++;
    }

    return NextResponse.json({
      success: true,
      total: docs.length,
      fixed,
      skipped,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
