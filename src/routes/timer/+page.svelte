<script>
    import Timer from "./Timer.svelte";
	let count = $state(25);
    let count2 = $state(5);
    let count3 = $state(15);

	function increment() {
			count = Math.min(60, count + 1);
	}
    function decrement() {
			count = Math.max(1, count - 1);
	}
    function increment2() {
			count2 = Math.min(60, count + 1);
	}
    function decrement2() {
			count2 = Math.max(1, count - 1);
	}
    function increment3() {
			count3 = Math.min(60, count + 1);
	}
    function decrement3() {
			count3 = Math.max(1, count - 1);
	}
</script>

<svelte:head>
  <title>Cairn — Pomodoro Timer</title>
</svelte:head>

<div class="editor-wrapper">
<center>
    <h1>pomodoro timer</h1>
</center>
<p>work:</p>
<Timer countdown={count * 60} />
/ <button class="timer-btn" onclick={increment}>+</button>
<button class="timer-btn" onclick={decrement}>-</button> /
<p>short break:</p>
<Timer countdown={count2 * 60} />
/ <button class="timer-btn" onclick={increment2}>+</button>
<button class="timer-btn" onclick={decrement2}>-</button> /
<p>long break:</p>
<Timer countdown={count3 * 60} />
/ <button class="timer-btn" onclick={increment3}>+</button>
<button class="timer-btn" onclick={decrement3}>-</button> /
<hr style="border: 2px dashed #cfccbeab;" />
<h2>what is the pomodoro technique?</h2>
<p>the technique has 6 steps:</p>
<ul>
  <li>decide on the task to be done.</li>
  <li>set the pomodoro timer (typically for 25 minutes).</li>
  <li>work on the task.</li>
  <li>end work when the timer rings and take a short break (typically 5–10 minutes).</li>
  <li>go back to step 2 and repeat until you complete four pomodori.</li>
  <li>after four pomodori are done, take a long break (typically 20 to 30 minutes) instead of a short break. once the long break is finished, return to step 2.</li>
</ul>
</div>


<footer>
  <nav>
    <center>
    <span class="spacer">/</span>
    <a href="/">home</a>
    <span class="spacer0">/</span>
    <a href="/jots">jots</a>
    <span class="spacer1">/</span>
    <a href="/doodle">doodle</a>  
    <span class="spacer3">/</span>
    <a class="active" href="/timer">timer</a>
    <span class="spacer4">/</span>
    </center>
  </nav>
</footer>