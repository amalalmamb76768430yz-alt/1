// auth.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://tngvhezfvgqnouzoyggr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ3ZoZXpmdmdxbm91em95Z2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2Nzc3NTQsImV4cCI6MjA4MjI1Mzc1NH0.uUtcsfrid_QUZhiPELtgscQNJ4kl6l3n9RsH5kR2CvY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// SIGN UP
export async function signUp(phone, password, inviteCode) {
    const { data, error } = await supabase.auth.signUp({
        phone,
        password
    });

    if (error) throw error;

    const userId = data.user.id;

    // insert into users table
    await supabase.from("users").insert({
        id: userId,
        phone: phone,
        invite_code: inviteCode,
        is_active: true
    });

    return data;
}