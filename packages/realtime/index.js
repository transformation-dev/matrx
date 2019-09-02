'use strict';

const uuidv4 = require('uuid/v4')
const urlComposer = require('url-composer')
// import * as urlComposer from 'url-composer'  // TODO: Fork and make use Sapper convention

class Client {

  constructor() {
    this.path = 'pubsub/connect'
    this.connectionID = uuidv4()
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
  const connectURL = urlComposer.build({
    path: client.path,
    query: {connectionID: client.connectionID},
  })
  client.setEventSource(new EventSource(connectURL))
  
  return client
}

function getServer() {}

const client = new Client()

module.exports = {getClient}