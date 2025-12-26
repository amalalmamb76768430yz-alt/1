async function submitWithdraw() {
  const user = await UserService.getCurrentUserSafe();
  if (!user) return;

  const amount = parseFloat(document.getElementById("withdraw_amount").value);
  if (!amount || amount < 20) {
    return alert("Minimum withdraw is 20 USDT");
  }

  // 1. Get wallet
  const { data: wallet } = await App.supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", user.id)
    .single();

  if (!wallet || wallet.balance < amount) {
    return alert("Insufficient balance");
  }

  // 2. Check last deposit
  const { data: lastDeposit } = await App.supabase
    .from("deposits")
    .select("created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (lastDeposit?.length) {
    const diff = Date.now() - new Date(lastDeposit[0].created_at).getTime();
    if (diff < 3 * 24 * 60 * 60 * 1000)
      return alert("Withdraw allowed after 3 days from last deposit");
  }

  // 3. Check last withdraw
  const { data: lastWithdraw } = await App.supabase
    .from("withdrawals")
    .select("created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (lastWithdraw?.length) {
    const diff = Date.now() - new Date(lastWithdraw[0].created_at).getTime();
    if (diff < 3 * 24 * 60 * 60 * 1000)
      return alert("Withdraw allowed every 3 days");
  }

  // 4. Check AI Power usage
  const { data: lastAi } = await App.supabase
    .from("transactions")
    .select("created_at")
    .eq("user_id", user.id)
    .eq("type", "ai_power")
    .order("created_at", { ascending: false })
    .limit(1);

  if (lastAi?.length) {
    const diff = Date.now() - new Date(lastAi[0].created_at).getTime();
    if (diff < 3 * 60 * 60 * 1000)
      return alert("Withdraw allowed 3 hours after AI Power usage");
  }

  // 5. Deduct balance
  await App.supabase
    .from("wallets")
    .update({ balance: wallet.balance - amount })
    .eq("user_id", user.id);

  // 6. Insert withdraw request
  await App.supabase.from("withdrawals").insert({
    user_id: user.id,
    amount,
    status: "pending"
  });

  // 7. Log transaction
  await App.supabase.from("transactions").insert({
    user_id: user.id,
    amount,
    type: "withdraw",
    status: "pending"
  });

  alert("Withdraw request sent successfully");
}
