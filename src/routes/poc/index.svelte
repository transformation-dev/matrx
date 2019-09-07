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
    subscribe()
	})

  function subscribe() {
  	const url = urlComposer.build({
  		path: 'pubsub/subscribe', 
  	})
  	fetch(url, { 
  		method: 'POST',
  		body: JSON.stringify({
        connectionID: pubsubClient.connectionID,
        type: 'syncable',
        // TODO: When we move this into the store, we'll be passing in a app-wide uique string for this store
        channelID: 'poc.a',  // TODO: Find some way to autopopulate this on build. Might require writing a rollup plugin maybe with this: https://github.com/jetiny/rollup-plugin-re
      }),
  		headers:{
  			'Content-Type': 'application/json',
  		},
    }).then((res) => {
      console.log('got response from handleSubscribe')
      res.text().then((text) => {
        console.log(text)
      })
    })
  }
  
  function handleMessage(event) {
  	const url = urlComposer.build({
  		path: 'pubsub/send-message/:connectionID', 
  		params: {connectionID: pubsubClient.connectionID},
  	})
  	const res = fetch(url, { 
  		method: 'POST',
  		body: JSON.stringify({
        say: 'something'
      }),
  		headers:{
  			'Content-Type': 'application/json',
  		},
    })
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

<h1>Hello {$a} {$b}</h1>

<button on:click={handleMessage} class="button">Message</button>
<button on:click={handlePublish} class="button">Publish</button>
<button on:click={handlePublishFrom} class="button">Publish From</button>
