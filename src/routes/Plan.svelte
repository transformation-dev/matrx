<script>
  import {arrowCircleLeft, arrowCircleRight} from 'svelte-awesome/icons'
  import Icon from 'svelte-awesome'

  const NUMBER_OF_SLIDES = 3
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

<div class="container">
    <div class="columns">
      {#if startOn > 0}
        <div id="pan-left" on:click={panLeft} on:dragenter={startPanTimer} on:dragleave={clearPanTimer} class="column is-narrow has-background-grey">
          <Icon data={arrowCircleLeft} />
          Left
        </div>
      {/if}

      <div class="column has-text-centered has-background-info">

        <div class="card" draggable="true" on:dragstart={dragStart}>
          <div class="card-content">
            <div class="content">{startOn}-{endOn}</div>
          </div>
        </div>

      </div>
      
      {#if endOn < NUMBER_OF_SLIDES - 1}
        <div id="pan-right" on:click={panRight} on:dragenter={startPanTimer} on:dragleave={clearPanTimer} class="column is-narrow has-background-grey">
          <Icon data={arrowCircleRight} />
          Right
        </div>
      {/if}
    </div>
</div>