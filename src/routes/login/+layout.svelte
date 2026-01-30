<script lang="ts">
  import { user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import '../theme.css'; // your global theme CSS
  import favicon from '$lib/assets/favicon.svg';

  export let data;

  onMount(() => {
    // Skip login page itself
    if ($user === null && !window.location.pathname.startsWith('/login')) {
      goto('/login');
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<slot /> <!-- all page content renders here -->
