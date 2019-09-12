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

nsp.on('connection', socket => {
	console.log('got socket.io connection event')
  socket.on('event', data => { 
		console.log('got event', data)
	})
  socket.on('disconnect', () => { 
		console.log('got disconnect')
	})
	socket.on('join', room => {
		console.log('\non server got join event:', room)
		// socket.broadcast.emit('event', {
		// 	username: socket.username,
		// 	message: data
		// })
		socket.join(room)
	})
	socket.on('set', (id, value) => {
		console.log('got set on server', id, value)
		socket.to(id).emit('set', value)
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
