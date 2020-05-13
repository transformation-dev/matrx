<script>

  import {formulation, plan, dragStart} from '../stores'

</script>

{#each $formulation.disciplines as discipline}
  <div class="columns">
    <div class="column is-2 has-background-grey">
      {discipline.label}
    </div>
    {#each discipline.practices as practice}
      <div id={practice.id} class="column" draggable="true" on:dragstart={dragStart}>
        {practice.label}
      </div>
    {/each}
  </div>
{/each}

<style>
  .column {
    border-top: 1px solid;
    border-right: 1px solid;
    border-color: gray;
  }
</style>