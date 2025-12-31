<script lang="ts">
  import { onMount } from 'svelte';

  onMount(() => {
    const saved = localStorage.getItem('cairn-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  });
</script>

<slot />
