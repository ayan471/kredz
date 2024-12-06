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
}
