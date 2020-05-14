<script>
  import {arrowCircleLeft, arrowCircleRight} from 'svelte-awesome/icons'
  import Icon from 'svelte-awesome'
  import FormulationGrid from '../components/FormulationGrid.svelte'
  import DoingKanban from '../components/DoingKanban.svelte'
  import {addDragster} from '../stores.js'

  const slides = [
    {label: 'Todo'},
    {label: 'Doing'},
    {label: 'Done'},
  ]
  const NUMBER_OF_SLIDES = slides.length
  let startOn = 0
  let slidesToDisplay = 1
  $: endOn = startOn + slidesToDisplay - 1


  let panTimer = null

  function panLeft() {
    startOn = Math.max(0, startOn - 1)
  }

  function panRight() {
    startOn = Math.min(NUMBER_OF_SLIDES - 1, startOn + 1)
  }

  function startPanTimer(event) {
    if (event.target.id === "pan-right") {
      panTimer = setTimeout(panRight, 1000)
    } else if (event.target.id === "pan-left") {
      panTimer = setTimeout(panLeft, 1000)
    }
  }

  function clearPanTimer() {
    clearTimeout(panTimer)
  }

  function drop(event) {
    
  }

</script>

<h1>Plan</h1>

<div class="section">
  <div class="columns has-background-primary">
    {#if startOn > 0}
      <div use:addDragster id="pan-left" on:click={panLeft} on:dragster-enter={startPanTimer} on:dragster-leave={clearPanTimer} class="column drop-zone is-narrow has-background-primary has-text-centered">
        <Icon data={arrowCircleLeft} scale="1.75" style="fill: white; padding: 5px"/>
        <div class="rotate-left has-text-centered has-text-white">{slides[startOn - 1].label}</div>
      </div>
    {/if}

    {#if startOn <= 0 &&  endOn >= 0}
      <div class="column has-text-centered has-background-info">
        <FormulationGrid label={slides[0].label} />
      </div>
    {/if}

    {#if startOn <= 1 && endOn >= 1}
      <div class="column has-text-centered has-background-primary">
        <DoingKanban />
      </div>
    {/if}

    {#if startOn <= 2 &&  endOn >= 2}
      <div class="column has-text-centered has-background-info">
        <FormulationGrid label={slides[2].label} />
      </div>
    {/if}

    {#if endOn < NUMBER_OF_SLIDES - 1}
      <div id="pan-right" on:click={panRight} on:dragenter={startPanTimer} on:dragleave={clearPanTimer} class="column is-narrow has-background-primary has-text-centered">
        <Icon data={arrowCircleRight} scale="1.75" style="fill: white; padding: 5px"/>
        <div class="rotate-right has-text-centered has-text-white">{slides[startOn + 1].label}</div>
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