import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://tngvhezfvgqnouzoyggr.supabase.co";
const SUPABASE_KEY = "YOUR_PUBLIC_ANON_KEY";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadMemberData() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return;

  const userId = auth.user.id;

  // Wallet
  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", userId)
    .single();

  // Active referrals
  const { count: activeMembers } = await supabase
    .from("invitations")
    .select("*", { count: "exact" })
    .eq("inviter_id", userId)
    .eq("is_active", true);

  // User level
  const { data: user } = await supabase
    .from("users")
    .select("level")
    .eq("id", userId)
    .single();

  renderMember({
    balance: wallet?.balance || 0,
    level: user?.level || "V0",
    activeMembers: activeMembers || 0
  });
}

function renderMember(data) {
  document.getElementById("member-level").innerText = data.level;
  document.getElementById("member-balance").innerText = data.balance;
  document.getElementById("member-team").innerText = data.activeMembers;
}

document.addEventListener("DOMContentLoaded", loadMemberData);
