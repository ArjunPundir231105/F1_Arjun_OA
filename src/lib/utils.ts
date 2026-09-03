export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function calculateDynamicEmi(
  principal: number,
  tenureMonths: number,
  annualInterestRate: number
): number {
  if (annualInterestRate === 0 || tenureMonths <= 0) {
    return Math.round(principal / tenureMonths);
  }

  const monthlyRate = annualInterestRate / 12 / 100;
  const emi =
    (principal *
      monthlyRate *
      Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  return Math.round(emi);
}

export function calculateMfReturns(
  pledgeAmount: number,
  tenureMonths: number,
  annualRate = 12.5
): {
  futureValue: number;
  gain: number;
} {
  const years = tenureMonths / 12;
  const futureValue = Math.round(pledgeAmount * Math.pow(1 + annualRate / 100, years));
  const gain = futureValue - pledgeAmount;
  return { futureValue, gain };
}
