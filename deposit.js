// ===============================
// DEPOSIT SYSTEM
// ===============================

async function createDeposit(amount) {
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    alert("Invalid amount");
    return;
  }

  const user = await UserService.getCurrentUserSafe();
  if (!user) {
    alert("User not logged in");
    return;
  }

  const { error } = await App.supabase
    .from("deposits")
    .insert({
      user_id: user.id,
      amount: Number(amount),
      status: "completed"
    });

  if (error) {
    console.error(error);
    alert("Deposit failed");
    return;
  }

  alert("Deposit successful");
}

// ===============================
// EXPORT
// ===============================

window.Deposit = {
  createDeposit
};
