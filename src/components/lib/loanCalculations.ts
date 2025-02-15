export async function getEligibleLoanAmount(
  age: number,
  salary: number
): Promise<number> {
  if (age < 23) {
    // Bronze plan for ages less than 23
    if (salary <= 10000) return 7000;
    if (salary <= 20000) return 12000;
    if (salary <= 30000) return 23000;
    return 34000; // For salary > 30000
  } else {
    // Logic for ages 23 and above
    if (salary <= 10000) return 37000;
    if (salary <= 23000) return 53000;
    if (salary <= 30000) return 67000;
    if (salary <= 37000) return 83000;
    if (salary <= 45000) return 108000;
    if (salary <= 55000) return 131000;
    if (salary <= 65000) return 178000;
    if (salary <= 75000) return 216000;
    if (salary <= 85000) return 256000;
    if (salary <= 95000) return 308000;
    if (salary <= 125000) return 376000;
    return 487000;
  }
}
