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

Then in your JavaScript ES6

```javascript
import Dragster from '@matrx/dragster'
```
