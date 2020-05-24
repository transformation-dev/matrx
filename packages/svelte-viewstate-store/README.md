# `@matrx/view-state`

One aspect of a great UI is that a user can cut and paste the URL and send it to someone
else, and, assuming they have the right permissions, they will see exactly what the first user saw.
This is partially achieved by pulling the data from a shared source like a database
but that doesn't help for variables that the user manipulates to control his view.
For example, if you have a report page where the user can specify a number of 
filter parameters, I want the URL to contain the filter parameters. Or if you have
a carosel over 3 different pictures, I want the URL to specify which picture is
active.

Another aspect of a good UI is that when I return to a given page, unless I was
sent there by a URL containing all the view state, I want the variables that control
how the view looks to use smart defaults. I generally want them to default to the
last value I personally set for that variable and then fallback to some global or
heurisitically-determined default.

`@matrx/view-state` helps with both of these. First, it gives you a place to
store view-state variables and whenever those are updated, the local querystring
is automatically updated. Second, for "required" view-state variables, it saves the 
lastest value that was altered by the user to LocalStorage for restoration the next
time the user is sent to this page without these required view-state variables like
from a main menu.

## Usage

To install with npm

```bash
npm install --save @matrx/view-state
```

In a .svelte file

```html
<script>
  import {Dragster} from '@matrx/dragster'

  function addDragster(node) {
    return new Dragster(node)
  }

  let thingBeingDragged

  function dragStart(event) {
    thingBeingDragged = event.target.id
    event.target.style.opacity = .5
  }

  function drop(event) {
    const id = event.target.id
    Dragster.reset(event.target)  // Very important!
    console.log('id of drop zone', id)
    console.log('id of thing being dragged', thingBeingDragged)
  }

  function enter(event) {
    event.target.style.background = 'grey'
  }

  function leave(event) {
    event.target.style.background = '' 
  }

  function over(event) {  
    event.preventDefault()  // Very important!
  }

  function dragEnd(event) {
    event.target.style.opacity = ""
  }
</script>

<style>
  .draggable {
    width: 200px;
    height: 20px;
    text-align: center;
    background: blue;
  }

  .dropzone {
    width: 200px;
    height: 20px;
    text-align: center;
    background: purple;
  }
</style>

<div use:addDragster id="must-be-unique" class="dropzone" on:drop={drop} on:dragster-enter={enter} on:dragster-leave={leave} on:dragover={over}>
  Drop something on me
</div>

<div id='must-also-be-unique' draggable='true' class="draggable" on:dragstart={dragStart} on:dragend={dragEnd}>
  Drag me
</div>
```

React's JSX and I suspect Angular, Vue, etc. have a similar syntax to above. In JSX, it's `onDragster-start`. You may also have to
create Dragster instances yourself if your UI tech doesn't have
the equivalent to Svelte's `use:` and you should probably manually 
call `destroy()`.

Plain HTML/JavaScript is essentially the same except you'll specify 
the event listeners with `addEventListener()` like in the 
[MDN web docs example](https://developer.mozilla.org/en-US/docs/Web/API/Document/drag_event) except that you have to instantiate the
Dragster instances yourself and you should probably manually call
`destroy()`.
