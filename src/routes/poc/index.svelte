<script>
  import { writable } from 'svelte/store';

	const color = writable('blue');

</script>

<h1>Hello</h1>

<button background-color={$color}>hello</button>