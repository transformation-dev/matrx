<script>
  import {getClient} from '@matrx/svelte-realtime-store'
  import ShortUniqueId from 'short-unique-id'
  const realtimeClient = getClient()
  const connected = realtimeClient.connected
  const storeID = new ShortUniqueId().randomUUID(13)  // Using a random number so parallelized test runs don't interfere with each other

  const a = realtimeClient.realtime({storeID, debounceWait: 1000, forceEmitBack: true}, 2000)
  const aPrime = realtimeClient.realtime({storeID, ignoreLocalSet: true}, 2000)

  function handleA(event) {
    $a = $a + 1
  }
  
  function handleAPrime(event) {
    $aPrime++
  }
  
</script>

<h1 id="a-value">{$a}</h1>
<button id="a-button" on:click={handleA} class="button" disabled="{!$connected}">a++</button>

<h1 id="a-prime-value">{$aPrime}</h1>
<button id="a-prime-button" on:click={handleAPrime} class="button" disabled="{!$connected}">aPrime++</button>