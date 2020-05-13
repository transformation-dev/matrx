<script>
  import {arrowCircleLeft, arrowCircleRight} from 'svelte-awesome/icons'
  // import Icon from 'svelte-awesome'
  import FormulationGrid from '../components/FormulationGrid.svelte'

  const slides = [
    {label: 'Todo'},
    {label: 'Doing'},
    {label: 'Done'},
  ]
  const NUMBER_OF_SLIDES = slides.length
  let startOn = 1
  let slidesToDisplay = 1
  $: endOn = startOn + slidesToDisplay - 1

  let panTimer = null

  function panLeft() {
    startOn = Math.max(0, startOn - 1)
  }

  function panRight() {
    startOn = Math.min(NUMBER_OF_SLIDES - 1, startOn + 1)
  }

  function dragStart(event) {
    console.log(event.target)
  }

  function startPanTimer(event) {
    console.log(event)
    if (event.target.id === "pan-right") {
      panTimer = setTimeout(panRight, 1000)
    } else if (event.target.id === "pan-left") {
      panTimer = setTimeout(panLeft, 1000)
    }
  }

  function clearPanTimer() {
    clearTimeout(panTimer)
  }

  function drop() {
    dragActive = false
  }

</script>

<h1>Plan</h1>

<div class="section">
  <div class="columns is-vcentered has-background-primary">
    {#if startOn > 0}
      <div id="pan-left" on:click={panLeft} on:dragenter={startPanTimer} on:dragleave={clearPanTimer} class="column is-narrow has-background-primary">
        <!-- <Icon data={arrowCircleLeft} /> -->
        <div class="rotate-left has-text-centered">{slides[startOn - 1].label}</div>
      </div>
    {/if}

    <div class="column has-text-centered has-background-info">
      <div class="columns">
        <div class="column is-gapless has-background-primary">
          {slides[startOn].label}
        </div>
      </div>
      <FormulationGrid />
    </div>
    
    {#if endOn < NUMBER_OF_SLIDES - 1}
      <div id="pan-right" on:click={panRight} on:dragenter={startPanTimer} on:dragleave={clearPanTimer} class="column is-narrow has-background-primary">
        <!-- <Icon data={arrowCircleRight} /> -->
        <div class="rotate-right">{slides[startOn + 1].label}</div>
      </div>
    {/if}
  </div>
</div>

<style>
  .rotate-left {
    transform: rotate(-90deg);
  }
  .rotate-right {
    transform: rotate(90deg);
  }
</style>