<script>
  import { writable, get } from 'svelte/store'
	import {onMount} from 'svelte'
	import { stores } from '@sapper/app'
	const { preloading, page, session } = stores()
	import { hrefFromPath } from '../utils.js'
	import {getClient} from '@matrx/svelte-realtime-store'
	
	const origin = hrefFromPath($page.query.origin)
	const realtimeClient = getClient()
	const a = realtimeClient.realtime({_entityID: 'ABC123'}, 2000)

	// onMount(() => {})

	const connected = realtimeClient.connected
	
	function handleLogin(event) {
		realtimeClient.authenticate({username: 'username', password: 'password'})
	}
  
</script>

<button on:click={handleLogin}>Login</button>
