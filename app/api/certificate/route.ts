import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(c) { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { trackId, paymentId } = await req.json();

  // Check subscription
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .single();

  const isPremium = sub?.plan === "monthly" || sub?.plan === "lifetime";

  // Free user must have payment
  if (!isPremium && !paymentId) {
    return NextResponse.json({ error: "Payment required for free users" }, { status: 402 });
  }

  // Check all lessons in track are completed
  const { data: progress } = await supabase
    .from("user_progress")
    .select("lesson_id, completed")
    .eq("user_id", user.id);

  // Issue certificate
  const { error } = await supabaseAdmin.from("certificate_purchases").upsert({
    user_id: user.id,
    track_id: trackId,
    amount_paid: isPremium ? 0 : 4900,
    payment_id: paymentId || null,
    issued_at: new Date().toISOString(),
  }, { onConflict: "user_id,track_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    success: true,
    certificateId: `CT-${trackId.toUpperCase()}-${user.id.slice(0, 8).toUpperCase()}`,
    issuedAt: new Date().toISOString(),
  });
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(c) { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("certificate_purchases")
    .select("*")
    .eq("user_id", user.id);

  return NextResponse.json({ certificates: data || [] });
}
