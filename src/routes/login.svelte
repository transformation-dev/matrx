<script>
	// import {onMount} from 'svelte'
	import { stores, goto } from '@sapper/app'
	const { preloading, page, session } = stores()
	// import { hrefFromPath } from '../utils.js'
	import {getClient} from '@matrx/svelte-realtime-store'
	
	// const origin = hrefFromPath($page.query.origin)
	const origin = $page.query.origin
	const realtimeClient = getClient()

	// onMount(() => {})

	// const connected = realtimeClient.connected
	
	function handleLogin(event) {
		realtimeClient.login({username: 'username', password: 'password'}, async (err) => {
			if (err) {
				console.log('auth failed')
			} else {
				console.log('got callback from authenticate', origin)
				await goto(origin)
			}
		})
	}
  
</script>

<button on:click={handleLogin}>Login</button>
