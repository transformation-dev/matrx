'use strict'

const uuidv4 = require('uuid/v4')
const urlComposer = require('url-composer')

class Client {

  constructor() {
    this.pubsubPath = 'pubsub'
    this.connectionID = uuidv4()
    this.eventSource = null
    this.previouslyOpened = false
    this.lastEventID = null
  }

  init(pubsubPath, callback) {  // TODO: Upgrade this to an async function or an EventEmitter
    if (pubsubPath) {
      this.pubsubPath = pubsubPath
    }

    const connectURL = urlComposer.build({
      path: this.pubsubPath + '/connect',
      query: {connectionID: this.connectionID},
    })
    this.eventSource = new EventSource(connectURL)

    this.eventSource.onmessage = (message) => {
      this.lastEventID = message.lastEventID
      console.log('got message on page', JSON.parse(message.data))
    }
  
    this.eventSource.onopen = (e) => {
      if (this.previouslyOpened) {
        // TODO: Replay to catch up
      } else {
        this.previouslyOpened = true  
      }
      if (callback) {
        return callback(null, e)
      }
    }

    this.eventSource.onerror = (e) => {
      if (callback) {
        return callback( e)
      } else {
        throw new Error(e)
      }
    }
  }

}

/**
 * [getClient description]
 *
 * @param   {[string]}    pubsubPath   [pubsubPath description]
 * @param   {[function]}  callback     [callback description]
 *
 * @return  {[Client]}                 [return description]
 * 
 * @example
 * 
 * const client = getClient('path/to/pubsub', (err, res) => {
 *   if (err) {
 *     console.error(err)
 *   } else {
 *     console.log(res)
 *   }
 * })
 * 
 */
function getClient(path, callback) {
  client.init(path, callback)
  
  return client
}

function getServer() {}

const client = new Client()

module.exports = {getClient, getServer}