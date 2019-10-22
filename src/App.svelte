<script>
  import Router from 'svelte-spa-router'
  import {link, push, location, querystring} from 'svelte-spa-router'  // TODO: remove the ones I don't use
  import active from 'svelte-spa-router/active'
  import {derived} from 'svelte/store'
  import {getClient} from '@matrx/svelte-realtime-store'

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

  origin.subscribe((value) => {
    if (!allowUnathenticated.has($location)) {
      realtimeClient.restoreSession((err) => {
        if (err) {
          push('/login?origin=' + value)    
        } else {
          if ($location == '/login') {
            push(value)
          }
        }
      })
    }
  })
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

<nav>
	<ul>
		<li><a class='{segment === undefined ? "selected" : ""}' href='/'>home</a></li>
		<li><a class='{segment === "about" ? "selected" : ""}' href='about'>about</a></li>
		<li><a class='{segment === "morgan" ? "selected" : ""}' href='morgan'>morgan</a></li>

		<!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
		<li><a rel=prefetch class='{segment === "blog" ? "selected" : ""}' href='blog'>blog</a></li>
		<li><a rel=prefetch class='{segment === "poc" ? "selected" : ""}' href='poc'>poc</a></li>
	</ul>
</nav>

<Router {routes}/>
