<script>
  export let params = {}

  import {getClient} from '@matrx/svelte-realtime-store'
  import {push, querystring} from 'svelte-spa-router'

  const origin = new URLSearchParams($querystring).get('origin')
  const realtimeClient = getClient()

  const credentials = {username: 'lmaccherone', password: 'admin'}

  async function handleLogin(event) {
    const response = await fetch('/login', {
      method: 'POST', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin', 
      body: JSON.stringify(credentials)
      // body: credentials
    })
    console.log('got response', response)
    // const myJson = await response.json()
    // console.log('myJson', myJson)
    // realtimeClient.login({username: 'username', password: 'password'}, async (err) => {
    //   if (err) {
    //     console.log('login failed')  // TODO: Display an error and let them retry
    //   } else {
    //     if (origin) {
    //       push(origin)
    //     } else {
    //       push('/')
    //     }
    //   }
    // })
  }
  
</script>

<button id="login" on:click={handleLogin}>Login</button>
