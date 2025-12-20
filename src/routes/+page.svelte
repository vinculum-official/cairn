<script lang="ts">
    function settingsMarkdown() {
    // Placeholder for settings functionality
    alert('Settings functionality is not implemented yet.');
  }
</script>

<svelte:head>
  <title>Cairn — Home</title>
</svelte:head>

<div class="editor-wrapper">
<h1>welcome to cairn!</h1>
<p>cairn is your personal space for thoughts and ideas. notes, random thoughts, chilling, work, all can be done here. dive right in!</p>
<p>use the navigation below to explore different sections of the app.</p>
<hr style="border: 2px dashed #cfccbeab;" />
<h2>features:</h2>
<ul>
  <li><strong>jots:</strong> a minimalist note-taking section to quickly jot down ideas and thoughts.</li>
  <li><strong>doodle:</strong> a simple drawing canvas for sketching and visual brainstorming.</li>
  <li><strong>timer:</strong> a pomodoro timer to help you manage your work sessions and breaks effectively.</li>
</ul>
<p>happy creating!</p>

<sub>PS: This is a prototype. A LOT of features are missing. Settings buttons are broken, no font selection etc. The pomodoro timer alarm doesn't work fully yet. I need to add widgets etc. I hope its useful!</sub>
</div>

<footer>
  <nav>
    <center>
    <span class="spacer">/</span>
    <a class="active" href="/">home</a>
    <span class="spacer0">/</span>
    <a href="/jots">jots</a>
    <span class="spacer1">/</span>
    <a href="/doodle">doodle</a>
    <span class="spacer3">/</span>
    <a href="/timer">timer</a>
    <span class="spacer4">/</span>
    </center>
  </nav>
  <button class="settings-btn" on:click={settingsMarkdown}>settings</button>
</footer>