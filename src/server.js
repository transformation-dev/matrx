import sirv from 'sirv'
import express from 'express'
import http from 'http'
// import polka from 'polka'
import socketIO from 'socket.io'
import compression from 'compression'
import * as sapper from '@sapper/server'
import uuidv4 from 'uuid/v4'
import helmet from 'helmet'
import bodyParser from 'body-parser'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const server = http.createServer()
// const app = polka(server)
const app = express()
const io = socketIO(server)

io.on('connection', client => {
  client.on('event', data => { 
		console.log('got event', data)
	})
  client.on('disconnect', () => { 
		console.log('got disconnect')
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

app.listen(PORT, err => {
	if (err) console.log('error', err);
})
