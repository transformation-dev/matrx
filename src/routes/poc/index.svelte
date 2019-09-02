<script>
  import { writable } from 'svelte/store'
  import {onMount} from 'svelte'
  import { stores } from '@sapper/app';
  const { preloading, page, session } = stores()
  
  import {initializePage} from '../_helpers'

  const a = writable(0)
  const b = writable(10)
  const pageStores = {a, b}

  onMount(() => {
    initializePage(pageStores)
	})

  function handleClick(event) {
    $a += 1
	}

</script>

<h1>Hello {$a} {$b}</h1>

<button on:click={handleClick} class="button is-primary">hello</button>

