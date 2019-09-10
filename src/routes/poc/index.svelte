<script>
  import { writable } from 'svelte/store'
  import {onMount} from 'svelte'

	import io from 'socket.io-client'
	
	import {getClient} from '@matrx/svelte-realtime-store'
	
	let socket
	let realtimeClient

  onMount(() => {
		realtimeClient = getClient()
		console.log(realtimeClient._namespace)
		// a = realtime()
		// $a = 100
		// console.log($a)

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
  

</script>

<button on:click={handleMessage} class="button">Message</button>
