// ============================
// ACCOUNT INFORMATION (MINIMAL)
// ============================

async function loadAccountInfo() {
  const user = await UserService.getCurrentUserSafe();
  if (!user) return;

  const { data: userData } = await App.supabase
    .from("users")
    .select("id, phone")
    .eq("id", user.id)
    .single();

  if (!userData) return;

  document.getElementById("acc-id").innerText = userData.id;
  document.getElementById("acc-phone").innerText = userData.phone;
}

document.addEventListener("DOMContentLoaded", loadAccountInfo);
