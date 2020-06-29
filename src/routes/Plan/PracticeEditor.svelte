<script>
  import {getClient} from '@matrx/svelte-realtime-store'
  import {formulation, plan, openPracticeID} from '../../stores'

  const realtimeClient = getClient()
  const connected = realtimeClient.connected
  const practicePlan = realtimeClient.realtime({storeID: $openPracticeID}, $plan[$openPracticeID])  // TODO: Upgrade the storeID

  function getPracticeMetaData() {
    let value
    for (const discipline of $formulation.disciplines) {
      for (const practice of discipline.practices) {
        if (practice.id === $openPracticeID) {
          value = practice
          value.displine = discipline
          return value
        }
      }
    }
  }

  $: practiceMetaData = getPracticeMetaData($openPracticeID)

</script>

<div id="practice-modal" class="modal" class:is-active={$openPracticeID !== ""}>
  <div class="modal-background" on:click="{() => $openPracticeID = ""}"></div>
  <div class="modal-card">
    <section class="modal-card-body">
      {$practicePlan.practiceID}
      {practiceMetaData.description}
    </section>
  </div>
</div>

<style>

</style>