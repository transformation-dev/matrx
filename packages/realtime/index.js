'use strict';

// import uuidv4 from 'uuid/v4'
// console.log(uuid)
// import * as urlComposer from 'url-composer'  // TODO: Fork and make use Sapper convention

class Client {

  constructor() {
    this.path = 'pubsub/connect'
    // this.connectionID = uuid.uuidv4()
    this.eventSource = null
  }

  setEventSource(es) {
    es.onmessage = (message) => {
      console.log('got message on page', JSON.parse(message.data))
    }
  
    es.onopen = () => {
      console.log('es is open inside new Client class')
    }
  }

  yes() {
    console.log('inside client')
  }

}

function getClient(path, callback) {
  if (path) {
    client.path = path
  }
  const connectURL = client.path + '?connectionID=' + client.connectionID
  // const connectURL = urlComposer.build({
  //   path: client.path,
  //   query: {connectionID: client.connectionID},
  // })
  client.setEventSource(new EventSource(connectURL))
  
  return client
}

function getServer() {}

const client = new Client()

module.exports = {getClient}