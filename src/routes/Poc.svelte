<script>
  console.log('got here')
  let a = new Array(30)
  console.log(a.length)
</script>

<h1>POC</h1>

<div class="columns is-gapless">
{#each a as column}
  <div class="column has-background-primary with-border is-clipped">
   <p>&nbsp;</p>
  </div>
{/each}
</div>

<div class="columns has-background-primary is-gapless has-text-centered is-vcentered">
  <div class="column is-2 has-background-primary has-text-white">
    <p class="labels">Architecture & Design</p>
  </div>
  <div class="column is-10 has-background-primary">
    <div class="columns practice is-gapless no-margin-bottom is-vcentered">
      <div class="column has-background-primary no-overflow has-text-white">
        <p class="labels">Orange Belt for Developers (aka Codebashing)</p>
      </div>
      <div class="column is-10 has-background-info">
        <div class="columns is-gapless">
          {#each a as column}
            <div class="column has-background-info with-border is-clipped">
              &nbsp;
            </div>
          {/each}
        </div>
      </div>
    </div>
    <div class="columns practice is-gapless no-margin-bottom is-vcentered">
      <div class="column is-2 has-background-primary no-overflow has-text-white">
        <p class="labels">PIA</p>
      </div>
      <div class="column is-10 has-background-primary">
        <div class="columns is-gapless">
          {#each a as column}
            <div class="column has-background-info with-border is-clipped">
              &nbsp;
            </div>
          {/each}
        </div>
      </div>
    </div>

  </div>
</div>

<style>
  .with-border {
    border-top: .25px solid;
    border-right: .25px solid;
    border-color: gray;
  }
  .no-margin-bottom {
    margin-bottom: 0 !important;
  }
  .no-overflow {
    overflow:  hidden;
  }
  .labels {
    padding: 7px;
  }
  .practice {
    padding-right: 7px;
    border-bottom: 1px solid;
    border-color: white;
  }
  .practice:last-child {
    border-bottom: none;
  }
</style>