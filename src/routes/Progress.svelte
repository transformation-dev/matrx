<script>
  import Icon from 'svelte-awesome'
  import {trophy, comments, listUl, lightbulbO, question, balanceScale} from 'svelte-awesome/icons'

  const a = new Array(30)

  const levelConfig = [  // TODO: Make all the icons (and maybe colors, etc.) into some object we import
    // levelConfig[0]  is the "best" level, closest to center, and baseColor
    {_entityID: "level0", label: "Culture", description: "We have fully adopted this practice", color: "#003300", icon: trophy},
    // Other levels without a color will be a gradient of the baseColor
    {_entityID: "level1", label: "Actions", description: "We’re in the process of adopting this practice", color: "#008800", icon: listUl},
    {_entityID: "level2", label: "Words", description: "We’re making plans to adopt this practice", color: "#00FF00", icon: comments},
    // The last index without a color will be white
    {_entityID: "level3", label: "Thoughts", description: "We do not have plans for this practice", color: "#FFFFFF", icon: lightbulbO},
    // You can specify a color for any of the levels, useful for NA or the like. Must come after baseColor-derived levels
    {_entityID: "level4", label: "Unknown", description: "Unassessed or Needs follow up", color: "#A0C5DA", icon: question},
    // excludeFromGoal values must all be at the end
    {_entityID: "level5", label: "Trade-off", description: "This practice is not worth it in this context", color: "#CCCCCC", icon: balanceScale},
  ]

</script>

<!-- Legend -->
<div style="position: sticky; top: 3.5rem; padding-left: 30px; padding-right: 15px;" class="columns has-background-white">
  {#each levelConfig as level}
    <div class="column is-label">
      <div class="columns has-text-centered is-gapless is-vcentered">
        <div style="background-color: {level.color}" class="column legend-color-indicator has-tooltip-bottom" data-tooltip={level.description}>
          <span style="font-size: 8pt;">55%</span>
        </div>
        <div class="column is-2 has-tooltip-bottom" data-tooltip={level.description}>
          <Icon style="vertical-align: -3.5px;" data={level.icon} />
        </div>
        <div style="text-align: left; white-space: nowrap;" class="column is-6 has-tooltip-bottom" data-tooltip={level.description}>{level.label}</div>
      </div>
    </div>
  {/each}
</div>

<!-- Spacer -->
<div style="height: 0.5rem" />

<!-- Org maturity visualization -->
<div class="columns discipline has-background-primary is-gapless has-text-centered is-vcentered">
  <div class="column is-2 has-background-primary has-text-white">
    <p class="is-label">Architecture & Design</p>
  </div>
  <div class="column is-10 has-background-primary">
    <div class="columns practice is-gapless no-margin-bottom is-vcentered">
      <div class="column has-background-primary no-overflow has-text-white">
        <p class="is-label">Orange Belt for Developers (aka Codebashing)</p>
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
        <p class="is-label">PIA</p>
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
  .legend-color-indicator {
    border: .25px solid;
    border-color: gray;
    margin: 7px;
  }
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
  .is-label {
    padding: 7px;
    font-size: 9pt;
  }
  .practice {
    padding-right: 7px;
    border-bottom: 1px solid;
    border-left: 1px solid;
    border-color: white;
  }
  .practice:last-child {
    border-bottom: none;
  }
  .discipline {
    border-bottom: 1px solid;
    border-color: white;
  }
  .discipline:last-child {
    border-bottom: none;
  }
</style>