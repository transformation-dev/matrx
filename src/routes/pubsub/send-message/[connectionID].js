import {getPubsubServer} from '../../_server-helpers'

function post(req, res, next) {
	getPubsubServer().sendMessagePOST(req, res, next)
}

export {post}
