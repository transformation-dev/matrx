import http from 'http'
import sirv from 'sirv'
import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'
import uuidv4 from 'uuid/v4'
import helmet from 'helmet'
import bodyParser from 'body-parser'

import {getServer} from '@matrx/svelte-realtime-server'
import {getAdapter} from '@matrx/svelte-realtime-adapter-cosmos-db'
import {getCoordinator} from '@matrx/svelte-realtime-coordinator'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const app = express()
const server = http.createServer(app)
const adapter = getAdapter()
const nsp = getServer(server)
const coordinator = getCoordinator(server, nsp, adapter)
  
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
