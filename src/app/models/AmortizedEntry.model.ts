export interface AmortizedEntry{
  startingBalance: number;
  paidThisMonth: number;
  paidToInterest: number;
  principal: number;
  endingBalance: number;
  totalInterestPaid: number;
}
