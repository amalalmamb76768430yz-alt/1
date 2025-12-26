import { supabase } from "./sb-config.js";

export async function login(phone, password) {
  const { error } = await supabase.auth.signInWithPassword({
    phone,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  window.location.href = "account-information.html";
}
