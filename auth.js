
// auth.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://tngvhezfvgqnouzoyggr.supabase.co'
const supabaseKey = 'YOUR_PUBLIC_ANON_KEY'
export const supabase = createClient(supabaseUrl, supabaseKey)

export async function signup(phone, password, inviteCode) {
  const { data, error } = await supabase.auth.signUp({
    phone: phone,
    password: password
  })

  if (error) throw error

  const user = data.user

  await supabase.from('users').insert({
    id: user.id,
    phone: phone,
    invite_code: inviteCode
  })

  return user
}
