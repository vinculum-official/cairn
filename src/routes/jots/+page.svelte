<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import { Markdown } from '@tiptap/markdown';
  import Placeholder from '@tiptap/extension-placeholder';
  import HardBreak from '@tiptap/extension-hard-break';
  import { supabase } from '$lib/supabase';
  import { user } from '$lib/stores/auth';
  import { writable, get } from 'svelte/store';

  let editor: Editor;
  let editorEl: HTMLDivElement;

  const currentJot = writable<{ id?: string; title: string; content: string }>({
    title: '',
    content: ''
  });

  const allJots = writable<{ id: string; title: string; content: string }[]>([]);
  const editorVisible = writable(false);

  // ---- Load all jots ----
  async function loadJots() {
    if (!get(user)) return;
    const { data, error } = await supabase
      .from('jots')
      .select('*')
      .eq('user_id', get(user)?.id)
      .order('updated_at', { ascending: false });

    if (error) console.error(error);
    if (data) allJots.set(data as any);
  }

  // ---- Delete jot ----
  async function deleteJot(id: string) {
    const { error } = await supabase.from('jots').delete().eq('id', id);
    if (!error) allJots.update(js => js.filter(j => j.id !== id));

    const jot = get(currentJot);
    if (jot.id === id) {
      editorVisible.set(false);
      currentJot.set({ title: '', content: '' });
      editor?.commands.setContent('');
    }
  }

  // ---- Open editor ----
  async function openEditor(j?: { id?: string; title: string; content: string }) {
    currentJot.set(j ?? { title: '', content: '' });
    editorVisible.set(true);
    await tick();

    if (!editor) {
      editor = new Editor({
        element: editorEl,
        extensions: [
          StarterKit,
          Markdown,
          Placeholder.configure({ placeholder: 'Start jotting down your thoughts...' }),
          HardBreak
        ],
        contentType: 'markdown'
      });

      let saveTimeout: any;
      editor.on('update', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
          let content = editor.getMarkdown();
          // normalize line breaks
          content = content.replace(/\n([^\n])/g, '\n\n$1');

          const title =
            content.match(/^#\s*(.*)/)?.[1] || content.split('\n')[0] || 'Untitled';
          const jot = get(currentJot);

          // Delete if empty/untitled
          if (jot.id && (!title || title === 'Untitled') && !content.trim()) {
            await deleteJot(jot.id);
            return;
          }

          if (!jot.id) {
            if (!content.trim()) return; // skip empty
            const { data, error } = await supabase
              .from('jots')
              .insert({
                user_id: get(user)?.id,
                title,
                content
              })
              .select()
              .single();

            if (!error && data) {
              currentJot.set({ id: data.id, title: data.title, content: data.content });
              allJots.update(js => [data, ...js]);
            }
          } else {
            const { error } = await supabase
              .from('jots')
              .update({ title, content })
              .eq('id', jot.id);

            if (!error) {
              currentJot.update(j => ({ ...j, title, content }));
              allJots.update(js =>
                js.map(j => (j.id === jot.id ? { ...j, title, content } : j))
              );
            }
          }
        }, 1000);
      });
    }

    // Load content preserving formatting
    editor.commands.setContent(get(currentJot).content || '');
    editor.commands.focus();
  }

  // ---- Close editor ----
  async function closeEditor() {
    const jot = get(currentJot);
    const content = editor?.getMarkdown() || '';
    const title = content.match(/^#\s*(.*)/)?.[1] || content.split('\n')[0] || 'Untitled';

    // Delete if empty/untitled
    if (jot.id && (!title || title === 'Untitled') && !content.trim()) {
      await deleteJot(jot.id);
    }

    editorVisible.set(false);
    currentJot.set({ title: '', content: '' });
    editor?.commands.setContent('');
  }

  // ---- Save markdown ----
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

  loadJots();
  onDestroy(() => editor?.destroy());
</script>

<svelte:head>
  <title>Cairn — Jots</title>
</svelte:head>

<div class="jots-page">
  <!-- Editor -->
  <div class="editor-wrapper" style="display: {$editorVisible ? 'block' : 'none'};">
    <div bind:this={editorEl} class="editor"></div>
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
        <button class="settings-btn" on:click={closeEditor}>close</button>
      </nav>
    </footer>
  </div>

  <!-- Grid -->
  <div class="jots-grid" style="display: {$editorVisible ? 'none' : 'grid'};">
    <button class="jot-card new-jot" on:click={() => openEditor()}>+</button>
    {#each $allJots as gJot (gJot.id)}
      <div class="jot-card">
        <h3 on:click={() => openEditor(gJot)}>{gJot.title}</h3>
        <p on:click={() => openEditor(gJot)}>{gJot.content.split('\n')[0]}</p>
        <button class="settings-btn" on:click={() => deleteJot(gJot.id)}>🗑️</button>
      </div>
    {/each}
  </div>
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
        <button class="settings-btn" on:click={closeEditor}>close</button>
      </nav>
    </footer>
