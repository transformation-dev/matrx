'use strict'

// import { writable } from 'svelte/store'

class Client {  // Maybe upgrade this to an EventEmitter or do whatever socket.io does

  constructor(namespace) {
    this._namespace = 'MatrX'
  }

  init(namespace) {
    this._namespace = namespace || this._namespace
  }

}

function getClient(namespace) {
  client.init(namespace)
  return client
}

function getServer() {}

const client = new Client()

module.exports = {getClient, getServer}