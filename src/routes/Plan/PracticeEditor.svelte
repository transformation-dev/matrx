<script>
  import {getClient} from '@matrx/svelte-realtime-store'
  import {formulation, plan, openPracticeID} from '../../stores'

  const realtimeClient = getClient()
  const connected = realtimeClient.connected
  // const practicePlan = realtimeClient.realtime({storeID: $openPracticeID}, {})  // TODO: Upgrade the storeID

  function getPracticePlan() {
    return $plan[$openPracticeID]
  }

  function getPracticeMetaData(id) {
    let value
    for (const discipline of formulation.get().disciplines) {
      for (const practice of discipline.practices) {
        if (practice.id === id) {
          value = practice
          value.discipline = discipline
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

  // $: descriptionHTML = getPracticeMetaData($openPracticeID) ? getPracticeMetaData($openPracticeID).description : ""  // TODO: Convert from markdown to html and use below
  
</script>

{#if $openPracticeID}
<!-- {#if $openPracticeID && $practicePlan && getPracticeMetaData($openPracticeID)} -->
  <div id="practice-modal" class="modal" class:is-active={$openPracticeID !== ""}>
    <div class="modal-background" on:click="{() => $openPracticeID = ""}"></div>
    <div class="modal-card">
      <section class="modal-card-body">
        {getPracticePlan().practiceID}
        <div class="field">
          <label class ="label has-text-centered">{getPracticeMetaData($openPracticeID).label}</label>
          <label style="font-weight: normal; font-size: 8pt" class="label has-text-centered">{getPracticeMetaData($openPracticeID).discipline.label}</label>
          <label style="font-size: 8pt; font-weight: normal" class="label has-text-centered">{@html getPracticeMetaData($openPracticeID).description}</label>
        </div>
        <div style="align-items: center" class="field is-horizontal">
          <label class ="label has-right-margin">Change Assessed Level</label>
          <div class="field-body has-text-centered">
            <div class="control">
              <label class="radio">
                <input type="radio" name="foobar">
                Foo
              </label>
              <label class="radio">
                <input type="radio" name="foobar" checked>
                Bar
              </label>
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