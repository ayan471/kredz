export interface LoanApplication {
  id: string;
  userId: string;
  fullName: string;
  phoneNo: string;
  amtRequired: string;
  prpseOfLoan: string;
  aadharImgFrontUrl?: string;
  aadharImgBackUrl?: string;
  aadharNo: string;
  panImgFrontUrl?: string;
  panImgBackUrl?: string;
  panNo: string;
  creditScore: string;
  empType: string;
  EmpOthers?: string;
  monIncome: string;
  currEmis?: string;
  selfieImgUrl?: string;
  bankStatmntImgUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  status?: "In Progress" | "Approved" | "Rejected" | "Eligible";
  eligibleAmount?: number | null;
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
