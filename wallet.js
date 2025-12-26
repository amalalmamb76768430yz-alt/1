// ===============================
// WALLET CORE FUNCTIONS
// ===============================

async function getWallet(userId) {
  const { data, error } = await App.supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
}

async function createWalletIfNotExists(userId) {
  const wallet = await getWallet(userId);
  if (wallet) return wallet;

  const { data, error } = await App.supabase
    .from("wallets")
    .insert({
      user_id: userId,
      balance: 0
    })
    .select()
    .single();

  if (error) return null;
  return data;
}

async function addBalance(userId, amount, reason = "system") {
  const wallet = await createWalletIfNotExists(userId);
  if (!wallet) return false;

  const newBalance = Number(wallet.balance) + Number(amount);

  const { error } = await App.supabase
    .from("wallets")
    .update({ balance: newBalance })
    .eq("user_id", userId);

  if (error) return false;

  await App.supabase.from("transactions").insert({
    user_id: userId,
    amount: amount,
    type: "credit",
    status: "completed",
    description: reason
  });

  return true;
}

async function subtractBalance(userId, amount, reason = "system") {
  const wallet = await getWallet(userId);
  if (!wallet) return false;

  if (Number(wallet.balance) < Number(amount)) return false;

  const newBalance = Number(wallet.balance) - Number(amount);

  const { error } = await App.supabase
    .from("wallets")
    .update({ balance: newBalance })
    .eq("user_id", userId);

  if (error) return false;

  await App.supabase.from("transactions").insert({
    user_id: userId,
    amount: amount,
    type: "debit",
    status: "completed",
    description: reason
  });

  return true;
}

// ===============================
// EXPORT
// ===============================

window.Wallet = {
  getWallet,
  createWalletIfNotExists,
  addBalance,
  subtractBalance
};
