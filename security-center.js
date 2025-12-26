// ==============================
// SECURITY CENTER
// ==============================

async function loadSecurityInfo() {
  const user = await UserService.getCurrentUserSafe();
  if (!user) return;

  const { data } = await App.supabase
    .from("users")
    .select("email, withdraw_address")
    .eq("id", user.id)
    .single();

  if (data) {
    document.getElementById("email").value = data.email || "";
    document.getElementById("withdraw_address").value = data.withdraw_address || "";
  }
}

// Update Email
async function updateEmail() {
  const user = await UserService.getCurrentUserSafe();
  const email = document.getElementById("email").value;

  if (!email) return alert("Email required");

  await App.supabase
    .from("users")
    .update({ email, updated_at: new Date() })
    .eq("id", user.id);

  alert("Email updated");
}

// Update Password
async function updatePassword() {
  const user = await UserService.getCurrentUserSafe();
  const password = document.getElementById("password").value;

  if (password.length < 6) return alert("Password too short");

  const hash = await hashPassword(password);

  await App.supabase
    .from("users")
    .update({ password_hash: hash, updated_at: new Date() })
    .eq("id", user.id);

  alert("Password updated");
}

// Update Withdraw Address
async function updateWithdrawAddress() {
  const user = await UserService.getCurrentUserSafe();
  const address = document.getElementById("withdraw_address").value;

  if (!address.startsWith("0x")) {
    alert("Invalid address");
    return;
  }

  await App.supabase
    .from("users")
    .update({ withdraw_address: address })
    .eq("id", user.id);

  alert("Withdraw address updated");
}

// Simple password hash
async function hashPassword(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

window.SecurityCenter = {
  loadSecurityInfo,
  updateEmail,
  updatePassword,
  updateWithdrawAddress
};
