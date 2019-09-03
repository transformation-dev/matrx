import {EventSource} from 'faye-websocket'

import {sseConnections} from '../_server-helpers'

function get(req, res, next) {
	// TODO: Use Cosmos DB's _ts value as EventSource.lastEventID
	console.log('query from inside connect.js', req.query)

	if (EventSource.isEventSource(req)) {
    let es = new EventSource(req, res, {
			ping:    20,
			retry:   15
		})

		es.on('open', (data) => {
    	console.log('Got "open" event inside connect.js.')
		})

    // Periodically send messages
    // let loop = setInterval(function() { es.send(JSON.stringify({here: 'is my message'})) }, 1000);
    
    es.on('close', function() {
      // clearInterval(loop)
      es = null
		})
		
		sseConnections.set(req.query.connectionID, es)
  
  } else {
    res.writeHead(400, {'Content-Type': 'text/plain'})
    res.end('This endpoint is meant to be accessed from an EventSource')
	}
}

export {get}