<script>
  export let kanbanCellContents = []
  export let assessedLevel = ''
  export let queueSwimlaneID = ''

  // import {quintOut} from 'svelte/easing'
  // import {crossfade} from 'svelte/transition'

  import {dragStart, dragEnd, dragEnter, dragOver, dragLeave, drop} from './plan-helpers'
  import {addDragster} from '../../stores'

  // const [send, receive] = crossfade({
  //   duration: d => Math.sqrt(d * 200),
  //   fallback(node, params) {
  //     console.log('using fallback', node)
  //     const style = getComputedStyle(node)
  //     const transform = style.transform === 'none' ? '' : style.transform

  //     return {
  //       duration: 600,
  //       easing: quintOut,
  //       css: t => `
  //         transform: ${transform} scale(${t})
  //         opacity: ${t}
  //       `
  //     }
  //   }
  // })

</script>

<div id={"(" + queueSwimlaneID + ", " + assessedLevel + ")"} use:addDragster class="column drop-zone" {assessedLevel} {queueSwimlaneID} on:dragster-enter={dragEnter} on:dragster-leave={dragLeave} on:drop={drop} on:dragover={dragOver}>
  {#each kanbanCellContents as practice}
    <!-- <div id={practice.practice.id} in:receive="{{key: practice.practice.id}}" out:send="{{key: practice.practice.id}}" class="card has-badge-rounded" data-badge="8" draggable='true' on:dragstart={dragStart} on:dragend={dragEnd}> -->
    <div id={practice.practice.id} class="card has-badge-rounded" data-badge="8" draggable='true' on:dragstart={dragStart} on:dragend={dragEnd}>
      <div class="card-content">
        <div class="content">
          {practice.practice.label}
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .column {
    border-top: 1px solid;
    border-right: 1px solid;
    border-color: gray;
  }
</style>