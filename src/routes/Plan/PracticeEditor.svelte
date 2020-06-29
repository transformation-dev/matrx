<script>
  import {getClient} from '@matrx/svelte-realtime-store'
  import {formulation, plan, openPracticeID} from '../../stores'

  const realtimeClient = getClient()
  const connected = realtimeClient.connected
  const practicePlan = realtimeClient.realtime({storeID: 'something' + $openPracticeID}, {})  // TODO: Upgrade the storeID
  $: practicePlan.set($plan[$openPracticeID])

  function getPracticeMetaData(id) {
    let value
    for (const discipline of $formulation.disciplines) {
      for (const practice of discipline.practices) {
        if (practice.id === id) {
          value = practice
          value.discipline = discipline
          console.log('got here')
          return value
        }
      }
    }
    return null
  }

  // let practiceMetaData
  // $: {
  //   // practiceMetaData = getPracticeMetaData($openPracticeID, $formulation)
  //   let value = null
  //   for (const discipline of $formulation.disciplines) {
  //     for (const practice of discipline.practices) {
  //       if (practice.id === $openPracticeID) {
  //         value = practice
  //         value.displine = discipline
  //         console.log('fount it')
  //         break
  //       }
  //     }
  //   }
  //   practiceMetaData = value
  // }

</script>

{#if $openPracticeID && $practicePlan}
  <div id="practice-modal" class="modal" class:is-active={$openPracticeID !== ""}>
    <div class="modal-background" on:click="{() => $openPracticeID = ""}"></div>
    <div class="modal-card">
      <section class="modal-card-body">
        {$practicePlan.practiceID}
        {getPracticeMetaData($openPracticeID).description}
      <div class="field">
        <label class ="label has-text-centered">Practice Name</label>
        <label style="font-weight: normal; font-size: 8pt" class="label has-text-centered">Discipline Name</label>
        <label style="font-size: 8pt; font-weight: normal" class="label has-text-centered">Description</label>
      </div>
      <div class="field is-horizontal">
        <label class ="label has-right-margin">Change Assessed Level</label>
          <div class="field-body has-text-centered">
            <div class="control">
              <div class="select">
                <select>
                  <option>Culture</option>
                  <option>Actions</option>
                  <option>Words</option>
                  <option>Thoughts</option>
                  <option>Unknown</option>
                  <option>Trade-offs</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
{/if}

<style>
  .has-right-margin {
    margin-right: 20px !important;
  }

</style>