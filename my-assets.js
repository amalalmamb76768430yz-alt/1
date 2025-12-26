import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://tngvhezfvgqnouzoyggr.supabase.co",
  "YOUR_PUBLIC_KEY"
);

async function loadAssets() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return;

  const userId = auth.user.id;

  // Wallets
  const { data: wallets } = await supabase
    .from("wallets")
    .select("currency, balance")
    .eq("user_id", userId);

  let totalAssets = 0;
  wallets.forEach(w => totalAssets += Number(w.balance));

  // Earnings
  const { data: earnings } = await supabase
    .from("earnings")
    .select("amount, type, created_at")
    .eq("user_id", userId);

  let totalPersonal = 0;
  let todayPersonal = 0;
  let totalTeam = 0;
  let todayTeam = 0;

  const today = new Date().toISOString().split("T")[0];

  earnings.forEach(e => {
    if (e.type === "personal") {
      totalPersonal += Number(e.amount);
      if (e.created_at.startsWith(today)) {
        todayPersonal += Number(e.amount);
      }
    }

    if (e.type === "team") {
      totalTeam += Number(e.amount);
      if (e.created_at.startsWith(today)) {
        todayTeam += Number(e.amount);
      }
    }
  });

  // UI update
  document.getElementById("total-assets").innerText = totalAssets.toFixed(2);
  document.getElementById("total-personal").innerText = totalPersonal.toFixed(2);
  document.getElementById("today-personal").innerText = todayPersonal.toFixed(2);
  document.getElementById("total-team").innerText = totalTeam.toFixed(2);
  document.getElementById("today-team").innerText = todayTeam.toFixed(2);

  wallets.forEach(w => {
    const percent = totalAssets > 0 ? ((w.balance / totalAssets) * 100).toFixed(2) : 0;
    document.getElementById(`${w.currency}-balance`).innerText = w.balance;
    document.getElementById(`${w.currency}-percent`).innerText = percent + "%";
  });
}

document.addEventListener("DOMContentLoaded", loadAssets);
