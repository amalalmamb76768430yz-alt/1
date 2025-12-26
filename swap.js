import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://tngvhezfvgqnouzoyggr.supabase.co",
  "YOUR_PUBLIC_KEY"
);

async function swapCurrency(from, to, amount) {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return alert("Not logged in");

  const userId = user.user.id;

  // Get wallet
  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .eq("currency", from)
    .single();

  if (!wallet || wallet.balance < amount)
    return alert("Insufficient balance");

  // Rates
  const rates = {
    "USDT_USDC": 1,
    "USDT_BTC": 0.000015,
    "USDT_ETH": 0.00025
  };

  const rateKey = `${from}_${to}`;
  const rate = rates[rateKey];
  if (!rate) return alert("Invalid pair");

  const received = amount * rate;

  // Deduct
  await supabase
    .from("wallets")
    .update({ balance: wallet.balance - amount })
    .eq("user_id", userId)
    .eq("currency", from);

  // Add to target wallet
  const { data: targetWallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .eq("currency", to)
    .single();

  if (targetWallet) {
    await supabase
      .from("wallets")
      .update({ balance: targetWallet.balance + received })
      .eq("id", targetWallet.id);
  } else {
    await supabase.from("wallets").insert({
      user_id: userId,
      currency: to,
      balance: received
    });
  }

  // Log swap
  await supabase.from("swap").insert({
    user_id: userId,
    from_currency: from,
    to_currency: to,
    from_amount: amount,
    to_amount: received,
    rate
  });

  alert("Swap completed successfully");
}

window.swapCurrency = swapCurrency;
