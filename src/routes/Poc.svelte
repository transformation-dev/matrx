<script>
	import {getClient} from '@matrx/svelte-realtime-store'
	const realtimeClient = getClient()
	const connected = realtimeClient.connected

	const a = realtimeClient.realtime({_entityID: 'A'}, 2000)
	const aPrime = realtimeClient.realtime({_entityID: 'A'}, 2000)
	const b = realtimeClient.realtime({_entityID: 'B'}, 4000)
	
	function handleA(event) {
	  $a = $a + 1
}
  
function handleAPrime(event) {
	  $aPrime++
	}

	function handleB(event) {
	  $b++
	}
  
</script>

<h1>{$a}</h1>
<button id="a" on:click={handleA} class="button" disabled="{!$connected}">a++</button>
<h1>{$aPrime}</h1>
<button id="a-prime" on:click={handleAPrime} class="button" disabled="{!$connected}">aPrime++</button>
<h1>{$b}</h1>
<button id="b" on:click={handleB} class="button" disabled="{!$connected}">b++</button>
<a id="new-window" href="/#/poc" target="_blank">New Window</a>