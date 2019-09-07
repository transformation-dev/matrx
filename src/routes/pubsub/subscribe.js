import {getPubsubServer} from '../_server-helpers'

function post(req, res, next) {
	getPubsubServer().subscribePOST(req, res, next)
}

export {post}