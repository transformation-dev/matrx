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
    this._retryIn = 1000
    this.connectURL = ''
  }

  init(pubsubPath, callback) {  // TODO: Upgrade this to an async function or an EventEmitter
    if (pubsubPath) {
      this.pubsubPath = pubsubPath
    }

    this.connectURL = urlComposer.build({
      path: this.pubsubPath + '/connect',
      query: {connectionID: this.connectionID},
    })

    this.eventSource = new EventSource(this.connectURL)

    this.eventSource.onmessage = (message) => {
      this.lastEventID = message.lastEventID
      console.log('got message on page', JSON.parse(message.data))
    }
  
    this.eventSource.onopen = (e) => {
      this._retryIn = 1000
      if (this.previouslyOpened) {
        // TODO: Replay to catch up
      } else {
        this.previouslyOpened = true  
      }
      if (callback) {
        return callback(null, e)
      }
    }

    this.eventSource.addEventListener("ping", (e) => {
      const time = JSON.parse(e.data).time
      console.log(time)
      console.log(JSON.parse(e.data))
    })

    this.eventSource.onerror = (e) => {
      if (this.eventSource.readyState === 2) {
        this.init()  // TODO: delay by this.retryIn
      } else if (! this.eventSource.readyState === 0) {
        console.log('eventSource.readyState', this.eventSource.readyState)
        console.log('Inside eventSource.onerror')
        console.log('e:', e)
        throw e
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