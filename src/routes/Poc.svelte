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
    <p>Architecture & Design</p>
  </div>
  <div class="column is-10 has-background-primary with-border">
    <div class="columns is-gapless no-margin-bottom is-vcentered">
      <div class="column has-background-primary no-overflow has-text-white">
        <p>Orange Belt for Developers (aka Codebashing)</p>
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
    <div class="columns has-background-primary is-gapless with-border no-margin-bottom is-vcentered">
      <div class="column is-2 has-background-primary no-overflow has-text-white">
        <p class="pb-10">PIA</p>
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
</style>