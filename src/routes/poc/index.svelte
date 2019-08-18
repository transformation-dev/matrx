<script>
  import { writable } from 'svelte/store'

  const color = writable('blue')

  function handleClick(event) {
		console.log('clicked')
	}

</script>

<h1>Hello</h1>

<button on:click={handleClick} class="button is-primary">hello</button>

