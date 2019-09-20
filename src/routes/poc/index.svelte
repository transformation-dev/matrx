<script>
  import { writable } from 'svelte/store'
	import {onMount} from 'svelte'
	import { stores } from '@sapper/app'
	const { preloading, page, session } = stores()

	import {getClient} from '@matrx/svelte-realtime-store'
	
	const realtimeClient = getClient()
	const a = realtimeClient.realtimeSaver({_entityID: 'ABC123'}, 2000)

	// onMount(() => {})

	const connected = realtimeClient.connected
	
	function handleA(event) {
		$a = $a + 1
	}
  
</script>

<h1>{$a}</h1>
<button on:click={handleA} class="button" disabled="{!$connected}">a++</button>
