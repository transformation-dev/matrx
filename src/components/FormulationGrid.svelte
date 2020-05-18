<script>
  export let slideLabel = ''

  import {formulation, plan, dragStart, dragEnd, dropPan, dragOver, dragLeave, dragEnter, addDragster} from '../stores'

  let blankDisciplineIDs = {}
  $: {
    blankDisciplineIDs = {}
    for (const discipline of $formulation.disciplines) {
      let count = 0
      for (const practice of discipline.practices) {
        if ($plan[practice.id].status == slideLabel) {
          count++
        }
      }
      if (count > 0) {
        blankDisciplineIDs[discipline.id] = false
      } else {
        blankDisciplineIDs[discipline.id] = true
      }
    }
  }

  function localDrop(event) {
    dropPan(event, slideLabel)
  }
</script>

<div class="columns">
  <div class="column has-background-primary has-text-white">
    {slideLabel}
  </div>
</div>

<div class="columns">
  <div id={slideLabel} class="column drop-zone" use:addDragster on:dragster-enter={dragEnter} on:dragster-leave={dragLeave} on:drop={localDrop} on:dragover={dragOver}>
    {#each $formulation.disciplines as discipline}
      <div class="columns">
        {#if slideLabel == 'Todo'}
          <div class="column with-border is-2 has-background-grey-lighter">
            {discipline.label}
          </div>
        {/if}
        {#each discipline.practices as practice}
          {#if $plan[practice.id].status == slideLabel}
            <div id={practice.id} class="column with-border" draggable="true" on:dragstart={dragStart} on:dragend={dragEnd}>
              {practice.label}
            </div>
          {/if}
        {/each}
        {#if blankDisciplineIDs[discipline.id]}
          <div class="column with-border" />
        {/if}
        {#if slideLabel == 'Done'}
          <div class="column with-border is-2 has-background-grey-lighter">
            {discipline.label}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .with-border {
    border-top: 1px solid;
    border-right: 1px solid;
    border-color: gray;
  }
</style>