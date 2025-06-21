// src/types/reward.ts

export const TransactionType = {
  Deposit: 'DEPOSIT',
  Withdrawal: 'WITHDRAWAL',
  ContestEntry: 'CONTEST_ENTRY',
  ContestWinnings: 'CONTEST_WINNINGS',
  Bonus: 'BONUS',
  Referral: 'REFERRAL',
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export type Reward = {
  id: string;
  name: string;
  description: string;
  amount: number;
  type: TransactionType;
  isClaimed: boolean;
  expiresAt: Date;
  createdAt: Date;
};

export type RewardTransaction = {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  balance: number;
  description: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  metadata?: Record<string, any>;
}; 