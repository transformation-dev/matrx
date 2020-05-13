<script>
  export let disciplines = [
    {
      id: 'discipline1',
      label: 'Artisanship',
      description: 'blah',
      documentation: 'blah',
      practices: [
        {
          id: 'practice1',
          label: 'Yellow Belt',
          description: 'Something to say about **Yellow Belt** in Markdown',
          documentation: 'Some _Markdown_ documentation'
        },
        {
          id: 'practice2',
          label: 'Orange Belt',
          description: 'blah blah blah',
          documentation: 'blah'
        }
      ]
    },
    {
      id: 'discipline2',
      label: 'Tools',
      description: 'blah',
      documentation: 'blah',
      practices: [
        {
          id: 'practice3',
          label: 'SCA',
          description: 'in Markdown',
          documentation: 'Some _Markdown_ documentation'
        },        
        {
          id: 'practice4',
          label: 'SAST/IAST',
          description: 'Something to say in Markdown',
          documentation: 'Some _Markdown_ documentation'
        },
        {
          id: 'practice5',
          label: 'Network Originated Scans',
          description: 'blah blah blah',
          documentation: 'blah'
        }
      ]
    }
  ]
  // export let assessmentLevels = {
  //   level1: 'Thoughts',
  //   level2: 'Words'
  // }
  // export let queueSwimlanes = {
  //   queue1: 'Planned',
  //   queue2: 'Stretch'
  // }
  // export let plan = {
  //   practice1: {
  //     practiceID: 'practice1',
  //     formulationID: 'formulation1',
  //     teamID: 'teamA',
  //     assessedLevel: 'level1',
  //     notes: 'Some note',
  //     goalLevel: 'level2',
  //     goalDate: '2020-07-12',
  //     queueSwimlane: 'queue1'
  //   }
  // }

  function dragStart(event) {
    console.log(event.target.id)
  }

</script>

{#each disciplines as discipline}
  <div class="columns">
    <div class="column is-2 is-gapless has-background-grey">
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