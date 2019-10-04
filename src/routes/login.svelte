<script>
  import {onMount} from 'svelte'
	import { stores, goto } from '@sapper/app'
	const { preloading, page, session } = stores()
	import {getClient} from '@matrx/svelte-realtime-store'
	
	const origin = $page.query.origin
	const realtimeClient = getClient()

	onMount(() => {
		realtimeClient.restoreSession(async (err) => {
			if (err) {
				console.log('session failed to restore')
			} else {
				console.log('session restored. returning you to', origin)
				await goto(origin)
			}
		})
	})
	
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
