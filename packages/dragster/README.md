# `@matrx/dragster`

`@matrx/dragster` is a port of [Ben Smithett's dragster](http://bensmithett.github.io/dragster) to ES6. 
It wraps the native dragenter/dragleave to behave like mouse event when hovering over child DOM elements.

## Differences from the original
  
  * Has been converted from CoffeeScript to JavaScript
  * Has had its events renamed to 'dragster-enter' and 
    'dragster-leave'
  * Uses ES6 Class
  * Keeps track of its instances for later reference so your drop 
    callback has a way to call `reset()`
  * Provides a `destroy()` method that can be used as a callback to 
    remove said instances. If you use this with Svelte's `use:` 
    directive, then Svelte will automatically call `destroy()` as
    something is removed from the DOM.

## Usage

To install with npm

```bash
npm install --save @matrx/dragster
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
    Dragster.getDragster(id).reset()  // Very important!
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
