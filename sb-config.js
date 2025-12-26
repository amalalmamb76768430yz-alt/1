// ===============================
// Supabase Configuration
// ===============================

const SUPABASE_URL = "https://tngvhezfvgqnouzoyggr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ3ZoZXpmdmdxbm91em95Z2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2Nzc3NTQsImV4cCI6MjA4MjI1Mzc1NH0.uUtcsfrid_QUZhiPELtgscQNJ4kl6l3n9RsH5kR2CvY";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ===============================
// AUTH
// ===============================

async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}

async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  return user;
}

async function logout() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}

// ===============================
// USER DATA
// ===============================

async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data;
}

// ===============================
// WALLET
// ===============================

async function getUserWallet(userId) {
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
}

// ===============================
// TRANSACTIONS
// ===============================

async function getUserTransactions(userId) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}

// ===============================
// EXPORT
// ===============================

window.App = {
  supabase,
  getCurrentUser,
  requireAuth,
  logout,
  getUserProfile,
  getUserWallet,
  getUserTransactions
};
