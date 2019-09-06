import {sseSubscriptions} from '../_server-helpers'

function post(req, res, next) {
  const {connectionID, channelID} = req.body
	if (Object.entries(req.body).length === 0) {
    return res.status(400).send('Missing body') 
  } else if (!connectionID) { 
    return res.status(400).send('Body missing connectionID')
	} else if (!channelID) { 
    return res.status(400).send('Body missing channelID')
  } else {
    let subscriptionSet = sseSubscriptions.get(channelID)
    if (! subscriptionSet) {
      subscriptionSet = new Set()
    }
    subscriptionSet.add(connectionID)
    sseSubscriptions.set(channelID, subscriptionSet)
    return res.status(200).end()
  }
}

export {post}