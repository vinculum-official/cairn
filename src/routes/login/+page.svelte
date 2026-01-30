<script lang="ts">
  import { signInWithGitHub } from '$lib/auth'
</script>

<main>
<p>cairn is a productivity tool. it has (currently) notes, and a drawing tool.</p>
<button on:click={signInWithGitHub}>
  Sign in with GitHub
</button>
</main>