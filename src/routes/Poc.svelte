<script>
	import {getClient} from '@matrx/svelte-realtime-store'
	const realtimeClient = getClient()
	const connected = realtimeClient.connected

	const a = realtimeClient.realtime({_entityID: 'A'}, 2000)
	const b = realtimeClient.realtime({_entityID: 'B'}, 4000)
	
	function handleA(event) {
	  $a = $a + 1
	}

	function handleB(event) {
	  $b++
	}
  
</script>

<h1>{$a}</h1>
<button on:click={handleA} class="button" disabled="{!$connected}">a++</button>
<h1>{$b}</h1>
<button on:click={handleB} class="button" disabled="{!$connected}">b++</button>