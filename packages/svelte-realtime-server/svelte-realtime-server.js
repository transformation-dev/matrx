// const crypto = require('crypto')
const socketIO = require('socket.io')
const socketIOAuth = require('socketio-auth')

const DEFAULT_NAMESPACE = '/svelte-realtime'

function getServer(server, adapters, authenticate, namespace = DEFAULT_NAMESPACE) {
  const io = socketIO(server)
  const nsp = io.of(namespace)
  const sessions = {}
  
  function postAuthenticate(socket) {  // TODO: How do we get the user into this function?
    // socket.on('disconnect', () => {})  // Since we're storing everything in the nsp's socket or room, we shouldn't need any additional cleanup

    // const user = {username: 'username'}
    // // const user = {username: 'username', sessionID: 'sessionID'}
    // if (! user.sessionID) {
    //   const sessionID = 'some GUID'  // TODO: Really generate a GUID
    //   sessions[sessionID] = user
    //   socket.emit('new-session', sessionID)
    // }

    socket.on('join', (stores) => {
      for (const {storeID, value} of stores) {
        socket.join(storeID)
        const room = nsp.adapter.rooms[storeID]
        if (room) {  // There should always be a room but better safe
          const cachedValue = room.cachedValue
          if (cachedValue) {
            socket.emit('set', storeID, cachedValue)
          } else {
            room.cachedValue = value
            socket.to(storeID).emit('set', storeID, value)
          }
        } else {
          throw new Error('Unexpected condition. There should be one but there is no room for storeID: ' + storeID)
        }
      }
    })

    socket.on('set', (storeID, value) => {
      let room = nsp.adapter.rooms[storeID]
      if (!room) {
        socket.join(storeID)
        room = nsp.adapter.rooms[storeID]
      }
      if (room) {  // There should always be a room now but better safe
        room.cachedValue = value
      } else {
        throw new Error('Unexpected condition. There should be one but there is no room for storeID: ' + storeID)
      }
      socket.to(storeID).emit('set', storeID, value)
    })
  }

  socketIOAuth(nsp, { authenticate, postAuthenticate })

  return nsp
}

module.exports = {getServer}  // TODO: Eventually change this to export once supported