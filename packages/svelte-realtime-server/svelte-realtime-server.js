const socketIO = require('socket.io')

const DEFAULT_NAMESPACE = '/svelte-realtime-store'

function getServer(server, namespace) {
  const io = socketIO(server)
  const nsp = io.of(namespace || DEFAULT_NAMESPACE)
  const cachedValues = new Map()

  nsp.on('connection', socket => {
    console.log('got socket.io connection event')
    socket.on('disconnect', () => { 
      console.log('got disconnect')
    })
    socket.on('join', (storeID, value) => {
      console.log('\non server got join event:', storeID, value)
      socket.join(storeID)
      const cachedValue = cachedValues.get(storeID)
      if (cachedValue) {
        value = cachedValue
      }
      socket.to(storeID).emit('set', value)
    })
    socket.on('set', (storeID, value) => {
      console.log('got set on server', storeID, value)
      cachedValues.set(storeID, value)  // TODO: Need to delete values when everyone is disconnected
      socket.to(storeID).emit('set', value)
    })
    socket.on('initialize', (storeID, value, callback) => {
      console.log('got get event on server', storeID, value, callback)
      const cachedValue = cachedValues.get(storeID)
      value = cachedValue || value
      return callback(value)
    })
  })

  return nsp
}

module.exports = {getServer}  // TODO: Eventually change this to export once supported