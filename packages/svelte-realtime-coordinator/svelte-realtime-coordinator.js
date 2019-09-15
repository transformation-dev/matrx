class Coordinator {

  constructor(server, nsp, adapter, namespace) {
    this._namespace = namespace || Coordinator.DEFAULT_NAMESPACE
    console.log('inside constructor of Coordinator')
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