import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { calculateRefill } from "@/lib/premium";

export async function GET() {
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
    .from("energy")
    .select("current, max_energy, last_refill")
    .eq("user_id", user.id)
    .single();

  if (!data) return NextResponse.json({ energy: 5, max: 5, nextRefillAt: null });

  const { newEnergy, nextRefillAt } = calculateRefill(
    data.current, data.max_energy, new Date(data.last_refill)
  );

  if (newEnergy !== data.current) {
    await supabase.from("energy").update({
      current: newEnergy,
      updated_at: new Date().toISOString(),
    }).eq("user_id", user.id);
  }

  return NextResponse.json({
    energy: newEnergy,
    max: data.max_energy,
    nextRefillAt: nextRefillAt?.toISOString() || null,
  });
}

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

  const { cost } = await req.json();

  const { data } = await supabase
    .from("energy")
    .select("current, max_energy, last_refill")
    .eq("user_id", user.id)
    .single();

  if (!data) return NextResponse.json({ error: "Energy not found" }, { status: 404 });

  const { newEnergy } = calculateRefill(data.current, data.max_energy, new Date(data.last_refill));

  if (newEnergy < cost) {
    return NextResponse.json({ error: "Not enough energy", energy: newEnergy }, { status: 402 });
  }

  await supabase.from("energy").update({
    current: newEnergy - cost,
    updated_at: new Date().toISOString(),
  }).eq("user_id", user.id);

  return NextResponse.json({ success: true, energy: newEnergy - cost });
}
