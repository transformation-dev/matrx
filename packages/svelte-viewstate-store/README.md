# `@matrx/svelte-viewstate-store`

`@matrx/svelte-viewstate-store` is a drop-in replacement for Svelte's writable 
store that keeps the URL in sync with any variables that determine the view. It
also saves/restores the last view state from LocalStorage. The store value, the 
variable in the querystring, and the value saved in LocalStorage will all stay in 
sync.

One aspect of a great UI is that a user can cut and paste the URL and send it to 
someone else, and, assuming they have the right permissions, they will see exactly 
what the first user saw. This is partially achieved by pulling the data from a 
database but that doesn't help for variables that the user manipulates to control 
their view. For example, if you have a report page where the user can specify a 
number of filter parameters, its desirable for the URL to contain the filter 
parameters. Another example might be if you have a carosel over 10 different 
pictures, you want the URL to specify which picture is active. Say 
`/carosel-page?activePicID=3`.

Another aspect of a good UI is that when a user returns to a given page, they
want the variables that control the view to generally default to the
last values the user set and then fallback to some default... unless, of course, 
they got to the page with all the view variables in the URL as described in the 
prior paragraph.

`@matrx/svelte-viewstate-store` helps with both of these. First, whenever
view-state variables are updated by your code, the local 
querystring is automatically updated. Second, it saves the last user-set values
to LocalStorage (for example, if the user hits the "Pan Right" button, it
might change the activePicID to 4) for restoration the next
time the user is sent to this page without these view-state variables like
from a main menu with `href="/carosel-page"`. In this case, it'll read from 
LocalStorage that the last activePicID was 4 and it'll instantly update the URL 
to `/carosel-page?activePicID=4` and start at pic #4 in the carosel.

## Installation

To install with npm

```bash
npm install --save-dev @matrx/svelte-viewstate-store
```

## Usage

Create a store on the page you want it scoped to. If you want a globally 
scoped one, create it in `stores.js` and import it whereever you need it 
to drive the view off of.

```JavaScript
import {ViewstateStore} from '@matrx/svelte-viewstate-store'

const activePicID = new ViewstateStore({
  identifier: 'activePicID',
  defaultValue: 0,
  type: 'Int',  // Also accepts 'Float' and 'Boolean'. Defaults to 'String'.
  updateLocalStorageOnURLChange: true  // Defaults to false
})
```

### `storeConfig`

* `identifier` - It's usually best to have this equal the name of the 
  variable. The scope (see below) is used to prefix this when 
  saving/restoring to/from LocalStorage so there is minimal risk of 
  conflicts.

* `defaultValue` - This is only used whenever the variable is not in the 
  querystring nor LocalStorage, like when the first time this user ever 
  visits the page from a menu.

* `type` - 'Int', 'Float', or 'Boolean'. Defaults to 'String'.

* `scope` - By default, the current route as specified by 
  svelte-spa-router's `location` store when the ViewstateStore is
  instantiated is used to define the "scope" that this variable is
  active. If you navigate away from this scope, the variables will
  cease to update the URL even before the onDestroy callback has a
  chance to remove the subscriptions. 
  
  This works fine for leaf node locations but
  not for variables attached to the root of your app or parents in nested 
  routes. Use this `scope` config option if you want to specify some other 
  scope. For instance, let's say you have a global `teamID` variable
  that is used in many pages. You want `#/?teamID=team1`, but you also want
  `#/my-page?teamID=team1&someOtherVariable=10`. You accomplish this by
  specifying `scope:'/'` in your storeConfig.

  You may also choose to use this option if you want the querystring variables
  to be stable across all possible values of parameterized routes like
  `/posts/:author/:slug`. In this case, specify `scope:'/posts'` in
  your storeConfig.

  Note: the code uses a simple `string.startsWith()` to determine if the 
  variable is still in scope or not. This would not work with any
  regex routes.

* `updateLocalStorageOnURLChange` - The default is to only update
  LocalStorage when changed by your code which is usually in response
  to some explicit user action in the UI. You can override this behavior and 
  update LocalStorage even on URL change by setting this config item to 
  `true`.

activePicID can now be used as you would other Svelte writable store -- in
reactive code like this:

```JavaScript
$: nextPic = $activePicID + 1
```

Or in a callback for a UI action like this:

```HTML
<script>
  function increment() {
    activePicID.update(n => n + 1)
  }

  function reset() {
    $activePicID = 0
  }
</script>

<button on:click={increment}>Increment</button>
<button on:click={reset}>Reset</button>
```

## Warnings

* `@matrx/svelte-viewstate-store` relies upon `svelte-spa-router` and it
  has only been tested with it. If you are using another router, it will
  probably not work.

* At the moment, the `scope` storeConfig option uses `string.startsWith()` 
  so it only works for string specified routes (e.g. '/pictures-page') but 
  not regex routes. I have an idea on how to support this but I personally 
  never use regex routes so it's hard to justify the work.

* As the data and your app evolve, the values in LocalStorage and bookmarked 
  URLs may become invalid. For instance, what if we've saved activePicID=10 
  in LocalStorage but there are now only 8 pictures. No telling how your page 
  will act. So, it's a good idea to validate the values right after you 
  instantiate a ViewstateStore. The good news is that svelte stores update as 
  soon as they are instantiated. So, you can validate and adjust them even 
  before the first render. So, for our example, you could do this:

  ```JavaScript
  const activePicID = new ViewstateStore({
    identifier: 'activePicID',
    defaultValue: 0,
    type: 'Int'
  })
  $activePicID = Math.min(pictures.length - 1, $activePicID)
  ```
