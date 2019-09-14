const socketIO = require('socket.io')

const DEFAULT_NAMESPACE = '/svelte-realtime-store'

function getServer(server, namespace) {
  const io = socketIO(server)
  const nsp = io.of(namespace || DEFAULT_NAMESPACE)

  nsp.on('connection', socket => {
    // socket.on('disconnect', () => {})
    socket.on('join', (storeID, value) => {
      socket.join(storeID)
      const room = nsp.adapter.rooms[storeID]
      if (room) {
        const cachedValue = room.cachedValue
        if (cachedValue) {
          value = cachedValue
        }
      }
      socket.to(storeID).emit('set', value)
    })
    socket.on('set', (storeID, value) => {
      const room = nsp.adapter.rooms[storeID]
      if (room) {
        room.cachedValue = value
      }
      socket.to(storeID).emit('set', value)
    })
    socket.on('initialize', (storeID, value, callback) => {
      const room = nsp.adapter.rooms[storeID]
      if (room) {
        const cachedValue = room.cachedValue
        if (cachedValue) {
          value = cachedValue
        }
      }
      room.cachedValue = value
      return callback(value)
    })
  })

  return nsp
}

module.exports = {getServer}  // TODO: Eventually change this to export once supported