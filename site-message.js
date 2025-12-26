import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Supabase config
const SUPABASE_URL = "https://tngvhezfvgqnouzoyggr.supabase.co";
const SUPABASE_KEY = "YOUR_PUBLIC_ANON_KEY";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Get logged user
async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}

// Load messages
async function loadMessages() {
  const user = await getCurrentUser();
  if (!user) return;

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const container = document.getElementById("messages-container");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = `<p>No messages found</p>`;
    return;
  }

  data.forEach(msg => {
    const div = document.createElement("div");
    div.className = "message-box";

    div.innerHTML = `
      <h4>${msg.title}</h4>
      <p>${msg.content}</p>
      <small>${new Date(msg.created_at).toLocaleString()}</small>
    `;

    container.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", loadMessages);
