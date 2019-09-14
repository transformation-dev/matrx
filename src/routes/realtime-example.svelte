<script>
	import { getClient } from '@matrx/svelte-realtime-store'
	
	const realtimeClient = getClient()
	const a = realtimeClient.realtime('a', 1000)

	// You can do whatever you want with the socket.
	// It's namespaced to avoid conflicts with other socket.io usage.
	realtimeClient.socket.on('disconnect', () => {
		console.log('You are no longer connected!')
	})
	realtimeClient.socket.on('connect', () => {
		console.log('You are now connected!')
	})

	const connected = realtimeClient.connected
	
	function handleA(event) {
		$a = $a + 1
	}
</script>

<h1>{$a}</h1>
<button on:click={handleA} class="button" disabled="{!$connected}">a++</button>

