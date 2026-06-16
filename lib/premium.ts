// ─── PREMIUM SYSTEM CONFIG ────────────────────────────────────────────

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    questionsPerModule: 3,
    maxEnergy: 5,
    modulesUnlocked: 2, // first 2 lessons of each track
    certificateCost: 4900, // ₹49 in paise
    aiAdaptive: false,
    features: [
      "3 AI questions per module",
      "First 2 modules per track",
      "5 energy slots",
      "Basic progress tracking",
      "₹49 per certificate",
    ],
  },
  monthly: {
    name: "Pro Monthly",
    price: 24900, // ₹249 in paise
    priceDisplay: "₹249/month",
    questionsPerModule: 10,
    maxEnergy: 10,
    modulesUnlocked: Infinity,
    certificateCost: 0,
    aiAdaptive: true,
    features: [
      "10 AI questions per module",
      "All modules & tracks unlocked",
      "10 energy slots",
      "AI adapts to your level",
      "Free certificates",
      "Priority support",
      "Leaderboard access",
    ],
  },
  lifetime: {
    name: "Pro Lifetime",
    price: 249900, // ₹2499 in paise
    priceDisplay: "₹2499 one-time",
    questionsPerModule: 10,
    maxEnergy: 10,
    modulesUnlocked: Infinity,
    certificateCost: 0,
    aiAdaptive: true,
    features: [
      "Everything in Pro Monthly",
      "Lifetime access — pay once",
      "All future tracks included",
      "Early access to new features",
      "Discord community access",
    ],
  },
};

// Energy costs per action
export const ENERGY_COSTS = {
  startLesson: 1,
  takeQuiz: 1,
  generateMoreQuestions: 1,
  downloadCertificate: 0, // free action
};

// Time lock between modules (in milliseconds)
export const MODULE_UNLOCK_DELAY_MS = 60 * 60 * 1000; // 1 hour

// Energy refill rate
export const ENERGY_REFILL_INTERVAL_MS = 60 * 60 * 1000; // 1 hour per energy unit

export type Plan = "free" | "monthly" | "lifetime";

export type UserPremiumState = {
  plan: Plan;
  isPremium: boolean;
  energy: number;
  maxEnergy: number;
  nextEnergyAt: Date | null;
  questionsPerModule: number;
  canAccessModule: (lessonIndex: number) => boolean;
  certificateCost: number;
};

export function getPlanConfig(plan: Plan) {
  return PLANS[plan] || PLANS.free;
}

export function isPremiumPlan(plan: Plan): boolean {
  return plan === "monthly" || plan === "lifetime";
}

// Calculate how many energy units have been refilled since last_refill
export function calculateRefill(
  current: number,
  max: number,
  lastRefill: Date
): { newEnergy: number; nextRefillAt: Date | null } {
  const now = new Date();
  const msSinceRefill = now.getTime() - lastRefill.getTime();
  const unitsToAdd = Math.floor(msSinceRefill / ENERGY_REFILL_INTERVAL_MS);

  if (unitsToAdd <= 0) {
    const msUntilNext =
      ENERGY_REFILL_INTERVAL_MS - (msSinceRefill % ENERGY_REFILL_INTERVAL_MS);
    return {
      newEnergy: current,
      nextRefillAt: new Date(now.getTime() + msUntilNext),
    };
  }

  const newEnergy = Math.min(current + unitsToAdd, max);
  const nextRefillAt =
    newEnergy < max
      ? new Date(
          lastRefill.getTime() +
            (unitsToAdd + 1) * ENERGY_REFILL_INTERVAL_MS
        )
      : null;

  return { newEnergy, nextRefillAt };
}

// Format time remaining
export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "Ready!";
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}m`;
  }
  return `${mins}m ${secs}s`;
}
