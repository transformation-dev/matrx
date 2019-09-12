const io = require('socket.io-client')
const socket = io()



// From svelte
const subscriber_queue = []
function noop() {}
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function')
}

class Client { 

  constructor(namespace) {
    this._namespace = namespace || Client.DEFAULT_NAMESPACE

    socket.on('connect', function(e){
      // Join rooms here. That way they'll be rejoined once reconnected
      console.log('connected', e)
    })
    socket.on('event', function(data){
      console.log('web socket event', data)
    })
    socket.on('disconnect', function(e){
      console.log('disconnected', e)
    })
  }

  emit(...args) {
    socket.emit(...args)
  }

  realtime(id, value, start = noop) {
    let stop
    const subscribers = []

    function connect(){}
  
    function set(new_value) {
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
      run(value);
  
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

Client.DEFAULT_NAMESPACE = 'svelte-realtime-store'

function getClient(namespace) {
  if (! client) {
    client = new Client(namespace)
  }
  return client
}

let client

function getServer() {}

module.exports = {getClient, getServer}