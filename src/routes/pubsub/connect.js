import {getPubsubServer} from '../_server-helpers'

function get(req, res, next) {
	getPubsubServer().connectGET(req, res, next)
}

export {get}