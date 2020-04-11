<script>
  import Router from 'svelte-spa-router'
  import {link, push, location, querystring} from 'svelte-spa-router'  // TODO: remove the ones I don't use
  import active from 'svelte-spa-router/active'
  import {derived} from 'svelte/store'
  import {getClient} from '@matrx/svelte-realtime-store'
  const debug = require('debug')('App.svelte')
  import routes from './routes'
  import Icon from 'svelte-awesome'
  import { beer, refresh, comment, codeFork, camera, ban, signOut } from 'svelte-awesome/icons'

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

  function redirect(authenticated) {
    if (! authenticated) {
      if (!allowUnathenticated.has($location)) {
        // realtimeClient.logout()
        return push('/login?origin=' + $origin)
      } else {
        // Just stay on this page
      }
    } 
  }

  async function checkAuthentication(event) {
    if (!allowUnathenticated.has($location)) {
      const response = await fetch('/checkauth', { 
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'same-origin', 
      })
      debug('Got response from /checkauth: %O', response)
      if (response.ok) {
        realtimeClient.restoreConnection(redirect)
      }
    }
  }

  origin.subscribe((originValue) => {
    debug('origin store changed value to: %s', originValue)
    checkAuthentication(originValue)
  })

  // realtimeClient.connected.subscribe((value) => {
  //   debug('connected store changed value to: %O', value)
  //   checkAuthentication($origin)
  // })

  async function handleLogout(event) {
    const response = await fetch('/logout', { 
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'same-origin', 
    })
    // const parsed = await response.body.json()
    debug('Got response from /logout: %O', response)
    redirect(response.ok)
  }

  // checkAuthentication($origin) 

</script>

<nav class="navbar ">
    <div class="navbar-brand">
      <a class="navbar-item" href="#">
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
        <a class="navbar-item" href="#">
          Home
        </a>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link" href="/#/morgan">
            Morgan
          </a>
          <div class="navbar-dropdown ">
            <a class="navbar-item " href="#">
              Overview
            </a>
            <a class="navbar-item " href="#">
              Modifiers
            </a>
            <a class="navbar-item " href="#">
              Grid
            </a>
            <a class="navbar-item " href="#">
              Form
            </a>
            <a class="navbar-item " href="#">
              Elements
            </a>
            <a class="navbar-item is-active" href="#">
              Components
            </a>
            <a class="navbar-item " href="#">
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
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link " href="#blog/">
            Blog
          </a>
          <div id="blogDropdown" class="navbar-dropdown " data-style="width: 18rem;">
            <a class="navbar-item" href="/2017/03/10/new-field-element/">
              <div class="navbar-content">
                <p>
                  <small class="has-text-info">10 Mar 2017</small>
                </p>
                <p>New field element (for better controls)</p>
              </div>
            </a>
            <a class="navbar-item" href="/2016/04/11/metro-ui-css-grid-with-bulma-tiles/">
              <div class="navbar-content">
                <p>
                  <small class="has-text-info">11 Apr 2016</small>
                </p>
                <p>Metro UI CSS grid with Bulma tiles</p>
              </div>
            </a>
            <a class="navbar-item" href="/2016/02/09/blog-launched-new-responsive-columns-new-helpers/">
              <div class="navbar-content">
                <p>
                  <small class="has-text-info">09 Feb 2016</small>
                </p>
                <p>Blog launched, new responsive columns, new helpers</p>
              </div>
            </a>
            <a class="navbar-item" href="#blog/">
              More posts
            </a>
            <hr class="navbar-divider">
            <div class="navbar-item">
              <div class="navbar-content">
                <div class="level is-mobile">
                  <div class="level-left">
                    <div class="level-item">
                      <strong>Stay up to date!</strong>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      <a class="button is-rss is-small" href="#atom.xml">
                        <span class="icon is-small">
                          <i class="fa fa-rss"></i>
                        </span>
                        <span>Subscribe</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
