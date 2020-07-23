<script>
  import Pusher from 'pusher-js/with-encryption'
  console.log(Pusher)
  const o = {a: {b: 10}}
  // eslint-disable-next-line ParseError
  console.log(a?.b)
</script>

<!-- Spacer -->
<div style="height: 0.5rem" />

<h1>POC</h1>
<div class="rotate-left">Something to test styles</div>

<style>
  .rotate-left {
    transform: rotate(-90deg);
  }
</style>
