# `@matrx/svelte-realtime-server`

svelte-realtime-server is the server-side companion to the [`svelte-realtime-store`](https://www.npmjs.com/package/@matrx/svelte-realtime-store). Go over there for a summary of what it does, features, usage, limitations, etc.

## Usage

To install with npm

```bash
npm install --save @matrx/svelte-realtime-server
```

Modify your server.js file to look something like this

```js
import http from 'http'
import sirv from 'sirv'
import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'
import uuidv4 from 'uuid/v4'

// Look here
import { getServer } from '@matrx/svelte-realtime-server'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const app = express()
const server = http.createServer(app)

// And here
const nsp = getServer(server)
  
app.use(
	compression({ threshold: 0 }),
	sirv('static', { dev }),
	sapper.middleware()
)

server.listen(PORT, err => {
	if (err) console.log('error', err);
})

```