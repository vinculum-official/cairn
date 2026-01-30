import { writable } from 'svelte/store';

export const currentJot = writable({
  id: '',
  title: '',
  content: ''
});

export const allJots = writable<any[]>([]);
