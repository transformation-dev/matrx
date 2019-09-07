import {EventSource} from 'faye-websocket'

class PubsubServer {

  constructor() {
    this.sseConnections = new Map()  // Map(connectionID <string>: se <faye-websocket.EventSource>)
    this.sseSubscriptions = new Map()  // Map(subscriptionID <string>: Set(connectionID <string>))  
  }

  connectGET(req, res, next) {
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

      this.sseConnections.set(connectionID, es)
    
    } else {
      res.status(400).send('This endpoint is meant to be accessed from an EventSource')
    }
  }

  sendMessage(connectionID, message) {
    this.sseConnections.get(connectionID).send(JSON.stringify(message))
  }

  /**
   *	@example
   *	
   *	import urlComposer from 'url-composer'
   *	
   *	const url = urlComposer.build({
   *		path: 'pubsub/send-message/:connectionID', 
   *		params: {connectionID},
   *	})
   *	const res = fetch(url, {
   *		method: 'POST',
   *		body: JSON.stringify({msg: 'from the server-sent event'}),
   *		headers:{
   *			'Content-Type': 'application/json',
   *		},
   *	})
   */
  sendMessagePOST(req, res, next) {
    this.sendMessage(req.params.connectionID, req.body)
    if (false) {  // TODO: Base status on results of .send()
      return next(err)
    } else {
      return res.status(200).end()
    }
  }

  subscribePOST(req, res, next) {
    const {connectionID, channelID} = req.body
    if (Object.entries(req.body).length === 0) {
      return res.status(400).send('Missing body') 
    } else if (!connectionID) { 
      return res.status(400).send('Body missing connectionID')
    } else if (!channelID) { 
      return res.status(400).send('Body missing channelID')
    } else {
      let subscriptionSet = this.sseSubscriptions.get(channelID)
      if (! subscriptionSet) {
        subscriptionSet = new Set()
      }
      subscriptionSet.add(connectionID)
      this.sseSubscriptions.set(channelID, subscriptionSet)
      return res.status(200).end()
    }
  }

  publish(channelID, message, fromConnectionID) {
    console.log('inside publish. fromConnectionID', fromConnectionID)
    console.log('channelID', channelID)
    if (fromConnectionID) {
      for (let connectionID of this.sseSubscriptions.get(channelID)) {
        console.log(connectionID, fromConnectionID)
        if (fromConnectionID !== connectionID) {
          console.log('not the same')
          this.sendMessage(connectionID, message)
        }
      }
    } else {
      for (let connectionID of this.sseSubscriptions.get(channelID)) {
        this.sendMessage(connectionID, message)
      }
    }
  }

  /**
   *	@example
   *	
   *	import urlComposer from 'url-composer'
   *	
   *	const url = urlComposer.build({
   *		path: 'pubsub/publish/:channelID', 
   *		params: {channelID},
   *	})
   *	const res = fetch(url, {
   *		method: 'POST',
   *		body: JSON.stringify({msg: 'from publish'}),
   *		headers:{
   *			'Content-Type': 'application/json',
   *		},
   *	})
   */
  publishPOST(req, res, next) {
    this.publish(req.params.channelID, req.body, req.params.connectionID)
    if (false) {  // TODO: Base status on results of .send()
      return next(err)
    } else {
      return res.status(200).end()
    }
  }

}

function getPubsubServer() {
  return pubsubServer
}

const pubsubServer = new PubsubServer()

export {
  getPubsubServer
}