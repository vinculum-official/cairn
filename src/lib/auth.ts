import { supabase } from '$lib/supabase.client'

export async function signInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github'
  })
  if (error) console.error(error)
}
