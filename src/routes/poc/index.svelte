<script>
  import { writable } from 'svelte/store'
  import {onMount} from 'svelte'

  import urlComposer from 'url-composer'
	
	import io from 'socket.io-client'
	
  // import {getClient} from '@matrx/realtime'
	// let pubsubClient 
	
	let socket

  onMount(() => {
		// pubsubClient = getClient()
		socket = io()
		socket.on('connect', function(e){
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
