
// auth.js - FIXED (no UI changes)

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_KEY = window.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Supabase credentials missing");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

window.Auth = {
  async signUp(phone, password, inviteCode) {
    const { data, error } = await supabase.auth.signUp({
      phone,
      password
    });

    if (error) return { error };

    if (inviteCode) {
      await supabase.from("invitations").insert({
        inviter_code: inviteCode,
        invited_user_id: data.user.id
      });
    }

    return { user: data.user };
  },

  async login(phone, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      phone,
      password
    });
    if (error) return { error };
    return { user: data.user };
  },

  async getUser() {
    const { data } = await supabase.auth.getUser();
    return data?.user;
  }
};
