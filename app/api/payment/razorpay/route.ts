import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json(); // 'monthly' | 'lifetime'

  const amounts: Record<string, number> = {
    monthly: 24900,   // ₹249
    lifetime: 249900, // ₹2499
  };

  const amount = amounts[plan];
  if (!amount) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  try {
    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `ct_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: { user_id: user.id, plan },
    });

    return NextResponse.json({
      orderId: order.id,
      amount,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (e: any) {
    console.error("Razorpay order error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
