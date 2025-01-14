// bank-account.model.ts
export interface BankAccountDTO {
  id: string;
  balance: number;
  type: string; // This can be "CurrentAccount" or "SavingAccount"
  customerId: number;
  createdAt: Date;
  status: string;
  overDraft?: number; // Only for CurrentAccount
  interestRate?: number; // Only for SavingAccount
}
