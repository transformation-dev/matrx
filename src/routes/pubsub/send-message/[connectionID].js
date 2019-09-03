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

import { sseConnections } from '../../_server-helpers'

export function post(req, res, next) {
  sseConnections.get(req.params.connectionID).send(JSON.stringify(req.body))
}
