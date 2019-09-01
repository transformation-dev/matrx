

export default {
  initializePage: (pageStores) => {
    console.log('inside initializePage')
    console.log(pageStores)
    pageStores.a.set(5)
    pubsubClient.subscribe('/messages', function(message) {
      console.log('Got a message: ' + message.text);
    })
    // console.log(window.location)
    // let url = new URL(window.location.href)
    // url.searchParams.sort()
    // console.log(url.search)
    // console.log(url)
  },
}