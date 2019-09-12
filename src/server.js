import http from 'http'
import sirv from 'sirv'
import express from 'express'
import socketIO from 'socket.io'
import compression from 'compression'
import * as sapper from '@sapper/server'
import uuidv4 from 'uuid/v4'
import helmet from 'helmet'
import bodyParser from 'body-parser'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const nsp = io.of('/svelte-realtime-store')  // TODO: Make this be configurable
const cachedValues = new Map()

nsp.on('connection', socket => {
	console.log('got socket.io connection event')
  socket.on('disconnect', () => { 
		console.log('got disconnect')
	})
	socket.on('join', (storeID, value) => {
		console.log('\non server got join event:', storeID, value)
		socket.join(storeID)
		const cachedValue = cachedValues.get(storeID)
		if (cachedValue) {
			value = cachedValue
		}
		socket.to(storeID).emit('set', value)
	})
	socket.on('set', (storeID, value) => {
		console.log('got set on server', storeID, value)
		cachedValues.set(storeID, value)  // TODO: Need to delete values when everyone is disconnected
		socket.to(storeID).emit('set', value)
	})
	socket.on('get', (storeID, value, default_value, callback) => {
		console.log('got get event on server', storeID, value, default_value, callback)
		const cachedValue = cachedValues.get(storeID)
		value = cachedValue || value || default_value
		return callback(value)
	})
})

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
