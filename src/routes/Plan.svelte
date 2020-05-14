<script>
  import {arrowCircleLeft, arrowCircleRight, spinner} from 'svelte-awesome/icons'
  import Icon from 'svelte-awesome'
  import FormulationGrid from '../components/FormulationGrid.svelte'
  import DoingKanban from '../components/DoingKanban.svelte'
  import {addDragster, dropPan, dragOver, dragEnter} from '../stores.js'

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
    panTimer = null
  }

  function panRight() {
    startOn = Math.min(NUMBER_OF_SLIDES - 1, startOn + 1)
    panTimer = null
  }

  function startPanTimer(event) {
    event.target.style.background = 'grey'
    if (event.target.id === "pan-right") {
      panTimer = setTimeout(panRight, 1000)
    } else if (event.target.id === "pan-left") {
      panTimer = setTimeout(panLeft, 1000)
    }
  }

  function clearPanTimer(event) {
    event.target.style.background = ''
    clearTimeout(panTimer)
    panTimer = null
  }

  function dropLeft(event) {
    clearPanTimer(event)
    dropPan(event, slides[startOn - 1].label)
  }

  function dropRight(event) {
    clearPanTimer(event)
    dropPan(event, slides[startOn + 1].label)
  }

</script>

<h1>Plan</h1>

<div class="section">
  <div class="columns has-background-primary">
    {#if startOn > 0}
      <div use:addDragster id="pan-left" class="column drop-zone is-narrow has-text-centered" on:click={panLeft} on:drop={dropLeft} on:dragster-enter={startPanTimer} on:dragster-leave={clearPanTimer} on:dragover={dragOver}>
        {#if panTimer}
          <Icon data={spinner} pulse scale="1.75" style="fill: white; padding: 5px"/>
        {:else}
          <Icon data={arrowCircleLeft} scale="1.75" style="fill: white; padding: 5px"/>
        {/if}
        <div class="rotate-left has-text-centered has-text-white">{slides[startOn - 1].label}&nbsp;&nbsp;&nbsp;</div>
      </div>
    {/if}

    {#if startOn <= 0 &&  endOn >= 0}
      <div class="column has-text-centered has-background-info">
        <FormulationGrid slideLabel={slides[0].label} />
      </div>
    {/if}

    {#if startOn <= 1 && endOn >= 1}
      <div class="column has-text-centered has-background-primary">
        <DoingKanban />
      </div>
    {/if}

    {#if startOn <= 2 &&  endOn >= 2}
      <div class="column has-text-centered has-background-info">
        <FormulationGrid slideLabel={slides[2].label} />
      </div>
    {/if}

    {#if endOn < NUMBER_OF_SLIDES - 1}
      <div use:addDragster id="pan-right" on:click={panRight} on:drop={dropRight} on:dragster-enter={startPanTimer} on:dragster-leave={clearPanTimer} on:dragover={dragOver} class="column drop-zone is-narrow has-text-centered">
        {#if panTimer}
          <Icon data={spinner} pulse scale="1.75" style="fill: white; padding: 5px"/>
        {:else}
          <Icon data={arrowCircleRight} scale="1.75" style="fill: white; padding: 5px"/>
        {/if}
        <div class="rotate-right has-text-centered has-text-white">&nbsp;&nbsp;&nbsp;{slides[startOn + 1].label}</div>
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