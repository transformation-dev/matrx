<script>
import SortableList from '../SortableList';

let list = ["First Item", "Second Item", "Third Item"];
const sortList = ev => {list = ev.detail};
</script>

<h1> Hey, it's Morgan! </h1>

<div class="tile is-ancestor">
  <div class="tile is-parent">
    <div class="tile is-child is-12"></div>
  </div>
</div>

<div class="columns is-gapless">
  <div class="column is-one-third has-text-centered">
    First column
    <SortableList 
        {list} 
        on:sort={sortList}
    />
  </div>
  <div class="column is-one-third has-text-centered">
    Second column
    <SortableList 
      {list} 
      on:sort={sortList}
    />
  </div>
  <div class="column is-one-third has-text-centered">
    Third column
    <SortableList 
      {list} 
      on:sort={sortList}
    />
  </div>
</div>