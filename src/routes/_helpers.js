import uuidv4 from 'uuid/v4'
const connectionID = uuidv4()

import urlComposer from 'url-composer'  // TODO: Fork and make use Sapper convention

async function initializePage(pageStores) {
  pageStores['a'].set(5)

  const connectURL = urlComposer.build({
    path: 'pubsub/event-source', 
    query: {connectionID},
  })
  const es = new EventSource(connectURL)

  es.onmessage = (message) => {
    console.log('got message on page', JSON.parse(message.data))
  }

  es.onopen = () => {

  }

}

export {
  initializePage,
}