<script>
  import Router from 'svelte-spa-router'
  import {link, push, location, querystring} from 'svelte-spa-router'  // TODO: remove the ones I don't use
  import active from 'svelte-spa-router/active'
  import {derived} from 'svelte/store'
  import {getClient} from '@matrx/svelte-realtime-store'
  const debug = require('debug')('App.svelte')

  import routes from './routes'

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

  function checkAuthentication(destination) {
    debug('checkAuthentication() called.  destination: %s', destination)
    if (!allowUnathenticated.has($location)) {
      realtimeClient.restoreSession((err) => {
        if (err) {
          push('/login?origin=' + destination)    
        } else {
          if ($location == '/login') {
            push(destination)
          }
        }
      })
    }
  }

  origin.subscribe((value) => {
    debug('origin store changed value to: %s', value)
    checkAuthentication(value)
  })

  // realtimeClient.connected.subscribe((value) => {
  //   debug('connected store changed value to: %O', value)
  //   checkAuthentication($origin)
  // })

  function handleLogout(event) {
    realtimeClient.logout((err, logoutSuccessful) => {
      if (err) {
        throw err
      } else {
        if (logoutSuccessful) {
          if (!allowUnathenticated.has($location)) {
            push('/login?origin=' + $origin)
          } else {
            // Just stay on this page
          }
        } else {
          throw new Error('logout failed')
        }
      }
    })
  }

</script>

<!-- TODO: Get rid of this style once we switch it to Bulma's is-active -->
<style>
  /* Style for "active" links; need to mark this :global because the router adds the class directly */
  :global(a.active) {
      color: green;
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
