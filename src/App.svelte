<script>
  const debug = require('debug')('matrx:App')
  const {NODE_ENV} = process.env
  if (NODE_ENV !== 'production') {
    require('whatwg-fetch')
  }

  import {link, location} from 'svelte-spa-router'  // TODO: Move these to svelte-viewstate-store 
  import Icon from 'svelte-awesome'
  import {signOut} from 'svelte-awesome/icons'

  import {ViewstateStore} from '@matrx/svelte-viewstate-store'

  import {routes, activeComponent} from './router'
  import {authenticated} from './stores'

  const teamID = new ViewstateStore({
    identifier: 'teamID',
    defaultValue: 'team1',
    scope: '/'
  })

  async function handleLogout(event) {
    $authenticated = false
    const response = await fetch('/logout', { 
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'same-origin', 
    })
    const parsed = await response.json()
    debug('Got response from /logout: %O', parsed)
    $authenticated = parsed.authenticated
  }
</script>

<svelte:head>
  <title>MatrX{$location}</title>
  <link rel="icon" href="matrx-favicon.png">
</svelte:head>

<nav class="navbar is-fixed-top">
  <div class="navbar-brand">
    <a class="navbar-item" href="/#/">
      <img src="MatrXCloseWhite.png" alt="MatrX Logo">
    </a>
  </div>
  <div class="navbar-menu">
    <div class="navbar-start">
      {#each Object.entries(routes) as [route, value]}
        {#if value.navbarLabel}
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

<svelte:component this={$activeComponent} />
