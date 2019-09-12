const io = require('socket.io-client')  // TODO: change this to import once it's no longer experimental in node.js

// From svelte
const subscriber_queue = []
function noop() {}
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function')
}

class Client { 

  constructor(namespace) {
    this._namespace = namespace || Client.DEFAULT_NAMESPACE
  }

  emit(...args) {
    this.socket.emit(...args)
  }

  realtime(storeID, default_value, start = noop) {
    let value
    let stop
    const subscribers = []

    const socket = io(this._namespace)

    socket.on('connect', function(){
      // Join rooms here. That way they'll be rejoined once reconnected
      console.log('socket.on("connect") value, default_value', value, default_value)
      socket.emit('join', storeID, value)
    })
    socket.on('set', function(value){
      console.log('socket.on("set") value, default_value', value, default_value)
      // console.log('got set event', value)
      _set(value)
    })
    socket.on('disconnect', function(msg){
      console.log('disconnected', msg)  // TODO: Update something on the screen to show you are offline
    })

    function set(new_value) {
      console.log('set(new_value) value, default_value, new_value', value, default_value, new_value)
      
      if (safe_not_equal(value, new_value)) {
        if (stop) { // store is ready
          socket.emit('set', storeID, new_value)
          _set(new_value)
        }
      }
    }

    function _set(new_value) {
      console.log('_set(new_value) value, default_value, new_value', value, default_value, new_value)
      
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

      // Fetch cached value from server before calling run()
      console.log('subscribe() value, default_value', value, default_value)
      if (! value) {
        value = default_value
      }
      socket.emit('get', storeID, value, default_value, (got_value) => {
        value = got_value
        run(value)
      })
      // run(value);
  
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

Client.DEFAULT_NAMESPACE = '/svelte-realtime-store'

function getClient(namespace) {
  if (! client) {
    client = new Client(namespace)
  }
  return client
}

let client

function getServer() {}

module.exports = {getClient, getServer}  // TODO: Eventually change this to export once supported