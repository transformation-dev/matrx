const io = require('socket.io-client')  // TODO: change this to import once it's no longer experimental in node.js
const { writable, readable } = require('svelte/store')

// From svelte
const subscriber_queue = []
function noop() {}
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function')
}

class Client { 

  constructor(namespace = Client.DEFAULT_NAMESPACE) {
    this._namespace = namespace
    this.credentials = {}
    this.connected = writable(false)
    this.authenticated = false
    // this.socket = {emit: function(){console.log('got emit')}}
    this.socket = null
    this.stores = {}
  }

  login(credentials, callback) {
    if (credentials) this.credentials = credentials  // This is an if in case we call this later
    this.socket = io(this._namespace)  // TODO: Confirm this works when we log out and back in again. The worry is that the page will have a handle to the old this.socket. As long as we redirect to the login page, we should be OK. We'll have to define the pattern on the page to sense when authenticated is changed. Maybe that's in _layout?
    this.socket.on('connect',() => {
      this.connected.set(true)
      this.socket.emit('authentication', this.credentials)
      this.socket.on('authenticated', () => {
        console.log('authenticated inside of login()!!!')

        this.socket.on('set', function(storeID, value){
          client.stores[storeID]._set(value)
        })

        this.socket.emit('join', Object.keys(this.stores))

        // for (const storeID in this.stores) {
        //   console.log(storeID, this.stores[storeID])
        //   // Join rooms here. That way they'll be rejoined once reconnected
        //   this.socket.emit('join', storeID)
        //   this.socket.on('set', function(value){
        //     client.stores[storeID]._set(value)
        //   })
        // }
        this.authenticated = true
        callback(null)
      })
      this.socket.on('disconnect', () => {
        this.connected.set(false)
        this.authenticated = false  // When you are disconnected, you are automatically unauthenticated
      })
      // this.socket.on('unathenticated', () => {  // Not sure this is needed. When someone is being kicked out from the server, we'll just disconnect which will unauthenticate them
      //   this.authenticated = false
      // })
      this.socket.on('unauthorized', (err) => {  // This is for when there is an error
        console.log(err.message)
        callback(new Error('unauthorized'))
      })
    })
  }

  realtime(storeConfig, default_value, component = null, debounceDelay = 0, start = noop) {
    // TODO: Debounce changes such that we don't attempt the save until after debounceDelay
    const storeID = storeConfig.storeID || JSON.stringify(storeConfig)
    let value
    let stop
    const subscribers = []

    client.stores[storeID] = this

    function set(new_value) {
      if (safe_not_equal(value, new_value)) {
        if (stop) { // store is ready
          client.socket.emit('set', storeID, new_value)
          _set(new_value)
        }
      }
    }

    function _set(new_value) {
      if (safe_not_equal(value, new_value)) {
        value = new_value;
        if (stop) { // store is ready
          const run_queue = !subscriber_queue.length;
          for (let i = 0; i < subscribers.length; i += 1) {
            const s = subscribers[i];
            s[1]();
            subscriber_queue.push(s, value);
          }
          if (run_queue) {
            for (let i = 0; i < subscriber_queue.length; i += 2) {
              subscriber_queue[i][0](subscriber_queue[i + 1]);
            }
            subscriber_queue.length = 0;
          }
        }
      }
    }
  
    function update(fn) {
      set(fn(value))
    }
  
    function subscribe(run, invalidate = noop) {
      const subscriber = [run, invalidate];
      subscribers.push(subscriber);
      if (subscribers.length === 1) {
        stop = start(set) || noop;
      }

      if (! value) {
        value = default_value
      }

      // Fetch cached value from server before calling run()
      // socket.emit('initialize', storeID, value, (got_value) => {  // TODO: What should we do if this callback is never called?
      //   value = got_value
      //   run(value)
      // })
      run(value)
  
      return () => {
        const index = subscribers.indexOf(subscriber);
        if (index !== -1) {
          subscribers.splice(index, 1);
        }
        if (subscribers.length === 0) {
          stop();
          stop = null;
        }
      };
    }
  
    client.stores[storeID] = { set, _set, update, subscribe }
    return { set, update, subscribe }
  }

  realtimeEntitySaver(_entityID, default_value, component = null, debounceDelay = 0, start = noop) {
    // TODO: Debounce changes such that we don't attempt the save until after debounceDelay
    const storeID = JSON.stringify({_entityID})
    let value
    let stop
    const subscribers = []

    const socket = io(this._namespace)

    socket.on('connect', function(){
      // Join rooms here. That way they'll be rejoined once reconnected
      socket.emit('join', storeID, value)
    })
    socket.on('set', function(value){
      _set(value)
    })
    socket.on('revert', function(value){
      // TODO: Send "revert" event to component
      _set(value)
    })
    socket.on('saved', function(){
      // TODO: Send "saved" event to component
    })

    function set(new_value) {
      if (safe_not_equal(value, new_value)) {
        if (stop) { // store is ready
          _set(new_value)  // Latency compensation
          // The below POST can be fire and forget because there will be "revert" and "saved" events that come back down later
          // TODO: Compose this POST to the operations endpoint. Send socket.sessionid.
          // fetch()  // TODO: Add delay with setInterval or rather the other Javascript function to delay execution          
        }
      }
    }

    function _set(new_value) {
      if (safe_not_equal(value, new_value)) {
        value = new_value;
        if (stop) { // store is ready
          const run_queue = !subscriber_queue.length;
          for (let i = 0; i < subscribers.length; i += 1) {
            const s = subscribers[i];
            s[1]();
            subscriber_queue.push(s, value);
          }
          if (run_queue) {
            for (let i = 0; i < subscriber_queue.length; i += 2) {
              subscriber_queue[i][0](subscriber_queue[i + 1]);
            }
            subscriber_queue.length = 0;
          }
        }
      }
    }
  
    function update(fn) {
      set(fn(value))
    }
  
    function subscribe(run, invalidate = noop) {
      const subscriber = [run, invalidate];
      subscribers.push(subscriber);
      if (subscribers.length === 1) {
        stop = start(set) || noop;
      }

      // The below is left over from the realtime store. I don't think we need it here. Better for it to stay null or undefined until the initial fetch
      // if (! value) {
      //   value = default_value
      // }

      // Fetch cached value from server before calling run()
      socket.emit('initialize', storeID, value, (got_value) => {  // TODO: What should we do if this callback is never called?
        value = got_value
        run(value)  // TODO: Confirm that value stays undefined until fetch. This should only be non-null if it's already cached
        // This POST is fire and forget since the set event will come down over web-sockets
        // fetch(_entityID, default_value)  // TODO: Compose this fetch
      })
  
      return () => {
        const index = subscribers.indexOf(subscriber);
        if (index !== -1) {
          subscribers.splice(index, 1);
        }
        if (subscribers.length === 0) {
          stop();
          stop = null;
        }
      };
    }
  
    return { set, update, subscribe };
  }

}

Client.DEFAULT_NAMESPACE = '/svelte-realtime'

function getClient(namespace) {
  if (! client) {
    client = new Client(namespace)
  }
  return client
}

let client

module.exports = {getClient}  // TODO: Eventually change this to export once supported