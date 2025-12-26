// ===============================
// AI POWER SYSTEM
// ===============================

async function canUseAIPower(userId) {
  const { data } = await App.supabase
    .from("earnings")
    .select("created_at")
    .eq("user_id", userId)
    .eq("type", "ai")
    .order("created_at", { ascending: false })
    .limit(1);

  if (!data || data.length === 0) return true;

  const last = new Date(data[0].created_at);
  const now = new Date();

  const diffHours = (now - last) / (1000 * 60 * 60);
  return diffHours >= 24;
}

function calculateAIPowerReward(balance) {
  return Number((balance * 0.0175).toFixed(2));
}

async function activateAIPower() {
  const user = await UserService.getCurrentUserSafe();
  if (!user) return alert("Not logged in");

  const wallet = await Wallet.getWallet(user.id);
  if (!wallet || wallet.balance < 50) {
    alert("Minimum balance is 50");
    return;
  }

  const allowed = await canUseAIPower(user.id);
  if (!allowed) {
    alert("You can use AI Power once every 24 hours");
    return;
  }

  const reward = calculateAIPowerReward(wallet.balance);

  await Earnings.addEarning({
    userId: user.id,
    sourceUserId: user.id,
    level: 0,
    amount: reward,
    type: "ai"
  });

  alert(`AI Power Reward: ${reward}`);
}

// ===============================
// EXPORT
// ===============================

window.AIPower = {
  activateAIPower
};
