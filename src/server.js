import sirv from 'sirv';
// import polka from 'polka'  // TODO: npm uninstall --save polka
import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'
import faye from 'faye'
import http from 'http'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const app = express()

const server = http.createServer(app)

const pubsub = new faye.NodeAdapter({mount: '/pubsub', timeout: 45})
pubsub.attach(server)

app.use(
	compression({ threshold: 0 }),
	sirv('static', { dev }),
	sapper.middleware()
)

server.listen(PORT, err => {
	if (err) console.log('error', err);
})
