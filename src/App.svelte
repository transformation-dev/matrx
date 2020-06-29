<script>
  const debug = require('debug')('matrx:App')
  const {NODE_ENV} = process.env
  if (NODE_ENV !== 'production') {
    require('whatwg-fetch')
  }

  import Router from 'svelte-spa-router'
  import {link, push, location, querystring} from 'svelte-spa-router'  // TODO: remove the ones I don't use
  import {derived} from 'svelte/store'
  import Icon from 'svelte-awesome'
  import {signOut} from 'svelte-awesome/icons'

  import {getClient} from '@matrx/svelte-realtime-store'
  import {ViewstateStore} from '@matrx/svelte-viewstate-store'

  import routes from './routes'

  const teamID = new ViewstateStore({
    identifier: 'teamID',
    defaultValue: 'team1',
    scope: '/'
  })

  const realtimeClient = getClient()

  const origin = derived([location, querystring], ([$location, $querystring]) => {
    return $location + ($querystring ? '?' + $querystring : '')
  })
  
  const allowUnathenticated = new Set([  // TODO: Upgrade this to allow for route expressions using https://www.npmjs.com/package/regexparam
    '/login',
    '/wild/something'
  ])

  const loginRoute = '/login'

  function redirect(authenticated) {
    if (!authenticated) {
      if (!allowUnathenticated.has($location)) {
        // realtimeClient.logout()
        return push('/login?origin=' + $origin)
      } else {
        // Just stay on this page
      }
    } else {
      return push($origin)
    }
  }

  async function checkAuthentication() {
    debug('checkAuthentication() called')
    if ($location === loginRoute || !allowUnathenticated.has($location)) {
      const response = await fetch('/checkauth', { 
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'same-origin', 
      })
      const parsed = await response.json()
      debug('Got response from /checkauth: %O', parsed)
      if (parsed.authenticated) {
        realtimeClient.restoreConnection(redirect)
      }
    }
  }

  origin.subscribe((originValue) => {
    debug('origin store changed value to: %s', originValue)
    checkAuthentication()
  })

  // realtimeClient.connected.subscribe((value) => {
  //   debug('connected store changed value to: %O', value)
  //   checkAuthentication()
  // })

  async function handleLogout(event) {
    const response = await fetch('/logout', { 
      headers: {
        'Accept': 'application/json',
        // 'CSRF-Token': localStorage.getItem('CSRFToken')  // TODO: Delete and remove from stores.js
      },
      credentials: 'same-origin', 
    })
    const parsed = await response.json()
    debug('Got response from /logout: %O', parsed)
    // localStorage.setItem('CSRFToken', parsed.CSRFToken)
    redirect(parsed.authenticated)
  }

  // checkAuthentication() 
</script>

<nav class="navbar is-fixed-top">
  <div class="navbar-brand">
    <a class="navbar-item" href="/#/">
      <img src="MatrXCloseWhite.png" alt="MatrX Logo">
    </a>
    <div id="logout" on:click={handleLogout} class="navbar-burger burger navbar-dropdown" data-target="navMenuExample1">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
  <div class="navbar-menu">
    <div class="navbar-start">
      {#each Object.entries(routes) as [route, value]}
        {#if value.userData && value.userData.navbarLabel}
          <a class="navbar-item" use:link class:is-active={$location === route} href={route}>
            {value.userData.navbarLabel}
          </a>
        {/if}
      {/each}
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="field is-grouped">
          <p class="control">
            <button id="logout" on:click={handleLogout} class="button is-rounded is-small"> 
              <Icon data={signOut}/>
              Logout
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</nav>

<Router {routes}/>
