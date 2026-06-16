import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user_id, plan } = await req.json();

  // Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSig !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Update subscription
  const periodEnd = plan === "monthly"
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    : null; // lifetime = no end

  await supabaseAdmin.from("subscriptions").upsert({
    user_id,
    plan,
    status: "active",
    razorpay_payment_id,
    current_period_end: periodEnd,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });

  // Upgrade energy to 10
  await supabaseAdmin.from("energy").upsert({
    user_id,
    current: 10,
    max_energy: 10,
    last_refill: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });

  return NextResponse.json({ success: true });
}
