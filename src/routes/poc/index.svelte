<script context="module">
	// import {getClient} from '@matrx/svelte-realtime-store'
	// const realtimeClient = getClient()
	// export async function preload(page, session) {
	// 	if (! realtimeClient.authenticated) {
	// 		return this.redirect(302, 'login?origin=' + JSON.stringify(page))
	// 	}
	// }
</script>

<script>

  import { writable } from 'svelte/store'
	import {onMount} from 'svelte'
	import { stores, goto } from '@sapper/app'
	const { preloading, page, session } = stores()

	import {getClient} from '@matrx/svelte-realtime-store'
	const realtimeClient = getClient()
	const connected = realtimeClient.connected

	// let a = writable()
	// let b = writable()
	const a = realtimeClient.realtime({_entityID: 'A'}, 2000)
	const b = realtimeClient.realtime({_entityID: 'B'}, 4000)

	onMount(() => {
		if (! realtimeClient.authenticated) {
		  return goto('login?origin=' + window.location.href)
		} else {
			// a = realtimeClient.realtime({_entityID: 'A'}, 2000)
	    // b = realtimeClient.realtime({_entityID: 'B'}, 4000)
		}
	})
	
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