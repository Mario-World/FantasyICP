import { createActor } from "./actor";
import { useAuthStore } from "../store";
import type { Reward, RewardTransaction } from '../types';

const getActor = () => {
  const { identity } = useAuthStore.getState();
  return createActor(identity);
};

export const rewardService = {
  async getPendingRewards(): Promise<Reward[]> {
    try {
      const actor = getActor();
      const result = await actor.get_pending_rewards([]);
      return result as Reward[];
    } catch (error) {
      console.error("Error fetching pending rewards:", error);
      throw error;
    }
  },

  async claimReward(rewardId: string): Promise<boolean> {
    try {
      const actor = getActor();
      const result = await actor.claim_reward(rewardId);
      return result as boolean;
    } catch (error) {
      console.error(`Error claiming reward ${rewardId}:`, error);
      return false;
    }
  },

  async getTransactions(): Promise<RewardTransaction[]> {
    try {
      const actor = getActor();
      const result = await actor.get_user_transactions([]);
      return result as RewardTransaction[];
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  },
}; 