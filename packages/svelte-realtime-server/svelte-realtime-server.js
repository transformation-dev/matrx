const socketIO = require('socket.io')
const socketIOAuth = require('socketio-auth')

const DEFAULT_NAMESPACE = '/svelte-realtime'

function getServer(server, adapters, authenticate, namespace = DEFAULT_NAMESPACE) {
  const io = socketIO(server)
  const nsp = io.of(namespace)
  
  function postAuthenticate(socket) {
    // socket.on('disconnect', () => {})

    // socket.on('join', (storeID, value) => {
    //   socket.join(storeID)
    //   const room = nsp.adapter.rooms[storeID]
    //   if (room) {  // There should always be a room but better safe
    //     const cachedValue = room.cachedValue
    //     if (cachedValue) {
    //       value = cachedValue
    //       return socket.emit('set', storeID, value)
    //     } else {
    //       room.cachedValue = value
    //       return socket.to(storeID).emit('set', storeID, value)
    //     }
    //   }
    //   socket.to(storeID).emit('set', storeID, value)  // I don't think we need this but leaving it just in case
    // })

    socket.on('join', (storeIDs) => {
      for (const storeID of storeIDs) {
        socket.join(storeID)
      }
      return
      socket.join(storeID)
      const room = nsp.adapter.rooms[storeID]
      if (room) {  // There should always be a room but better safe
        const cachedValue = room.cachedValue
        if (cachedValue) {
          value = cachedValue
          return socket.emit('set', storeID, value)
        } else {
          room.cachedValue = value
          return socket.to(storeID).emit('set', storeID, value)
        }
      }
      socket.to(storeID).emit('set', storeID, value)  // I don't think we need this but leaving it just in case
    })


    socket.on('set', (storeID, value) => {
      console.log('got set for ', storeID)
      let room = nsp.adapter.rooms[storeID]
      if (!room) {
        socket.join(storeID)
        room = nsp.adapter.rooms[storeID]
      }
      if (room) {  // There should always be a room now according to above
        room.cachedValue = value
      }
      socket.to(storeID).emit('set', storeID, value)
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
  }

  socketIOAuth(nsp, { authenticate, postAuthenticate })

  return nsp
}

module.exports = {getServer}  // TODO: Eventually change this to export once supported