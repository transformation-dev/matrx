<script>
  import { writable } from 'svelte/store'
  import {onMount} from 'svelte'
  import { stores } from '@sapper/app'
  const { preloading, page, session } = stores()

  import urlComposer from 'url-composer'
  
  import {getClient} from '@matrx/realtime'

  const a = writable(0)
  const b = writable(10)
  const pageStores = {a, b}
  let pubsubClient 

  onMount(() => {
    pubsubClient = getClient()
	})

  function handleClick(event) {
    $a += 1

  	const url = urlComposer.build({
  		path: 'pubsub/send-message/:connectionID', 
  		params: {connectionID: pubsubClient.connectionID},
  	})
  	const res = fetch(url, {
  		method: 'POST',
  		body: JSON.stringify({msg: 'from the server-sent event'}),
  		headers:{
  			'Content-Type': 'application/json',
  		},
  	})

	}

</script>

<h1>Hello {$a} {$b}</h1>

<button on:click={handleClick} class="button is-primary">hello</button>

