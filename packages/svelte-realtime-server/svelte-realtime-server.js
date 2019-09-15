const socketIO = require('socket.io')

const DEFAULT_NAMESPACE = '/svelte-realtime'

function getServer(server, namespace) {
  const io = socketIO(server)
  const nsp = io.of(namespace || DEFAULT_NAMESPACE)

  nsp.on('connection', socket => {
    // socket.on('disconnect', () => {})
    socket.on('join', (storeID, value) => {
      socket.join(storeID)
      const room = nsp.adapter.rooms[storeID]
      if (room) {  // There should always be a room but better safe
        const cachedValue = room.cachedValue
        if (cachedValue) {
          value = cachedValue
          return socket.emit('set', value)
        } else {
          room.cachedValue = value
          return socket.to(storeID).emit('set', value)
        }
      }
      socket.to(storeID).emit('set', value)  // I don't think we need this but leaving it just in case
    })
    socket.on('set', (storeID, value) => {
      let room = nsp.adapter.rooms[storeID]
      if (!room) {
        socket.join(storeID)
        room = nsp.adapter.rooms[storeID]
      }
      if (room) {  // There should always be a room now according to above
        room.cachedValue = value
      }
      socket.to(storeID).emit('set', value)
    })
    socket.on('initialize', (storeID, value, callback) => {
      let room = nsp.adapter.rooms[storeID]
      if (!room) {
        socket.join(storeID)
        room = nsp.adapter.rooms[storeID]
      }
      if (room) {  // There should always be a room here now
        const cachedValue = room.cachedValue
        if (cachedValue) {
          value = cachedValue
        } else {
          room.cachedValue = value
        }
      }
      return callback(value)
    })
  })

  return nsp
}

module.exports = {getServer}  // TODO: Eventually change this to export once supported