export interface LoanApplication {
  id: string;
  userId: string;
  fullName: string;
  phoneNo: string;
  amtRequired: string;
  prpseOfLoan: string;
  aadharImgFrontUrl: string | null;
  aadharImgBackUrl: string | null;
  aadharNo: string;
  panImgFrontUrl: string | null;

  panNo: string;
  creditScore: string;
  empType: string;
  EmpOthers: string | null;
  monIncome: string;
  currEmis: string | null;
  selfieImgUrl: string | null;
  bankStatmntImgUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  status: "In Progress" | "Approved" | "Rejected" | "Eligible";
  eligibleAmount: number | null;
  approvedAmount: number | null;
  processingFees: number | null;
  gst: number | null;
  otherCharges: number | null;
  rateOfInterest: number | null;
  tenure: number | null;
  netDisbursement: number | null;
  disbursementAccount: string | null;
  disbursementDate: Date | null;
  lender: string | null;
  emi: number | null;
  emiPaymentLink: string | null;
}

export interface LoanApplicationData {
  id: string;
  step: number;
  userId: string;
  fullName: string | null;
  phoneNo: string | null;
  amtRequired: string | null;
  prpseOfLoan: string | null;
  aadharNo: string | null;
  panNo: string | null;
  creditScore: string | null;
  empType: string | null;
  EmpOthers: string | null;
  monIncome: string | null;
  currEmis: string | null;
  emailID: string | null;
  emiTenure: string | null;
  membershipPlan: string | null;
  createdAt: Date;
  updatedAt: Date;
  eligibleAmount?: number | null;
}

export type EditableLoanApplication = Omit<
  LoanApplication,
  "id" | "userId" | "createdAt" | "updatedAt"
>;
