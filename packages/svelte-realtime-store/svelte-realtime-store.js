// const io = require('socket.io-client')  // This was not working with rollup for my SPA so I now load it from the server in my index.html

const {writable, readable} = require('svelte/store')
const {debounce} = require('lodash')
const debug = require('debug')('svelte-realtime:store')

// From svelte
const subscriber_queue = []
function noop() {}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function')
}

class Client { 

  constructor(namespace = Client.DEFAULT_NAMESPACE) {
    debug('Client.constructor() called')
    this._namespace = namespace
    this.connected = writable(false)
    this.socket = null
    this.stores = {}  // {storeID: [store]}
    this.components = {}  // {storeID: component}  // TODO: Need to upgrade this to an array like stores
  }

  afterAuthenticated(callback) {
    debug('afterAutenticated() called')
    this.socket.on('set', (storeID, value) => {
      debug('set msg received. storeID: %s  value: %O', storeID, value)
      client.stores[storeID].forEach((store) => {
        store._set(value)
      })
    })
    this.socket.on('revert', (storeID, value) => {
      debug('revert msg received. storeID: %s  value: %O', storeID, value)
      client.stores[storeID].forEach((store) => {
        store._set(value)
        // TODO: Send "revert" event to each component
      })
    })
    this.socket.on('saved', (storeID) => {
      debug('set msg received. storeID: %s', storeID)
      // TODO: Send "saved" event to each component
    })
    const storesReshaped = []
    for (const storeID in client.stores) {
      storesReshaped.push({storeID, value: client.stores[storeID][0].get()})
    }
    this.socket.emit('join', storesReshaped)
    this.connected.set(true)
    callback(null)
  }

  restoreSession(callback) { 
    debug('restoreSession() called')
    this.socket = io(this._namespace)  
    this.socket.removeAllListeners()
    this.socket.on('connect', (result) => {
      debug('connect msg received.  result: %O', result)
      this.socket.on('disconnect', () => {
        debug('disconnect msg received')
        this.connected.set(false)
        this.socket.removeAllListeners()  
        this.socket.on('reconnect', () => {
          debug('reconnect msg received')
          this.connect(() => {
            debug('Got response to call to connect() from inside reconnect event. Ignoring.')
          })
        })
      })
      this.afterAuthenticated(callback)
      // this.connected.set(true)
    })
  }

  realtime(storeConfig, default_value, component = null, start = noop) {
    const storeID = storeConfig.storeID || storeConfig._entityID || JSON.stringify(storeConfig)
    const debounceWait = storeConfig.debounceWait || 0
    const forceEmitBack = storeConfig.forceEmitBack || false  // added to enable single-page testing
    const ignoreLocalSet = storeConfig.ignoreLocalSet || false  // added to enable single-page testing
    let value
    let stop
    const subscribers = []
    let lastNewValue

    function emitSet() {
      debug('emitSet() called')
      client.socket.emit('set', storeID, lastNewValue, forceEmitBack)
    }
    const debouncedEmit = debounce(emitSet, debounceWait)

    function set(new_value) {
      lastNewValue = new_value
      if (safe_not_equal(value, new_value)) {
        if (stop) { // store is ready
          debouncedEmit()
          client.stores[storeID].forEach((store) => {
            if (!store.ignoreLocalSet) {
              store._set(new_value)
            }
          })
        }
      }
    }

    function get() {
      return value
    }

    function _set(new_value) {
      if (!new_value) {
        debug('GOT NULL OR UNDEFINED new_value in _set() function')
      }
      if (safe_not_equal(value, new_value)) {
        value = new_value
        if (stop) { // store is ready
          const run_queue = !subscriber_queue.length
          for (let i = 0; i < subscribers.length; i += 1) {
            const s = subscribers[i]
            s[1]()
            subscriber_queue.push(s, value)
          }
          if (run_queue) {
            for (let i = 0; i < subscriber_queue.length; i += 2) {
              subscriber_queue[i][0](subscriber_queue[i + 1])
            }
            subscriber_queue.length = 0
          }
        }
      }
    }
  
    function update(fn) {
      set(fn(value))
    }
  
    function subscribe(run, invalidate = noop) {
      const subscriber = [run, invalidate]
      subscribers.push(subscriber)
      if (subscribers.length === 1) {
        stop = start(set) || noop
      }

      if (!value) {
        value = default_value
      }

      if (client.socket) {
        // emitInitialize()
        client.socket.emit('initialize', storeID, value, (value) => {
          run(value)
        })
      } else {
        run(value)
      }
      
      return () => {
        const index = subscribers.indexOf(subscriber)
        if (index !== -1) {
          subscribers.splice(index, 1)
        }
        if (subscribers.length === 0) {
          stop()
          stop = null
        }
      }
    }
  
    if (component) {
      client.components[storeID] = component
    }
    if (!client.stores[storeID]) {
      client.stores[storeID] = []
    }
    client.stores[storeID].push({get, set, _set, update, subscribe, forceEmitBack, ignoreLocalSet})
    return {get, set, update, subscribe}
  }

}

Client.DEFAULT_NAMESPACE = '/svelte-realtime'

function getClient(namespace) {
  if (!client) {
    client = new Client(namespace)
  }
  return client
}

let client

module.exports = {getClient}  // TODO: Eventually change this to export once supported
