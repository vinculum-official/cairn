<script lang="ts">
  import { signInWithGitHub } from '$lib/auth'
</script>


<svelte:head>
  <title>Cairn — Login</title>
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"
/>
</svelte:head>

<main>
<p>cairn is a productivity tool. it has (currently) notes, and a drawing tool.</p>
<button on:click={signInWithGitHub}>
  Sign in with GitHub
</button>
</main>