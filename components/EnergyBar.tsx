"use client";
import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { usePremium } from "@/lib/premium-context";
import { formatTimeRemaining } from "@/lib/premium";

export function EnergyBar() {
  const { energy, maxEnergy, nextEnergyAt, isPremium } = usePremium();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!nextEnergyAt) { setTimeLeft(""); return; }
    const update = () => {
      const ms = nextEnergyAt.getTime() - Date.now();
      setTimeLeft(ms > 0 ? formatTimeRemaining(ms) : "Refilling...");
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, [nextEnergyAt]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: maxEnergy }).map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm transition-colors ${
            i < energy
              ? isPremium ? "bg-purple-400" : "bg-yellow-400"
              : "bg-white/10"
          }`} />
        ))}
      </div>
      <span className="text-xs text-slate-500">
        {energy}/{maxEnergy}
        {energy < maxEnergy && nextEnergyAt && (
          <span className="text-slate-600 ml-1">+1 in {timeLeft}</span>
        )}
      </span>
      {!isPremium && (
        <a href="/pricing" className="text-[10px] text-purple-400 hover:underline ml-1">
          Get 10 ⚡
        </a>
      )}
    </div>
  );
}

export function EnergyGate({
  cost,
  children,
  onProceed,
}: {
  cost: number;
  children: React.ReactNode;
  onProceed: () => void;
}) {
  const { energy, useEnergy } = usePremium();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    if (energy < cost) {
      setError(`Not enough energy. Need ${cost}, have ${energy}.`);
      return;
    }
    if (!confirming) { setConfirming(true); return; }
    const ok = await useEnergy(cost);
    if (!ok) { setError("Failed to use energy"); return; }
    setConfirming(false);
    onProceed();
  };

  return (
    <div>
      {error && (
        <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
          {error}{" "}
          <a href="/pricing" className="underline">Upgrade for more energy</a>
        </div>
      )}
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          energy < cost
            ? "bg-white/5 text-slate-500 cursor-not-allowed"
            : confirming
            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
            : "bg-indigo-500 hover:bg-indigo-600 text-white"
        }`}
      >
        <Zap size={14} />
        {confirming
          ? `Confirm (uses ${cost} ⚡)`
          : energy < cost
          ? `Need ${cost} energy (have ${energy})`
          : children}
      </button>
      {confirming && (
        <button onClick={() => setConfirming(false)} className="mt-2 text-xs text-slate-500 hover:text-slate-400">
          Cancel
        </button>
      )}
    </div>
  );
}
