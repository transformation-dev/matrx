import http from 'http'
import sirv from 'sirv'
import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'
import uuidv4 from 'uuid/v4'
import helmet from 'helmet'
import bodyParser from 'body-parser'

import {getServer} from '@matrx/svelte-realtime-server'
const adapters = {
	'cosmos-db-temporal': require('@matrx/svelte-realtime-adapter-cosmos-db-temporal')
}

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

function authenticate(socket, data, callback) {
  var username = data.username
	var password = data.password
	const user = {hashedPassword: 'abc', salt: '123'}
	function hash(password, salt) {
		return 'abc'
	}
	if (!user) return callback(new Error('User not found'))
	if (err) return callback(err)
	return callback(null, user.hashedPassword === hash(password, user.salt))
  // db.findUser('User', {username:username}, function(err, user) {
  //   if (err || !user) return callback(new Error("User not found"))
  //   return callback(null, user.password == password)
  // })
}

function postAuthenticate(socket, data) {
  socket.client.username = data.username
}

const app = express()
const server = http.createServer(app)
const nsp = getServer(server, adapters, {authenticate, postAuthenticate})
  
app.use((req, res, next) => {
	res.locals.nonce = uuidv4()
	next()
})

app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			scriptSrc: [
				"'self'",
				"'unsafe-eval'",
				(req, res) => `'nonce-${res.locals.nonce}'`
			],
			objectSrc: ["'none'"],
			baseUri: ["'self'"]
		},
		browserSniff: false
	}
}))

app.use(bodyParser.json())
app.use(bodyParser.text())

app.use(
	compression({ threshold: 0 }),
	sirv('static', { dev }),
	sapper.middleware()
)

server.listen(PORT, err => {
	if (err) console.log('error', err);
})
