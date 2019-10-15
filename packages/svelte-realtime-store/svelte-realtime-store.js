// const io = require('socket.io-client')  // This was not working with rollup for my SPA so I now load it from the server in my index.html

const {writable} = require('svelte/store')

// From svelte
const subscriber_queue = []
function noop() {}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function')
}

class Client { 

  constructor(namespace = Client.DEFAULT_NAMESPACE) {
    this._namespace = namespace
    this.connected = writable(false)
    this.authenticated = false
    this.socket = null
    this.stores = {}  // {storeID: store}
    this.components = {}  // {storeID: component}
  }

  afterAuthenticated(callback) {
    this.socket.on('new-session', (sessionID, username) => {
      window.localStorage.setItem('sessionID', sessionID)
      window.localStorage.setItem('username', username)
    })
    this.socket.on('set', (storeID, value) => {
      client.stores[storeID]._set(value)
    })
    this.socket.on('revert', (storeID, value) => {
      // TODO: Send "revert" event to component
      client.stores[storeID]._set(value)
    })
    this.socket.on('saved', (storeID) => {
      // TODO: Send "saved" event to component
    })
    const storesReshaped = []
    for (const storeID in client.stores) {
      storesReshaped.push({storeID, value: client.stores[storeID].get()})
    }
    this.socket.emit('join', storesReshaped)
    this.connected.set(true)
    this.authenticated = true
    callback(null)
  }

  login(credentials, callback) {  // TODO: Force a browser reload if the client changed
    this.socket = io(this._namespace)  // TODO: Confirm this works when we log out and back in again. The worry is that the page will have a handle to the old this.socket. As long as we redirect to the login page, we should be OK. We'll have to define the pattern on the page to sense when authenticated is changed. Maybe that's in _layout?
    this.socket.removeAllListeners()
    this.socket.on('connect', () => {
      this.socket.emit('authentication', credentials)
      this.socket.on('authenticated', () => {
        this.afterAuthenticated(callback)
      })
      this.socket.on('disconnect', () => {
        this.connected.set(false)
        this.authenticated = false  // When you are disconnected, you are automatically unauthenticated
        this.socket.removeAllListeners()  
        this.socket.on('reconnect', () => {
          this.login(credentials, callback)
        })
      })
      // this.socket.on('unathenticated', () => {  // Pretty sure we don't need this. When someone is being kicked out from the server, we'll just disconnect which will unauthenticate them
      //   this.authenticated = false
      // })
      this.socket.on('unauthorized', (err) => {  // This is for when there is an error
        this.authenticated = false
        this.connected.set(false)
        callback(new Error('unauthorized'))
      })
    })
  }

  restoreSession(callback) {
    const sessionID = window.localStorage.getItem('sessionID')
    const username = window.localStorage.getItem('username')
    if (sessionID) {
      this.login({sessionID, username}, callback)
    } else {
      callback(new Error('failed to restore session'))
    }
  }

  logout(callback) {
    const sessionID = window.localStorage.getItem('sessionID')
    window.localStorage.removeItem('sessionID')
    this.socket.emit('logout', sessionID)
    this.socket.removeAllListeners()
  }

  realtime(storeConfig, default_value, component = null, debounceDelay = 0, start = noop) {
    // TODO: Debounce changes such that we don't attempt the save until after debounceDelay
    const storeID = storeConfig.storeID || JSON.stringify(storeConfig)
    let value
    let stop
    const subscribers = []

    function set(new_value) {
      if (safe_not_equal(value, new_value)) {
        if (stop) { // store is ready
          client.socket.emit('set', storeID, new_value)
          _set(new_value)
        }
      }
    }

    function get() {
      return value
    }

    function _set(new_value) {
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
    client.stores[storeID] = {get, set, _set, update, subscribe}
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
