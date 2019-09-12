<script>
  import { writable } from 'svelte/store'
	import {onMount} from 'svelte'
	import { stores } from '@sapper/app'
	const { preloading, page, session } = stores()

	// import io from 'socket.io-client'
	// let socket

	import {getClient} from '@matrx/svelte-realtime-store'
	
	const realtimeClient = getClient()
	const a = realtimeClient.realtime(JSON.stringify($page) + '.a', 1000)

  onMount(() => {
		$a = 150
	})
  
  function handleMessage(event) {
		console.log('inside handleMessage')
  	realtimeClient.emit('my broadcast', {say: 'something'})
	}
	
	function handleClick(event) {
  	$a++
  }
  

</script>

<h1>{$a}</h1>
<button on:click={handleMessage} class="button">Message</button>
<button on:click={handleClick} class="button">Click me</button>
