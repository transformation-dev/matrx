<script>
  export let params = {}
  
  import Icon from 'svelte-awesome'
  import { envelope, key } from 'svelte-awesome/icons'
  
  import {getClient} from '@matrx/svelte-realtime-store'
  import {push, querystring} from 'svelte-spa-router'
  import {CSRFTokenAvailable} from '../stores'
  const debug = require('debug')('matrx:Login')

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

<div class="tile is-ancestor">
  <div class="tile is-parent">
    <div class="tile is-child is-12"></div>
  </div>
</div>
<div class="tile is-ancestor">
  <div class="tile is-parent">
    <div class="tile is-child"></div>
    <div class="tile is-5 is-child has-text-centered box">
      <p class="title has-text-centered">Hello!</p>
        <div class="field">
            <p class="control has-icons-left">
              <input class="input" type="email" placeholder="Email">
                <span class="icon is-small is-left">
                  <Icon data={envelope}/>
                </span> 
            </p>
          </div>
          <div class="field">
            <p class="control has-icons-left">
              <input class="input" type="password" placeholder="Password">
              <span class="icon is-small is-left">
                <Icon data={key}/>
              </span>
            </p>
          </div>
      <button class="button is-success is-centered" id="login" on:click={handleLogin}>login</button>
    </div>
    <div class="tile is-child"></div>
  </div>
</div>

