<script>
  import { writable } from 'svelte/store'
	import {onMount} from 'svelte'
	import { stores } from '@sapper/app'
	const { preloading, page, session } = stores()

	import {getClient} from '@matrx/svelte-realtime-store'
	
	const realtimeClient = getClient()
	const a = realtimeClient.realtime(JSON.stringify($page) + '.a', 1000)
	const b = realtimeClient.realtime(JSON.stringify($page) + '.b', 2000)

	// onMount(() => {})
	
	realtimeClient.socket.on('disconnect', () => {
		console.log('You are no longer connected!')
	})
	realtimeClient.socket.on('connect', () => {
		console.log('You are now connected!')
	})
	realtimeClient.socket.on('reconnect', () => {
		console.log('You have reconnected!')
	})
	
	
	function handleA(event) {
		$a = $a + 1
	}
	
	function handleB(event) {
		$b++
  }
  
</script>

<h1>{$a}</h1>
<button on:click={handleA} class="button">a++</button>
<h2>{$b}</h2>
<button on:click={handleB} class="button">b++</button>
