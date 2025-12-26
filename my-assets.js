
import { supabase } from "./config.js";

const { data: user } = await supabase.auth.getUser();
if (!user?.user) return;

const { data: wallet } = await supabase
  .from("wallets")
  .select("*")
  .eq("user_id", user.user.id)
  .single();

if (wallet) {
  document.getElementById("total-balance").innerText = wallet.balance;
}
