const debug = require('debug')('matrx:svelte-realtime-store')
const {debounce} = require('lodash')

import {onDestroy} from 'svelte'
import {writable} from 'svelte/store'

debug('svelte-realtime-store loads and initializes')
const namespace = '/svelte-realtime'
let socket = null
const stores = {}  // {storeID: [store]}
const components = {}  // {storeID: component}  // TODO: Need to upgrade this to an array like stores

export class RealtimeStore {
  constructor(storeConfig) {
    this.storeConfig = storeConfig || {}
    this.storeID = storeConfig.storeID || storeConfig._entityID || JSON.stringify(storeConfig)
    this.component = storeConfig.component || null
    this.debounceWait = storeConfig.debounceWait || 0
    this.forceEmitBack = storeConfig.forceEmitBack || false  // added to enable single-page testing
    this.ignoreLocalSet = storeConfig.ignoreLocalSet || false  // added to enable single-page testing
    this.defaultValue = storeConfig.defaultValue || null

    this.lastNewValue = null

    this.wrappedStore = writable(storeConfig.defaultValue)
    this.subscribe = this.wrappedStore.subscribe

    // this._emitSet = this._emitSet.bind(this)
    // this._debouncedEmit = debounce(this._emitSet, this.debounceWait).bind(this)

    if (this.component) {
      components[this.storeID] = this.component
    }
    if (!stores[this.storeID]) {
      stores[this.storeID] = []
    }
    stores[this.storeID].push(this)

    // this.set(this.defaultValue)
  }

  _emitSet() {  // TODO: This may need .bind(this) in constructor
    debug('emitSet() called. storeID: %O, lastNewValue: %O, forceEmitBack: %O', this.storeID, this.lastNewValue, this.forceEmitBack)
    if (socket) {
      socket.emit('set', this.storeID, this.lastNewValue, this.forceEmitBack)
    }
  }

  _debouncedEmit() {
    this._emitSet()
  }
  
  // set(newValue) {
  //   this.wrappedStore.set(newValue)
  // }

  set(newValue) {
    debug('inside set(). this.storeID: %O', this.storeID)
    debug('inside set(). newValue: %O', newValue)
    this.lastNewValue = newValue
    if (this.debounceWait) {
      this._debouncedEmit()
    } else {
      this._emitSet()
    }
    stores[this.storeID].forEach((store) => {
      if (!store.ignoreLocalSet) {
        store.wrappedStore.set(newValue)
      }
    })
  }

  update(fn) {
    let newValue
    this.wrappedStore.update((currentValue) => {
      newValue = fn(currentValue)
      return newValue
    })
    this.set(newValue)
  }

}

RealtimeStore.connected = writable(false)

RealtimeStore.afterAuthenticated = function(callback) {  // TODO: Does this need to be an => function?
  try {
    debug('afterAutenticated() called')
    socket.on('set', (storeID, value) => {
      debug('set msg received. storeID: %s  value: %O', storeID, value)
      stores[storeID].forEach((store) => {
        store.wrappedStore.set(value)
      })
    })
    socket.on('revert', (storeID, value) => {
      debug('revert msg received. storeID: %s  value: %O', storeID, value)
      stores[storeID].forEach((store) => {
        store.wrappedStore.set(value)
        // TODO: Send "revert" event to each component
      })
    })
    socket.on('saved', (storeID) => {
      debug('set msg received. storeID: %s', storeID)
      // TODO: Send "saved" event to each component
    })
    const storesReshaped = []
    for (const storeID in stores) {
      stores[storeID][0].wrappedStore.update((value) => {
        storesReshaped.push({storeID, value})
      })
    }
    socket.emit('join', storesReshaped)
    RealtimeStore.connected.set(true)
    callback(true)
  } catch (e) {
    if (e instanceof RangeError) {
      // location.reload()
      throw e
    }
  }
}

RealtimeStore.restoreConnection = function(callback) {  // TODO: Does this need to be an => function?
  try {
    debug('restoreConnection() called')
    if (socket) {
      socket.removeAllListeners()
      socket = null
    }
    socket = io(namespace)  
    socket.on('connect', () => {
      debug('connect msg received')
      socket.on('disconnect', () => {
        debug('disconnect msg received')
        RealtimeStore.connected.set(false)
        socket.removeAllListeners()  
        socket.on('reconnect', () => {
          debug('reconnect msg received')
          RealtimeStore.restoreConnection(() => {
            debug('Got response to call to restoreConnection() from inside reconnect event. Ignoring.')
          })
        })
      })
      RealtimeStore.afterAuthenticated(callback)
    })
  } catch (e) {
    if (e instanceof RangeError) {
      // location.reload()
      throw e
    }
  }
}
