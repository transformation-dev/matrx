<script>
  const debug = require('debug')('matrx:Login')

  import Icon from 'svelte-awesome'
  import {envelope, key} from 'svelte-awesome/icons'
  import {onMount} from 'svelte'

  import {RealtimeStore} from '@matrx/svelte-realtime-store'

  import {authenticated} from '../stores'

  const credentials = {username: 'lmaccherone', password: 'admin'}  // TODO: Get from fields

  async function checkAuthentication() {
    debug('checkAuthentication() called')
    const response = await fetch('/checkauth', { 
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'same-origin', 
    })
    const parsed = await response.json()
    debug('Got response from /checkauth: %O', parsed)
    if (parsed.authenticated) {
      $authenticated = true
      RealtimeStore.restoreConnection((connected) => {
        debug('Callback from restoreConnection. connected: %O', connected)
      })
    }
  }
  onMount(checkAuthentication)

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
    debug('In handleLogin after login attempt. response: %O', response)
    if (response.ok) {
      $authenticated = true
      RealtimeStore.restoreConnection((connected) => {
        debug('Callback from restoreConnection. connected: %O', connected)
      })
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

