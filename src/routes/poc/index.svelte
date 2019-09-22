<script context="module">
	import { user } from '../../stores.js'
	export async function preload(page, session) {
		if (!user.username) {
			return this.redirect(302, 'login?origin=' + JSON.stringify(page));
		}

		return { user }
	}
</script>

<script>
  export let user
  import { writable } from 'svelte/store'
	import {onMount} from 'svelte'
	import { stores } from '@sapper/app'
	const { preloading, page, session } = stores()

	import {getClient} from '@matrx/svelte-realtime-store'
	
	const realtimeClient = getClient()
	// realtimeClient.connect('lmaccherone', 'password')
	const a = realtimeClient.realtime({_entityID: 'ABC123'}, 2000)

	// onMount(() => {})

	const connected = realtimeClient.connected

	if (!connected) {console.log('not connected')}
	
	function handleA(event) {
		$a = $a + 1
	}
  
</script>

<h1>{$a}</h1>
<button on:click={handleA} class="button" disabled="{!$connected}">a++</button>
