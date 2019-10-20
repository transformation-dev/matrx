<script>
  export let params = {}

  import {getClient} from '@matrx/svelte-realtime-store'
  import {push, querystring} from 'svelte-spa-router'

  const origin = new URLSearchParams($querystring).get('origin')
  const realtimeClient = getClient()

  function handleLogin(event) {
    realtimeClient.login({username: 'username', password: 'password'}, async (err) => {
      if (err) {
        console.log('login failed')  // TODO: Display an error and let them retry
      } else {
        if (origin) {
          push(origin)
        } else {
          push('/')
        }
      }
    })
  }
  
</script>

<button id="login" on:click={handleLogin}>Login</button>
