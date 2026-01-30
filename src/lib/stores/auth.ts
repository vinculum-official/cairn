import { writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js'; // import User type
import { supabase } from '$lib/supabase';

// fix: writable can hold User or null
export const user = writable<User | null>(null);

// get current session
supabase.auth.getSession().then(({ data }) => {
  user.set(data.session?.user ?? null);
});

// listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  user.set(session?.user ?? null);
});
