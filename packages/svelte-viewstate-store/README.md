# `@matrx/svelte-viewstate-store`

`@matrx/svelte-viewstate-store` is a drop-in replacement for Svelte's writable store that 
keeps the URL in sync with any variables that determine the view and saves/restores last 
view state from LocalStorage. The store value, the variable in the querystring, and the
value saved in LocalStorage will all stay in sync.

One aspect of a great UI is that a user can cut and paste the URL and send it to someone
else, and, assuming they have the right permissions, they will see exactly what the first user saw.
This is partially achieved by pulling the data from a database
but that doesn't help for variables that the user manipulates to control their view.
For example, if you have a report page where the user can specify a number of 
filter parameters, its desirable for the URL to contain the filter parameters. Another example
might be if you have a carosel over 5 different pictures, you want the URL to specify which picture is
active. Say `/carosel-page?activePicID=3`.

Another aspect of a good UI is that when a user returns to a given page, they
want the variables that control the view to generally default to the
last values the user set (like a pan-right setting the activePicID to 4 in our carosel example) 
and then fallback to some default... unless, of course, they got to the page
with all the view variables in the URL as described in the prior paragraph.

`@matrx/svelte-viewstate-store` helps with both of these. First, it gives you a place to
store view-state variables and whenever those are updated, the local querystring
is automatically updated. Second, it saves the last user-set values
(but not URL-set ones) to LocalStorage for restoration the next
time the user is sent to this page without these view-state variables like
from a main menu with `href="/carosel-page"`. In this case, it'll read from 
LocalStorage that the last active pic ID was 4 and it'll update the URL to
`/carosel-page?activePicID=4`.

## Installation

To install with npm

```bash
npm install --save @matrx/svelte-viewstate-store
```

## Usage

Create a store on the page you want it scoped to. If you want a globally 
scoped one, create it in `stores.js`and import it whereever you need it 
to drive the view off of.

```JavaScript
const activePicID = new ViewstateStore({
  identifier: 'activePicID',
  defaultValue: 0,
  type: 'Int',  // Also accepts 'Float'. Defaults to 'String'.
  updateLocalStorageOnURLChange: true  // Defaults to false
})
```

### `storeConfig`

* `identifier` - It's usually best to have this equal the name of the 
  variable, but you may want to prefix it with the page for large apps
  or whenever there are other reasons to worry about conflict.
* `defaultValue` - This is only used whenever the variable is not in the 
  querystring nor LocalStorage, like when the first time this user ever 
  visits the page from a menu.
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
