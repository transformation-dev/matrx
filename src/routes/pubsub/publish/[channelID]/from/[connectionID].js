import {getPubsubServer} from '../../../../_server-helpers'

function post(req, res, next) {
	getPubsubServer().publishPOST(req, res, next)
}

export {post}