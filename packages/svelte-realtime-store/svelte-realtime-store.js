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
    this.socket.on('new-session', (sessionID, username) => {
      debug('new-session msg received. sessionID: %s  username: %s', sessionID, username)
      window.localStorage.setItem('sessionID', sessionID)
      window.localStorage.setItem('username', username)
    })
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

  login(credentials, callback) { 
    debug('login() called. credentials: %O', credentials)
    this.socket = io(this._namespace)  
    this.socket.removeAllListeners()
    this.socket.on('connect', () => {
      debug('connect msg received')
      this.socket.emit('authentication', credentials)
      this.socket.on('authenticated', () => {
        debug('authenticated msg received')
        this.afterAuthenticated(callback)
      })
      this.socket.on('disconnect', () => {
        debug('disconnect msg received')
        this.connected.set(false)
        this.socket.removeAllListeners()  
        this.socket.on('reconnect', () => {
          debug('reconnect msg received')
          this.login(credentials, callback)
        })
      })
      // this.socket.on('unauthenticated', () => {  // Pretty sure we don't need this. When someone is being kicked out from the server, we'll just disconnect which will unauthenticate them
      //   console.log('got unauthenticated')
      //   this.authenticated.set(false)
      //   // this.socket.disconnect()
      // })
      this.socket.on('unauthorized', (err) => {  // This is for when there is an error
        debug('unauthorized msg received. error: %s', err)
        this.connected.set(false)
        callback(new Error('unauthorized'))
      })
    })
  }

  restoreSession(callback, delay = 2) {
    const sessionID = window.localStorage.getItem('sessionID')
    const username = window.localStorage.getItem('username')
    debug('restoreSession() called. sessionID: %s  username: %s', sessionID, username)
    if (!sessionID) {
      debug('DELAY REQUIRED TO AVOID RACE CONDITION WITH SETTING THE NEW SESSION ID: %i', delay)
      if (delay < 10000) {
        return setTimeout(() => {
          return this.restoreSession(callback, delay*2)
        }, delay)
      }
    }
    if (sessionID) {
      this.login({sessionID, username}, callback)
    } else {
      callback(new Error('failed to restore session'))
    }
  }

  logout(callback) {
    const sessionID = window.localStorage.getItem('sessionID')
    debug('logout() called. sessionID: %s', sessionID)
    window.localStorage.removeItem('sessionID')
    client.socket.emit('logout', sessionID)
    if (callback) {
      return callback(null, true)
    }
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
      const sessionID = window.localStorage.getItem('sessionID')
      client.socket.emit('set', sessionID, storeID, lastNewValue, forceEmitBack)
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
      function emitInitialize(delay=2) {
        const sessionID = window.localStorage.getItem('sessionID')
        if (sessionID) {
          client.socket.emit('initialize', sessionID, storeID, value, (value) => {
            run(value)
          })
        } else if (delay < 10000) {
          debug('DELAY NEEDED FOR INITIALIZE TO AVOID RACE CONDITION WITH NEW-SESSION %i', delay)
          setTimeout(() => {
            emitInitialize(delay*2)
          }, delay)
        } else {
          throw new Error('sessionID missing event after delay of ' + delay + 'ms')
        }
      }
      const subscriber = [run, invalidate]
      subscribers.push(subscriber)
      if (subscribers.length === 1) {
        stop = start(set) || noop
      }

      if (!value) {
        value = default_value
      }

      if (client.socket) {
        emitInitialize()
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
