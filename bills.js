// ===============================
// BILLS / TRANSACTIONS
// ===============================

async function loadBills() {
  const user = await UserService.getCurrentUserSafe();
  if (!user) return;

  const { data, error } = await App.supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  renderBills(data || []);
}

function renderBills(bills) {
  const table = document.getElementById("billsTable");
  table.innerHTML = "";

  bills.forEach(bill => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${bill.type}</td>
      <td>${bill.amount}</td>
      <td>${bill.status || "-"}</td>
      <td>${new Date(bill.created_at).toLocaleString()}</td>
    `;

    table.appendChild(row);
  });
}

// Auto load
document.addEventListener("DOMContentLoaded", loadBills);
