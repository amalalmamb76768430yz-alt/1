import { supabase } from "./sb-config.js";

window.ExaAuth = {
  async registerWithInvite({ phone, usedInviteCode }) {
    const { data, error } = await supabase.rpc("register_user", {
      p_phone: phone,
      p_invite_code: usedInviteCode
    });

    if (error) {
      throw error;
    }

    return data;
  }
};