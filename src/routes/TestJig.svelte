<script>
  import {RealtimeStore} from '@matrx/svelte-realtime-store'
  import ShortUniqueId from 'short-unique-id'
  const connected = RealtimeStore.connected
  const storeID = new ShortUniqueId().randomUUID(13)  // Using a random number so parallelized test runs don't interfere with each other

  const a = new RealtimeStore({storeID, debounceWait: 1000, forceEmitBack: true, defaultValue: 2000})
  const aPrime = new RealtimeStore({storeID, ignoreLocalSet: true, defaultValue: 2000})

  const b = new RealtimeStore({storeID: 'b', defaultValue: 400})

  function handleA(event) {
    $a = $a + 1
  }
  
  function handleAPrime(event) {
    $aPrime++
  }

  function handleB(event) {
    $b = $b + 1
  }
  
</script>

<h1 id="a-value">{$a}</h1>
<button id="a-button" on:click={handleA} class="button" disabled="{!$connected}">a++</button>

<h1 id="a-prime-value">{$aPrime}</h1>
<button id="a-prime-button" on:click={handleAPrime} class="button" disabled="{!$connected}">aPrime++</button>

<hr />

<h1 id="b-value">{$b}</h1>
<button id="b-button" on:click={handleB} class="button" disabled="{!$connected}">b++</button>
<button id="b-reset" on:click={() => $b = 0} class="button" disabled="{!$connected}">Reset</button>

