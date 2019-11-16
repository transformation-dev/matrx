<script>
  export let params = {}

  import {getClient} from '@matrx/svelte-realtime-store'
  import {push, querystring} from 'svelte-spa-router'
  import {CSRFTokenAvailable} from '../stores'
  const debug = require('debug')('matrx:Login.svelte')

  const origin = new URLSearchParams($querystring).get('origin')
  const realtimeClient = getClient()

  const credentials = {username: 'lmaccherone', password: 'admin'}

  async function handleLogin(event) {
    const response = await fetch('/login', {
      method: 'POST', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', 
      body: JSON.stringify(credentials)
    })
    pushOrigin(response.ok)
  }

  function pushOrigin(ok) {
    if (ok) {
      if (origin) {
        push(origin)
      } else {
        push('/')
      }
    }
  }
  
</script>

<!-- <button id="login" on:click={handleLogin} disabled="{!$CSRFTokenAvailable}">Login</button> -->
<button id="login" on:click={handleLogin}>Login</button>
