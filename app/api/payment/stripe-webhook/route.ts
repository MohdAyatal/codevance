import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e: any) {
    return NextResponse.json({ error: `Webhook error: ${e.message}` }, { status: 400 });
  }

  const activateUser = async (userId: string, plan: string, periodEnd: string | null, customerId?: string, subId?: string) => {
    await supabaseAdmin.from("subscriptions").upsert({
      user_id: userId,
      plan,
      status: "active",
      stripe_customer_id: customerId,
      stripe_subscription_id: subId,
      current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    await supabaseAdmin.from("energy").upsert({
      user_id: userId,
      current: 10,
      max_energy: 10,
      last_refill: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
  };

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan;
      if (!userId || !plan) break;

      const periodEnd = plan === "monthly"
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : null;

      await activateUser(userId, plan, periodEnd,
        session.customer as string,
        session.subscription as string
      );
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
      const userId = sub.metadata?.user_id;
      if (!userId) break;

      const periodEnd = new Date(sub.current_period_end * 1000).toISOString();
      await activateUser(userId, "monthly", periodEnd, sub.customer as string, sub.id);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.user_id;
      if (!userId) break;

      await supabaseAdmin.from("subscriptions").update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      }).eq("user_id", userId);

      // Downgrade energy to 5
      await supabaseAdmin.from("energy").update({
        max_energy: 5,
        current: 5,
        updated_at: new Date().toISOString(),
      }).eq("user_id", userId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
