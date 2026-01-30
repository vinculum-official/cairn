<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import { Markdown } from '@tiptap/markdown';
  import Placeholder from '@tiptap/extension-placeholder';

  let editor: Editor;
  let editorEl: HTMLDivElement;

  onMount(() => {
    editor = new Editor({
      element: editorEl,
      extensions: [
      StarterKit,
      Markdown,
      Placeholder.configure({
        placeholder: 'Start jotting down your thoughts...',
      }),
    ],
      contentType: 'markdown',
    });

    // Focus the editor immediately
    editor.commands.focus();
  });

  onDestroy(() => editor?.destroy());

  function saveMarkdown() {
    if (!editor) return;
    const md = editor.getMarkdown();

    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'cairn-note.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }
</script>

<svelte:head>
  <title>Cairn — Jots</title>
</svelte:head>

<div class="editor-wrapper">
  <div bind:this={editorEl} class="editor"></div>
</div>

<footer>
  <nav>
    <center>
    <span class="spacer">/</span>
    <a href="/">home</a>
    <span class="spacer0">/</span>
    <a class="active" href="/jots">jots</a>
    <span class="spacer1">/</span>
    <a href="/doodle">doodle</a>
    <span class="spacer3">/</span>
    </center>
    <button class="settings-btn" on:click={saveMarkdown}>save</button>
  </nav>
</footer>