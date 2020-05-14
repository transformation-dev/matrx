<script>
  export let kanbanCellContents = []
  export let assessedLevel = ''
  export let queueSwimlaneID = ''

  import {dragStart, dragEnd, dragEnter, dragOver, dragLeave, drop, addDragster} from '../stores.js'

</script>

<div use:addDragster class="column drop-zone" {assessedLevel} {queueSwimlaneID} on:dragster-enter={dragEnter} on:dragster-leave={dragLeave} on:drop={drop} on:dragover={dragOver}>
  {#each kanbanCellContents as practice}
    <div id={practice.practice.id} class="card" draggable='true' on:dragstart={dragStart} on:dragend={dragEnd}>
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