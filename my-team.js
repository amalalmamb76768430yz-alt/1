// ===============================
// MY TEAM SYSTEM
// ===============================

async function loadMyTeam() {
  const user = await UserService.getCurrentUserSafe();
  if (!user) return;

  // Fetch invitation tree
  const { data: team } = await App.supabase
    .from("invitations")
    .select("*")
    .eq("inviter_id", user.id)
    .order("level", { ascending: true });

  renderTeam(team || []);

  // Get referral code
  const profile = await UserService.getUserProfile();
  if (profile?.referral_code) {
    document.getElementById("referralCode").innerText = profile.referral_code;
  }
}

// Render team data
function renderTeam(data) {
  const table = document.getElementById("teamTable");
  table.innerHTML = "";

  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>Level ${row.level}</td>
      <td>${row.invited_user_id}</td>
      <td>${row.is_effective ? "Active" : "Inactive"}</td>
    `;
    table.appendChild(tr);
  });
}

// ===============================
// EXPORT
// ===============================

window.Team = {
  loadMyTeam
};
