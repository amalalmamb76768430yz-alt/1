
// Supabase global init
const SUPABASE_URL = "https://tngvhezfvgqnouzoyggr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ3ZoZXpmdmdxbm91em95Z2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2Nzc3NTQsImV4cCI6MjA4MjI1Mzc1NH0.uUtcsfrid_QUZhiPELtgscQNJ4kl6l3n9RsH5kR2CvY";

window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
