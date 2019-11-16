<script>
  import Router from 'svelte-spa-router'
  import {link, push, location, querystring} from 'svelte-spa-router'  // TODO: remove the ones I don't use
  import active from 'svelte-spa-router/active'
  import {derived} from 'svelte/store'
  import {getClient} from '@matrx/svelte-realtime-store'
  const debug = require('debug')('matrx:App.svelte')
  const {NODE_ENV} = process.env
  if (!(NODE_ENV === 'production')) {
    require('whatwg-fetch')
  }

  import routes from './routes'
  import {CSRFTokenAvailable} from './stores'

  function isActive(node, path) {
    return active(node, path, 'is-active')  // TODO: Change to 'is-active' when for Bulma
  }

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
    if (! authenticated) {
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
      $CSRFTokenAvailable = false
      const response = await fetch('/checkauth', { 
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'same-origin', 
      })
      const parsed = await response.json()
      debug('Got response from /checkauth: %O', parsed)
      localStorage.setItem('CSRFToken', parsed.CSRFToken)
      $CSRFTokenAvailable = true
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
    $CSRFTokenAvailable = false
    const response = await fetch('/logout', { 
      headers: {
        'Accept': 'application/json',
        'CSRF-Token': localStorage.getItem('CSRFToken')
      },
      credentials: 'same-origin', 
    })
    const parsed = await response.json()
    debug('Got response from /logout: %O', parsed)
    localStorage.setItem('CSRFToken', parsed.CSRFToken)
    $CSRFTokenAvailable = true
    redirect(parsed.authenticated)
  }

  // checkAuthentication() 

</script>

<!-- TODO: Get rid of this style once we switch it to Bulma's is-active -->
<style>
  /* Style for "active" links; need to mark this :global because the router adds the class directly */
  :global(a.active) {
      color: red;
  }
</style>

<h1>MatrX</h1>
<!-- Navigation links, using the "link" action -->
<!-- Also, use the "active" action to add the "active" CSS class when the URL matches -->
<ul class="navigation-links">
    <li><a href="/" use:link use:isActive>Home</a></li>
    <li><a href="/brand" use:link use:isActive>Brand</a></li>
    <li><a href="/hello/svelte" use:link use:isActive={'/hello/*', 'active'}>Say hi!</a></li>
    <li><a href="/does/not/exist" use:link>Not found</a></li>
</ul>

<button id="logout" on:click={handleLogout} class="button">Logout</button>

<Router {routes}/>
