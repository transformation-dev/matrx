/*
We wanted to provide an API endpoint to enable integration without requiring all
API clients to use socket.io. This is required if we use Azure Functions to update
materialized views. In theory, I guess it could be possible to have an Azure Function
act as a socket.io client but I'm betting that we'll want the API endpoints anyway.

*/

class Coordinator {

  constructor(server, nsp, adapter, namespace) {
    this._namespace = namespace || Coordinator.DEFAULT_NAMESPACE
    this._server = server
    this._nsp = nsp
    this._adapter = adapter
    console.log('inside constructor of Coordinator')
  }

  async getEntity(_entityID) {
    // TODO: Check to see if there is a cachedValue in the room and return that ASAP (more latency compensation)
    const value = await this._adapter.getEntity(_entityID)  // TODO: Need a try-catch-throw here
    return value  // We should really return this from the API call even if it is fire and forget from the store so non-store API calls get something back
  }

  async operations(operationsSpec, socketSessionID) {
    console.log('inside coordinator.operations')
    // TODO: Check operationsSpec. Failing for some things. Defaulting for others

    // Server-side latency compensation means we broadcast the operation to everyone but 
    // the original sender as specified by socketID
    const socketLookup = namespace + '#' + socketSessionID
    const socket = nsp.sockets[socketLookup]
    for (let operation in operationsSpec) {
      // TODO: Check access control (cached?) before this latency compensation
      if (operation.operationType === 'delete') {

      } else {  // operationType is 'create' or 'update'
        const value = operation.new
        const _entityID = value._entityID
        const storeID = JSON.stringify({_entityID})
        const room = nsp.adapter.rooms[storeID]
        if (room) {
          room.cachedValue = value
          socket.to(storeID).emit('set', value)
        }
      }
    }

    // Call adapter.operations
    try {
      const result = await this._adapter.operations(operationsSpec)
      // TODO: Send "saved" event to component
    } catch { // If fail, send revert event to all subscribed
      for (let operation in operationsSpec) {
        if (operation.operationType === 'delete') {

        } else {  // operationType is 'create' or 'update'
          const value = operation.old
          const _entityID = value._entityID
          const storeID = JSON.stringify({_entityID})
          const room = nsp.adapter.rooms[storeID]
          if (room) {
            room.cachedValue = value
            this._nsp.in(storeID).emit('revert', value)  // TODO: Maybe we can just call emit() on the already fetched room?
          }
        }
      }
    }
  }

}

Coordinator.DEFAULT_NAMESPACE = '/svelte-realtime'

function getCoordinator(server, nsp, adapter, namespace) {  // TODO: Allow authentication to be passed in to overide the default of getting it from environment variables
  if (! coordinator) {
    coordinator = new Coordinator()
  }
  return coordinator
}

let coordinator

module.exports = {getCoordinator}  // TODO: Eventually change this to export once supported