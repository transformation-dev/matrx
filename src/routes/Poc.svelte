<script>
  import {getClient} from '@matrx/svelte-realtime-store'
  const realtimeClient = getClient()
  const connected = realtimeClient.connected

  const a = realtimeClient.realtime({_entityID: 'A'}, 2000)
  const aPrime = realtimeClient.realtime({_entityID: 'A'}, 2000)
  const b = realtimeClient.realtime({_entityID: 'B', debounceWait: 1000, forceEmitBack: true}, 4000)
  const bPrime = realtimeClient.realtime({_entityID: 'B', ignoreLocalSet: true}, 4000)

  function handleA(event) {
    $a = $a + 1
  }
  
  function handleAPrime(event) {
    $aPrime++
  }

  function handleB(event) {
    $b++
  }

  function handleBPrime(event) {
    $b++
  }
  
</script>

<h1>{$a}</h1>
<button id="a" on:click={handleA} class="button" disabled="{!$connected}">a++</button>

<h1>{$aPrime}</h1>
<button id="a-prime" on:click={handleAPrime} class="button" disabled="{!$connected}">aPrime++</button>

<h1>{$b}</h1>
<button id="b" on:click={handleB} class="button" disabled="{!$connected}">b++</button>

<h1>{$bPrime}</h1>
<button id="b" on:click={handleBPrime} class="button" disabled="{!$connected}">bPrime++</button>