"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PLANS } from "@/lib/premium";
import { CheckCircle, Zap, Crown, ArrowLeft, Loader2 } from "lucide-react";

declare global {
  interface Window { Razorpay: any; }
}

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "lifetime">("monthly");

  const handleRazorpay = async (plan: "monthly" | "lifetime") => {
    setLoading("razorpay-" + plan);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/"); return; }

    // Load Razorpay script
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
      await new Promise(r => script.onload = r);
    }

    const res = await fetch("/api/payment/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const { orderId, amount, keyId } = await res.json();

    const rzp = new window.Razorpay({
      key: keyId,
      amount,
      currency: "INR",
      name: "Codevance",
      description: plan === "monthly" ? "Pro Monthly Plan" : "Pro Lifetime Plan",
      order_id: orderId,
      prefill: { email: user.email },
      theme: { color: "#6366F1" },
      handler: async (response: any) => {
        await fetch("/api/payment/razorpay-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...response,
            user_id: user.id,
            plan,
          }),
        });
        router.push("/dashboard?payment=success");
      },
    });
    rzp.open();
    setLoading(null);
  };

  const handleStripe = async (plan: "monthly" | "lifetime") => {
    setLoading("stripe-" + plan);
    const res = await fetch("/api/payment/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-slate-200">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push("/dashboard")}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors text-sm">
          <ArrowLeft size={14} /> Dashboard
        </button>
        <div className="flex items-center gap-2 ml-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">C</div>
          <span className="font-bold text-white">Codevance</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-4">
            <Crown size={11} /> Upgrade to Pro
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Unlock your full potential</h1>
          <p className="text-slate-400 text-lg">Get unlimited questions, all tracks, 10 energy, and free certificates</p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-10">
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            <button onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${billingCycle === "monthly" ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-white"}`}>
              Monthly
            </button>
            <button onClick={() => setBillingCycle("lifetime")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${billingCycle === "lifetime" ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-white"}`}>
              Lifetime
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">BEST VALUE</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Free */}
          <div className="bg-white/2 border border-white/8 rounded-2xl p-6">
            <div className="mb-6">
              <div className="text-sm font-medium text-slate-400 mb-1">Free</div>
              <div className="text-4xl font-black text-white">₹0</div>
              <div className="text-slate-500 text-sm mt-1">Forever free</div>
            </div>
            <ul className="space-y-3 mb-6">
              {PLANS.free.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                  <CheckCircle size={14} className="text-slate-600 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button onClick={() => router.push("/dashboard")}
              className="w-full py-2.5 border border-white/10 text-slate-400 rounded-xl text-sm transition-colors hover:border-white/20">
              Current Plan
            </button>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-b from-indigo-500/10 to-purple-500/5 border border-indigo-500/30 rounded-2xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
              MOST POPULAR
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Crown size={14} className="text-purple-400" />
                <div className="text-sm font-medium text-purple-400">Pro</div>
              </div>
              <div className="text-4xl font-black text-white">
                {billingCycle === "monthly" ? "₹249" : "₹2,499"}
              </div>
              <div className="text-slate-400 text-sm mt-1">
                {billingCycle === "monthly" ? "per month" : "one-time, lifetime access"}
              </div>
              {billingCycle === "lifetime" && (
                <div className="text-emerald-400 text-xs mt-1">= ₹208/mo · Save ₹490/yr vs monthly</div>
              )}
            </div>
            <ul className="space-y-3 mb-6">
              {(billingCycle === "monthly" ? PLANS.monthly : PLANS.lifetime).features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle size={14} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Payment buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleRazorpay(billingCycle)}
                disabled={!!loading}
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                {loading === "razorpay-" + billingCycle
                  ? <Loader2 size={15} className="animate-spin" />
                  : <Zap size={15} />}
                Pay with UPI / Cards (India)
              </button>
              <button
                onClick={() => handleStripe(billingCycle)}
                disabled={!!loading}
                className="w-full py-2.5 bg-white/5 hover:bg-white/8 disabled:opacity-60 text-slate-300 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm border border-white/10">
                {loading === "stripe-" + billingCycle
                  ? <Loader2 size={15} className="animate-spin" />
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>}
                Pay with Card (International)
              </button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-white mb-5 text-center">Common questions</h2>
          <div className="space-y-4">
            {[
              { q: "Can I cancel anytime?", a: "Yes. Monthly plan cancels at end of billing period. Lifetime is yours forever." },
              { q: "What payment methods are accepted?", a: "UPI, credit/debit cards, net banking, wallets via Razorpay (India). International cards via Stripe." },
              { q: "What happens to my progress if I downgrade?", a: "All your progress and XP are saved. You just lose access to premium modules until you resubscribe." },
              { q: "Is the certificate recognized anywhere?", a: "Codevance certificates are portfolio credentials — put them on LinkedIn and your resume to show employers you've completed the curriculum." },
            ].map((item) => (
              <div key={item.q} className="bg-white/2 border border-white/5 rounded-xl p-4">
                <div className="font-medium text-white text-sm mb-1">{item.q}</div>
                <div className="text-slate-400 text-sm">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
