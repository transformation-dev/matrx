const sseConnections = new Map()  // {connectionID <string>: se <faye-websocket.EventSource>}
const sseSubscriptions = new Map()  // {subscriptionID <string>: connections[] <faye-websocket.EventSource>}

export {
  sseConnections,
  sseSubscriptions
}