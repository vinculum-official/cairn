<script lang="ts">
  import { user } from '$lib/stores/auth';
  import { supabase } from '$lib/supabase'; // <-- add this
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import './theme.css';
  import favicon from '$lib/assets/favicon.svg';

  let sessionLoaded = false;

  onMount(async () => {
    // Wait for Supabase session to load
    const { data } = await supabase.auth.getSession();
    user.set(data.session?.user ?? null);
    sessionLoaded = true;

    if ($user === null && !window.location.pathname.startsWith('/login')) {
      goto('/login');
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{#if sessionLoaded}
  <slot />
{/if}
