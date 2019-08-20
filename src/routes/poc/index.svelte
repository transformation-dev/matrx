<script>
  import { writable } from 'svelte/store'
  import {onMount} from 'svelte'

  onMount(async () => {
    pubsubClient.subscribe('/messages', function(message) {
      console.log('Got a message: ' + message.text);
    })
	})

  const color = writable('blue')

  function handleClick(event) {
		pubsubClient.publish('/messages', {
      text: 'Hello world'
    })
	}

</script>

<h1>Hello</h1>

<button on:click={handleClick} class="button is-primary">hello</button>

