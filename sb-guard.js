import { supabase } from "./sb-config.js";

const { data } = await supabase.auth.getSession();

if (!data.session) {
  window.location.href = "signup.html";
}
