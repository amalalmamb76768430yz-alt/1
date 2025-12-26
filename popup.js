
import { supabase } from "./config.js";

const { data } = await supabase
  .from("promotions")
  .select("*")
  .eq("active", true)
  .single();

if (data) {
  document.getElementById("popup-title").innerText = data.title;
  document.getElementById("popup-reward").innerText = data.reward;
}
