import sirv from 'sirv'
import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'
import faye from 'faye'
import http from 'http'
import uuidv4 from 'uuid/v4'
import helmet from 'helmet'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const app = express()

const server = http.createServer(app)

const pubsub = new faye.NodeAdapter({mount: '/pubsub', timeout: 45})
pubsub.attach(server)

app.use((req, res, next) => {
	res.locals.nonce = uuidv4()
	next()
})

app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			scriptSrc: [
				"'self'",
				// "'unsafe-eval'",
				(req, res) => `'nonce-${res.locals.nonce}'`
			]
		}
	}
}))

app.use(
	compression({ threshold: 0 }),
	sirv('static', { dev }),
	sapper.middleware()
)

server.listen(PORT, err => {
	if (err) console.log('error', err);
})
