<script>
  const debug = require('debug')('matrx:App')
  const {NODE_ENV} = process.env
  if (!(NODE_ENV === 'production')) {
    require('whatwg-fetch')
  }

  import Router from 'svelte-spa-router'
  import {link, push, location, querystring} from 'svelte-spa-router'  // TODO: remove the ones I don't use
  import active from 'svelte-spa-router/active'
  import {derived} from 'svelte/store'
  import Icon from 'svelte-awesome'
  import {beer, refresh, comment, codeFork, camera, ban, signOut, envelope} from 'svelte-awesome/icons'

  import {getClient} from '@matrx/svelte-realtime-store'
  import {ViewstateStore} from '@matrx/svelte-viewstate-store'

  import routes from './routes'
  import {CSRFTokenAvailable} from './stores'

  const teamID = new ViewstateStore({
    identifier: 'teamID',
    defaultValue: 'team1',
    scope: '/'
  })
  
  function isActive(node, path) {
    // TODO: Consider using svelte-spa-router's `use:active` directive
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
      $CSRFTokenAvailable = false
      const response = await fetch('/checkauth', { 
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'same-origin', 
      })
      const parsed = await response.json()
      debug('Got response from /checkauth: %O', parsed)
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
        // 'CSRF-Token': localStorage.getItem('CSRFToken')
      },
      credentials: 'same-origin', 
    })
    const parsed = await response.json()
    debug('Got response from /logout: %O', parsed)
    // localStorage.setItem('CSRFToken', parsed.CSRFToken)
    $CSRFTokenAvailable = true
    redirect(parsed.authenticated)
  }

  // checkAuthentication() 

</script>

<nav class="navbar ">
    <div class="navbar-brand">
      <a class="navbar-item" href="/#/">
        <img src="MatrXCloseWhite.png" alt="MatrX Logo">
      </a>
      <div class="navbar-burger burger" data-target="navMenuExample1">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div id="navMenuExample1" class="navbar-menu">
      <div class="navbar-start">
        <a class="navbar-item" href="/#/">
          Home
        </a>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link" href="/#/morgan">
            Morgan
          </a>
          <div class="navbar-dropdown ">
            <a class="navbar-item " href="/#/">
              Overview
            </a>
            <a class="navbar-item " href="/#/">
              Modifiers
            </a>
            <a class="navbar-item " href="/#/">
              Grid
            </a>
            <a class="navbar-item " href="/#/">
              Form
            </a>
            <a class="navbar-item " href="/#/">
              Elements
            </a>
            <a class="navbar-item is-active" href="/#/">
              Components
            </a>
            <a class="navbar-item " href="/#/">
              Layout
            </a>
            <hr class="navbar-divider">
            <div class="navbar-item">
              <div>version
                <p class="has-text-info is-size-6-desktop">0.4.3</p>
              </div>
            </div>
          </div>
        </div>
        <div class="navbar-item is-hoverable">
          <a class="navbar-link" href="/#/morgan">
            Grid
          </a>
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <div class="navbar-link">
            More
          </div>
          <div id="moreDropdown" class="navbar-dropdown ">
            <a class="navbar-item " href="#extensions/">
              <div class="level is-mobile">
                <div class="level-left">
                  <div class="level-item">
                    <p>
                      <strong>Extensions</strong>
                      <br>
                      <small>Side projects to enhance Bulma</small>
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="field is-grouped">
            <p class="control">
              <button id="logout" on:click={handleLogout} class="button is-rounded"> 
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
