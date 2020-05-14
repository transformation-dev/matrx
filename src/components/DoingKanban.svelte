<script>

  import {formulation, plan, queueSwimlanes, drop} from '../stores'
  import { onMount } from 'svelte'
  import KanbanCell from './KanbanCell'

  const practicesIndex = {}
  $: {
    for (const discipline of $formulation.disciplines) {
      for (const practice of discipline.practices) {
        practicesIndex[practice.id] = practice
      }
    }
  }

  let kanbanRestructured = {}  // {queueSwimlaneID: {assessedLevel: [<div class="card">]}}
  $: {
    kanbanRestructured = {}
    for (const [queueSwimlaneID, queueSwimlane] of Object.entries($queueSwimlanes)) {
      kanbanRestructured[queueSwimlane.id] = {
        Words: [],
        Actions: [],
        Culture: []
      }
    }
    for (const [practiceID, practice] of Object.entries($plan)){
      if (practice.status === 'Doing') {
        practice.practice = practicesIndex[practiceID]
        if (practice.queueSwimlaneID && practice.assessedLevel) {
          kanbanRestructured[practice.queueSwimlaneID][practice.assessedLevel].push(practice)
        } 
      }
    }
  }

</script>

<div class="columns">
  <div class="column has-background-primary has-text-white">
    Doing
  </div>
</div>

<!-- Fixed columns/column set for top row labels -->
<div class="columns">
  <div class="column is-2 has-background-grey-lighter" />
  <div class="column has-background-grey-lighter has-text-black">Words</div>
  <div class="column has-background-grey-lighter has-text-black">Actions</div>
  <div class="column has-background-grey-lighter has-text-black">Culture</div>
</div>

<!-- each loop over queueSwimlanes -->
{#each Object.entries(kanbanRestructured) as [queueSwimlaneID, queueSwimlaneContents]}
  <div class="columns">
    <div class="column is-in-center is-2 has-background-grey-lighter has-text-black">
      {$queueSwimlanes[queueSwimlaneID].label}
    </div>
    <KanbanCell assessedLevel='Words' {queueSwimlaneID} kanbanCellContents={queueSwimlaneContents.Words} />
    <KanbanCell assessedLevel='Actions' {queueSwimlaneID} kanbanCellContents={queueSwimlaneContents.Actions} />
    <KanbanCell assessedLevel='Culture' {queueSwimlaneID} kanbanCellContents={queueSwimlaneContents.Culture} />
  </div>
{/each}

<style>
  .column {
    border-top: 1px solid;
    border-right: 1px solid;
    border-color: gray;
  }
  .is-in-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>