"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  Plan, isPremiumPlan, getPlanConfig, calculateRefill,
  ENERGY_COSTS, MODULE_UNLOCK_DELAY_MS
} from "@/lib/premium";

type PremiumContextType = {
  plan: Plan;
  isPremium: boolean;
  energy: number;
  maxEnergy: number;
  nextEnergyAt: Date | null;
  questionsPerModule: number;
  certificateCost: number;
  loading: boolean;
  canAccessLesson: (lessonIndex: number, completedPrevious: boolean, previousCompletedAt: string | null) => { allowed: boolean; reason?: string; unlocksAt?: Date };
  useEnergy: (cost: number) => Promise<boolean>;
  refreshPremium: () => Promise<void>;
};

const PremiumContext = createContext<PremiumContextType | null>(null);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<Plan>("free");
  const [energy, setEnergy] = useState(5);
  const [maxEnergy, setMaxEnergy] = useState(5);
  const [nextEnergyAt, setNextEnergyAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshPremium = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    // Fetch subscription
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, status, current_period_end")
      .eq("user_id", user.id)
      .single();

    let currentPlan: Plan = "free";
    if (sub) {
      if (sub.plan === "lifetime") currentPlan = "lifetime";
      else if (sub.plan === "monthly" && sub.status === "active") {
        const isValid = !sub.current_period_end || new Date(sub.current_period_end) > new Date();
        if (isValid) currentPlan = "monthly";
      }
    }
    setPlan(currentPlan);

    // Fetch and update energy
    const { data: energyData } = await supabase
      .from("energy")
      .select("current, max_energy, last_refill")
      .eq("user_id", user.id)
      .single();

    if (energyData) {
      const config = getPlanConfig(currentPlan);
      const correctMax = config.maxEnergy;

      const { newEnergy, nextRefillAt } = calculateRefill(
        energyData.current,
        correctMax,
        new Date(energyData.last_refill)
      );

      // Update in DB if energy changed or max changed
      if (newEnergy !== energyData.current || correctMax !== energyData.max_energy) {
        await supabase.from("energy").update({
          current: newEnergy,
          max_energy: correctMax,
          last_refill: newEnergy > energyData.current ? new Date().toISOString() : energyData.last_refill,
          updated_at: new Date().toISOString(),
        }).eq("user_id", user.id);
      }

      setEnergy(newEnergy);
      setMaxEnergy(correctMax);
      setNextEnergyAt(nextRefillAt);
    } else {
      // Create energy row if missing
      const config = getPlanConfig(currentPlan);
      await supabase.from("energy").insert({
        user_id: user.id,
        current: config.maxEnergy,
        max_energy: config.maxEnergy,
        last_refill: new Date().toISOString(),
      });
      setEnergy(config.maxEnergy);
      setMaxEnergy(config.maxEnergy);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    refreshPremium();
    // Refresh energy every minute
    const interval = setInterval(refreshPremium, 60000);
    return () => clearInterval(interval);
  }, [refreshPremium]);

  const canAccessLesson = useCallback((
    lessonIndex: number,
    completedPrevious: boolean,
    previousCompletedAt: string | null
  ): { allowed: boolean; reason?: string; unlocksAt?: Date } => {
    // First lesson always unlocked
    if (lessonIndex === 0) return { allowed: true };

    // Premium users: only need to complete previous
    if (isPremiumPlan(plan)) {
      if (!completedPrevious) return { allowed: false, reason: "Complete the previous lesson first" };
      return { allowed: true };
    }

    // Free users: only first 2 lessons
    if (lessonIndex >= 2) {
      return { allowed: false, reason: "Upgrade to Pro to unlock all modules" };
    }

    // Must complete previous + wait 1 hour
    if (!completedPrevious) return { allowed: false, reason: "Complete the previous lesson first" };

    if (previousCompletedAt) {
      const completedTime = new Date(previousCompletedAt).getTime();
      const unlocksAt = new Date(completedTime + MODULE_UNLOCK_DELAY_MS);
      if (new Date() < unlocksAt) {
        return { allowed: false, reason: "Time locked", unlocksAt };
      }
    }

    return { allowed: true };
  }, [plan]);

  const useEnergy = useCallback(async (cost: number): Promise<boolean> => {
    if (energy < cost) return false;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const newEnergy = energy - cost;
    const { error } = await supabase.from("energy").update({
      current: newEnergy,
      updated_at: new Date().toISOString(),
    }).eq("user_id", user.id);

    if (error) return false;
    setEnergy(newEnergy);
    return true;
  }, [energy]);

  const config = getPlanConfig(plan);

  return (
    <PremiumContext.Provider value={{
      plan,
      isPremium: isPremiumPlan(plan),
      energy,
      maxEnergy,
      nextEnergyAt,
      questionsPerModule: config.questionsPerModule,
      certificateCost: config.certificateCost,
      loading,
      canAccessLesson,
      useEnergy,
      refreshPremium,
    }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error("usePremium must be used inside PremiumProvider");
  return ctx;
}
