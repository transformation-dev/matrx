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

  function handleSubscribe(event) {
    $a += 1
  	const url = urlComposer.build({
  		path: 'pubsub/subscribe', 
  	})
  	fetch(url, { 
  		method: 'POST',
  		// body: JSON.stringify({
      //   connectionID: pubsubClient.connectionID,
      //   type: 'syncable',
      //   // TODO: When we move this into the store, we'll be passing in a app-wide uique string for this store
      //   channelID: 'poc.a',  // TODO: Find some way to autopopulate this on build. Might require writing a rollup plugin
        
      // }),
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

</script>

<h1>Hello {$a} {$b}</h1>

<button on:click={handleSubscribe} class="button is-primary">Subscribe</button>
<button on:click={handleMessage} class="button">Message</button>