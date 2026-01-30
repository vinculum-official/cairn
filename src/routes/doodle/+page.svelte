<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let drawing = false;
  let mode: 'paint' | 'erase' = 'paint';

  const brushSize = 6;
  let color: string = "#1d1d20";

  type Point = {
    x: number;
    y: number;
  };

  let points: Point[] = [];
  let rafId: number | null = null;

  // ---- undo / redo state ----
  let history: ImageData[] = [];
  let historyIndex = -1;

  const isBrowser = typeof window !== 'undefined';

  function updateColor() {
    if (!isBrowser) return;
    const theme = document.documentElement.getAttribute("data-theme");
    color = theme === "dark" ? "#f2ecce" : "#1d1d20";
  }

  function resize() {
    if (!isBrowser) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 40;
    restoreHistory();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!e.ctrlKey) return;

    if (e.key === 'z' || e.key === 'Z') {
      e.preventDefault();
      e.shiftKey ? redo() : undo();
    }

    if (e.key === 'y' || e.key === 'Y') {
      e.preventDefault();
      redo();
    }
  }

  onMount(() => {
    if (!isBrowser) return;

    ctx = canvas.getContext('2d')!;
    resize();

    window.addEventListener('resize', resize);
    window.addEventListener('keydown', handleKeydown);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    updateColor();
    saveHistory(); // initial empty state
  });

  onDestroy(() => {
    if (!isBrowser) return;

    window.removeEventListener('resize', resize);
    window.removeEventListener('keydown', handleKeydown);
  });

  function getPos(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function down(e: MouseEvent) {
    drawing = true;
    points = [];

    const { x, y } = getPos(e);
    points.push({ x, y });
  }

  function move(e: MouseEvent) {
    if (!drawing) return;

    const { x, y } = getPos(e);
    points.push({ x, y });

    scheduleDraw();
  }

  function up() {
    if (!drawing) return;
    drawing = false;

    renderStroke(points);
    saveHistory();
  }

  function midpoint(a: Point, b: Point) {
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2
    };
  }

  function renderStroke(pts: Point[]) {
    if (pts.length < 3) return;

    ctx.globalCompositeOperation =
      mode === 'erase' ? 'destination-out' : 'source-over';

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;

    ctx.beginPath();

    const firstMid = midpoint(pts[0], pts[1]);
    ctx.moveTo(firstMid.x, firstMid.y);

    for (let i = 1; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const mid = midpoint(curr, next);

      ctx.quadraticCurveTo(curr.x, curr.y, mid.x, mid.y);
    }

    ctx.stroke();
  }

  function scheduleDraw() {
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
      rafId = null;
      renderStroke(points);
    });
  }

  // ---- history helpers ----

  function saveHistory() {
    history = history.slice(0, historyIndex + 1);
    history.push(
      ctx.getImageData(0, 0, canvas.width, canvas.height)
    );
    historyIndex++;
  }

  function restoreHistory() {
    if (historyIndex < 0) return;
    ctx.putImageData(history[historyIndex], 0, 0);
  }

  function undo() {
    if (historyIndex <= 0) return;
    historyIndex--;
    restoreHistory();
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    historyIndex++;
    restoreHistory();
  }

  function clearCanvas() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    saveHistory();
  }

  function saveCanvas() {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
</script>

<svelte:head>
  <title>Cairn — Doodle</title>
</svelte:head>

<button class="btn" on:click={() => mode = 'paint'} class:active={mode === 'paint'}>
  paint
</button>

<button class="btn2" on:click={() => mode = 'erase'} class:active={mode === 'erase'}>
  erase
</button>

<div class="doodle-controls">
  <button class="doodle-btn" on:click={undo}>undo</button>
  <button class="doodle-btn" on:click={redo}>redo</button>
  <button class="doodle-btn clear" on:click={clearCanvas}>clear</button>
</div>


<button class="settings-btn" on:click={saveCanvas}>
  save
</button>

<canvas
  bind:this={canvas}
  on:mousedown={down}
  on:mousemove={move}
  on:mouseup={up}
  on:mouseleave={up}
></canvas>


<footer>
  <nav>
    <center>
    <span class="spacer">/</span>
    <a href="/">home</a>
    <span class="spacer0">/</span>
    <a href="/jots">jots</a>
    <span class="spacer1">/</span>
    <a class="active" href="/doodle">doodle</a>
    <span class="spacer3">/</span>
    </center>
  </nav>
</footer>
