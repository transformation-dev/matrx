<script>
	import { goto } from '@sapper/app'
	import Nav from '../components/Nav.svelte'
	import { getClient } from '@matrx/svelte-realtime-store'
	const realtimeClient = getClient()

	function handleLogout(event) {
		realtimeClient.logout(() => {
			goto('/login?origin=/')
		})
	}

	export let segment
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<Nav {segment}/>

<button on:click={handleLogout}>Logout</button>

<main>
	<slot></slot>
</main>