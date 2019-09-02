import {EventSource} from 'faye-websocket'

function get(req, res, next) {

	if (EventSource.isEventSource(req)) {
    let es = new EventSource(req, res);
    console.log('open', es.url, es.lastEventId);
    
    // Periodically send messages
    let loop = setInterval(function() { es.send(JSON.stringify({here: 'is my message'})) }, 1000);
    
    es.on('close', function() {
      clearInterval(loop);
      es = null;
    });
  
  } else {  // TODO: Throw some error and/or reply with an error
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('This endpoint is meant to be accessed from an EventSource');
	}
}

function post(req, res, next) {
	console.log(req.body)
	res.writeHead(200, {
		'Content-Type': 'application/json',
	});

	res.end(JSON.stringify(req.body));
}

export {get, post}