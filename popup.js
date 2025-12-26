import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://tngvhezfvgqnouzoyggr.supabase.co",
  "YOUR_PUBLIC_KEY"
);

async function loadPopup() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return;

  const userId = userData.user.id;

  // Get wallet balance
  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", userId)
    .single();

  // Active promotion
  const { data: promo } = await supabase
    .from("promotions")
    .select("*")
    .eq("is_active", true)
    .single();

  if (!promo || wallet.balance < promo.min_balance) return;

  // Check if already used
  const { data: used } = await supabase
    .from("user_promotion_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("promotion_id", promo.id)
    .maybeSingle();

  if (used) return;

  showPopup(promo);
}

function showPopup(promo) {
  const popup = document.getElementById("promo-popup");
  popup.style.display = "block";

  document.getElementById("promo-title").innerText = promo.title;
  document.getElementById("promo-reward").innerText = promo.reward;
}

async function claimReward(promoId, reward) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;

  // Add reward
  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", userId)
    .single();

  await supabase
    .from("wallets")
    .update({ balance: wallet.balance + reward })
    .eq("user_id", userId);

  // Log reward
  await supabase.from("promotion_rewards").insert({
    user_id: userId,
    reward
  });

  await supabase.from("user_promotion_logs").insert({
    user_id: userId,
    promotion_id: promoId
  });

  document.getElementById("promo-popup").style.display = "none";
  alert("Reward added!");
}

window.claimReward = claimReward;
document.addEventListener("DOMContentLoaded", loadPopup);
