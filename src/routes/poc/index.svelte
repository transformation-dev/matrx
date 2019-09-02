<script>
  import { writable } from 'svelte/store'
  import {onMount} from 'svelte'
  import { stores } from '@sapper/app';
  const { preloading, page, session } = stores()
  
  import {getClient} from '@matrx/realtime'

  const a = writable(0)
  const b = writable(10)
  const pageStores = {a, b}

  onMount(() => {
    const client = getClient()
    console.log('in poc/index.svelte', client.path)
	})

  function handleClick(event) {
    $a += 1
	}

</script>

<h1>Hello {$a} {$b}</h1>

<button on:click={handleClick} class="button is-primary">hello</button>

