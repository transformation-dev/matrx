import {EventSource} from 'faye-websocket'

import {sseConnections} from '../_server-helpers'

function get(req, res, next) {
	// TODO: Use Cosmos DB's _ts value as EventSource.lastEventID

	if (EventSource.isEventSource(req)) {
		const {connectionID} = req.query
	
    let es = new EventSource(req, res, {
			ping:    15,
			retry:   10
		})

		es.on('open', (data) => {
    	console.log('Got "open" event inside connect.js.')
		})

    // Periodically send messages
    // let loop = setInterval(function() { 
		// 	es.send(JSON.stringify({here: 'is my message'})) 
		// }, 10000)
    
    es.on('close', function() {
			// clearInterval(loop)
			console.log('got close event')
			// TODO: Remove from sseSubscriptions and sseConnections before closing
      es = null
		})

		sseConnections.set(connectionID, es)
  
  } else {
    res.status(400).send('This endpoint is meant to be accessed from an EventSource')
	}
}

export {get}