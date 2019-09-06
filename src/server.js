import sirv from 'sirv'
import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'
import uuidv4 from 'uuid/v4'
import helmet from 'helmet'
import bodyParser from 'body-parser'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const app = express()

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
