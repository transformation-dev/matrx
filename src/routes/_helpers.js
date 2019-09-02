async function initializePage(pageStores) {
  pageStores['a'].set(5)
  let es = new EventSource('pubsub/event-source')
  es.onmessage = (message) => {
    console.log(JSON.parse(message.data))
  }
}

export {
  initializePage,
}