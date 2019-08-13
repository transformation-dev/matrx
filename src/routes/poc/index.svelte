<script>
  import { writable } from 'svelte/store'

  const color = writable('blue')

</script>

<h1>Hello</h1>

<button type="button" class="btn btn-primary">hello</button>

<button type="button" class="btn btn-lg btn-danger" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?">Click to toggle popover</button>
