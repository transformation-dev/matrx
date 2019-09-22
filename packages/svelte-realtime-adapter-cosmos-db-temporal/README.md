# `@matrx/svelte-realtime-adapter-cosmos-db`

svelte-realtime-adapter-cosmos-db is a database adapter for the [`svelte-realtime-coordinator`](https://www.npmjs.com/package/@matrx/svelte-realtime-coordinator). For a summary of how to use all of the svelte-realtime-... packages, go over to the [`svelte-realtime-store`](https://www.npmjs.com/package/@matrx/svelte-realtime-store).

## Usage

To install with npm

```bash
npm install --save @matrx/svelte-realtime-adapter-cosmos-db
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