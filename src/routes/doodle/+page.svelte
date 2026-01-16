<script lang="ts">
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let drawing = false;
  let mode: 'paint' | 'erase' = 'paint';

  const brushSize = 6;
  let color: string = "#1d1d20"; // default (light)

  function updateColor() {
    const theme = document.documentElement.getAttribute("data-theme");
    color = theme === "dark" ? "#f2ecce" : "#1d1d20";
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 40;
  }

  onMount(() => {
    ctx = canvas.getContext('2d')!;
    resize();
    window.addEventListener('resize', resize);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    updateColor(); // read theme safely
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
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function move(e: MouseEvent) {
    if (!drawing) return;

    const { x, y } = getPos(e);

    ctx.globalCompositeOperation =
      mode === 'erase' ? 'destination-out' : 'source-over';

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;

    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function up() {
    drawing = false;
    ctx.closePath();
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

<button class="settings-btn" on:click={saveCanvas}>save</button>


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
    <a href="/timer">timer</a>
    <span class="spacer4">/</span>
    </center>
  </nav>
</footer>

<canvas
  bind:this={canvas}
  on:mousedown={down}
  on:mousemove={move}
  on:mouseup={up}
  on:mouseleave={up}
  >
</canvas>

