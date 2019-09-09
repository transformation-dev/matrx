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
		socket.on('my broadcast', function(data){
			console.log('my broadcast', data)
		})
  	socket.on('disconnect', function(e){
			console.log('disconnected', e)
		})
	})
  
  function handleMessage(event) {
		console.log('inside handleMessage')
  	socket.emit('my broadcast', {say: 'something'})
  }
  
  function handlePublish(event) {
   	const url = urlComposer.build({
   		path: 'pubsub/publish/:channelID', 
   		params: {channelID: 'poc.a'},
   	})
   	const res = fetch(url, {
   		method: 'POST',
   		body: JSON.stringify({msg: 'from publish'}),
   		headers:{
   			'Content-Type': 'application/json',
   		},
   	})
  }

  function handlePublishFrom(event) {
   	const url = urlComposer.build({
   		path: 'pubsub/publish/:channelID/from/:connectionID', 
   		params: {channelID: 'poc.a', connectionID: pubsubClient.connectionID},
   	})
   	const res = fetch(url, {
   		method: 'POST',
   		body: JSON.stringify({msg: 'from publish'}),
   		headers:{
   			'Content-Type': 'application/json',
   		},
   	})
  }

</script>

<button on:click={handleMessage} class="button">Message</button>
<button on:click={handlePublish} class="button">Publish</button>
<button on:click={handlePublishFrom} class="button">Publish From</button>
