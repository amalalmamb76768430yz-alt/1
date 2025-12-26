
window.ExaAuth = {
  async registerWithInvite({ phone, usedInviteCode }) {
    const { data, error } = await supabase.auth.signUp({
      phone: phone,
      password: Math.random().toString(36).slice(2) + "Aa1!"
    });

    if (error) throw error;

    return data.user;
  }
};
