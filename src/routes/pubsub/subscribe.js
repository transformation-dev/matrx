// TODO: Refactor so channelID is in the route like publish

import {getPubsubServer} from '../_server-helpers'

function post(req, res, next) {
	getPubsubServer().subscribePOST(req, res, next)
}

export {post}