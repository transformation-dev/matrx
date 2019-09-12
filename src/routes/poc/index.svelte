<script>
  import { writable } from 'svelte/store'
	import {onMount} from 'svelte'
	import { stores } from '@sapper/app'
	const { preloading, page, session } = stores()

	import io from 'socket.io-client'
	
	import {getClient} from '@matrx/svelte-realtime-store'
	
	let socket

	const realtimeClient = getClient()
	const a = realtimeClient.realtime(JSON.stringify($page) + '.a', 1000)

  onMount(() => {
		$a = 150


		socket = io()
		socket.on('connect', function(e){
			// Join rooms here. That way they'll be rejoined once reconnected
			console.log('connected', e)
		})
  	socket.on('event', function(data){
			console.log('web socket event', data)
		})
  	socket.on('disconnect', function(e){
			console.log('disconnected', e)
		})
	})
  
  function handleMessage(event) {
		console.log('inside handleMessage')
  	socket.emit('my broadcast', {say: 'something'})
	}
	
	function handleClick(event) {
  	$a++
  }
  

</script>

<h1>{$a}</h1>
<button on:click={handleMessage} class="button">Message</button>
<button on:click={handleClick} class="button">Click me</button>
