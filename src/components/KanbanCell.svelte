<script>
  export let kanbanCellContents = []
  export let assessedLevel = ''
  export let queueSwimlaneID = ''
  import {dragStart, dragEnd, dragEnter, dragLeave, drop} from '../stores.js'
</script>

<div class="column" is-cell={true} {assessedLevel} {queueSwimlaneID} on:dragenter={dragEnter} on:dragleave={dragLeave}>
  {#each kanbanCellContents as practice}
    <div id={practice.practice.id} class="card" draggable='true'>
      <div class="card-content" is-cell={false} {assessedLevel} {queueSwimlaneID} on:dragenter={dragEnter} on:dragstart={dragStart} on:dragend={dragEnd} on:drop={drop} >
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