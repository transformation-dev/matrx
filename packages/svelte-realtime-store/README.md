# `@matrx/svelte-realtime-store`

svelte-realtime-store is a drop-in replacement for a Svelte writable store that will synchronize its value across browser windows/tabs in realtime using socket.io.

If you currently have a svelte app that communicates with a node.js server (Sapper or otherwise), you can upgrade your existing application to [Meteor](https://www.meteor.com/) or [Firebase](https://firebase.google.com/) like realtime literally in a few minutes.

To work, you must have the [`@matrx/svelte-realtime-server`](https://www.npmjs.com/package/@matrx/svelte-realtime-server) running on your node.js server.

### Features

* Requires only a few additional lines of code
* Implements the expected interface of a Svelte writable store so Svelte's wonderful syntax just works
* Caches the value on the server so newly joined and reconnected users catch up to the current state
* Exposes a Svelte readable store for the connection status so you can decide how it should behave when offline. I recommend that you disable user input when offline unless you implement your own offline mode (including conflict resolution upon reconnect).
* Uses a socket.io namespace to isolate it from anything else you might be using socket.io for
* Exposes the socket.io namespaced socket to your application for advanced use cases

## Usage

To install with npm

```bash
npm install --save @matrx/svelte-realtime-store
```

Head on over to [`@matrx/svelte-realtime-server`](https://www.npmjs.com/package/@matrx/svelte-realtime-server) to see how to install the server-side component.

Modify your .svelte files to look something like this

```html
<script>
	import { getClient } from '@matrx/svelte-realtime-store'
	
	const realtimeClient = getClient()
	const a = realtimeClient.realtime('a', 1000)
	const connected = realtimeClient.connected
	
	function handleA(event) {
		$a = $a + 1
	}
</script>

<h1>{$a}</h1>
<button on:click={handleA} class="button" disabled="{!$connected}">a++</button>
```

That's all there really is to it.

A few notes:

* Notice how I've used the provided `realtimeClient.connected` store to disable the button when the window is disconnected. This is recommended unless you implement your own offline mode (including conflict resolution upon reconnection).
* The first parameter of `realtimeClient.realtime()` is a unique identifier for the store which corresponds exactly to the name of the "room" in socket.io parlance.
* If you are building a simple single user-base app, then you can do as I've done above  and make the store id match the variable name.
* However, for multi-tenancy or other cases where you want the `a` variable for one page/user/tenant to be isolated from the `a` variable for another, you'll need to provide a different id for each seperate instance. I usually do this by prepending the variable identifier with the URL of the current page which specifies the uniqueness. If you pass in something other than a string, it'll run JSON.stringify() on it so something like this works using the Sapper-provided page store: `realtimeClient.realtime({page, variable: 'a'}, 1000)`. If you are not using Sapper and don't have to worry about server-side rendering (SSR), you can just do: `realtimeClient.realtime({page: window.location.href, variable: 'a'})`
* The second parameter of `realtimeClient.realtime()` is now the _default_ value rather than the _initial_ value. What this means is that if the server has cached a value for this store, it'll start with that value rather than the one you provide. 
* Keep in mind that socket.io is very efficient at cleaning up "rooms" when there are no clients. So, the value will be flushed from the cache when all clients disconnect. The default or last browser update value will repopulate the cache upon reconnection.

## Advanced usage

We expose the namespaced socket.io socket if you need it for more advanced uses.

For instance, under the covers, the `realtimeClient.connected` store is maintaining its state with something like this:

```js
	realtimeClient.socket.on('disconnect', () => {
		console.log('You are no longer connected!')
	})
	realtimeClient.socket.on('connect', () => {
		console.log('You are now connected!')
	})
```

## Limitations

* __No permanent storage.__ As of this writing, it just synchronizes the views but the next step is to provide an adapter interface to save your data in the database of your choice. For now, you still need to take care of saving your data when it changes.
* __Beta.__ As of this writing, this package is under active development and using semver conventions for beta projects. Minor-level upgrades may be backward breaking while patch-level upgrades will be used for changes that are not backward breaking.
* __Svelte 3 only.__ Unless I'm mistaken, the store API is completely different in Svelte 2.
* __Session ID stored in LocalStorage.__ I understand this is not ideal from a security perspective. It's better to store them in an HttpOnly cookie, but I haven't figured out how to do that yet with this all being based upon socket.io. That said, the MatrX application that is driving this has a very restrictive content security policy (CSP) which essentially blocks all XSS attacks where the primary risk of session stealing is triggered.
* __No automated tests.__ This is the only (of over a dozen) open source projects that I've published that does not have close to 100% automated test coverage. It has none as of this writing. Automated tests for async network code is hard but this is an order of magnitude more difficult. I'd need to stand up a server and two clients and drive them all simultaneously. I've done a lot of manual testing and I'm relying upon the mature socket.io room functionality for the most tricky parts so I think the risk is low but I'd gladly take advice (or better yet pull requests) showing me how to test this. Maybe I'll riff off of [this](https://github.com/agconti/socket.io.tests/blob/master/test/test.js).
