// ===============================
// USER CORE FUNCTIONS
// ===============================

async function getCurrentUserSafe() {
  const { data, error } = await App.supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}

async function getUserProfile() {
  const user = await getCurrentUserSafe();
  if (!user) return null;

  const { data, error } = await App.supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return null;
  return data;
}

async function getUserWallet() {
  const user = await getCurrentUserSafe();
  if (!user) return null;

  const { data, error } = await App.supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) return null;
  return data;
}

async function getUserLevel() {
  const user = await getCurrentUserSafe();
  if (!user) return null;

  const { data, error } = await App.supabase
    .from("levels")
    .select("*")
    .eq("level_code", user.level)
    .single();

  if (error) return null;
  return data;
}

// ===============================
// ACCESS CHECKS
// ===============================

async function canUserEarn() {
  const wallet = await getUserWallet();
  if (!wallet) return false;

  return Number(wallet.balance) >= 50;
}

// ===============================
// EXPORT
// ===============================

window.UserService = {
  getCurrentUserSafe,
  getUserProfile,
  getUserWallet,
  getUserLevel,
  canUserEarn
};
