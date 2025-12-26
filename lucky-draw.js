import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://tngvhezfvgqnouzoyggr.supabase.co",
  "YOUR_PUBLIC_KEY"
);

async function spinLuckyDraw() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return alert("Not logged in");

  const userId = auth.user.id;

  // Get wallet
  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", userId)
    .single();

  if (!wallet) return;

  const balance = wallet.balance;

  // Check if already used today
  const today = new Date().toISOString().split("T")[0];

  const { data: used } = await supabase
    .from("user_promotion_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("used_at", today);

  if (used.length > 0) {
    alert("You already used today");
    return;
  }

  // Determine reward
  let reward = 0;

  if (balance < 200) reward = 55;
  else if (balance < 500) reward = 25;
  else if (balance < 1000) reward = 15;
  else reward = 5;

  // Add reward to wallet
  await supabase
    .from("wallets")
    .update({ balance: balance + reward })
    .eq("user_id", userId);

  // Log reward
  await supabase.from("promotion_rewards").insert({
    user_id: userId,
    reward
  });

  await supabase.from("user_promotion_logs").insert({
    user_id: userId,
    used_at: new Date()
  });

  alert("You won " + reward + " USDT!");
}

document.getElementById("spinBtn").addEventListener("click", spinLuckyDraw);
