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

// Look here
import { getServer } from '@matrx/svelte-realtime-server'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const app = express()
const server = http.createServer(app)

// And here
const svelteRealtimeServer = getServer(server, adapters, sessionStore)
  
app.use(
	compression({ threshold: 0 }),
	sirv('static', { dev }),
)

server.listen(PORT, err => {
	if (err) console.log('error', err);
})

```

### Authentication

svelte-realtime-server now requiers a sessionID cookie to be present when the browser first connects. The `server.js` file in the parent folder is a fully working example of how you can do this complete with example /login, /logout, and /checkauth endpoints. At this time, we require you to pass in the sessionStore as the third parameter but this will later be upgraded to permit you to pass in your own callback functions. The second parameter, `adapters` is for the as-yet incomplete database serialization functionality and you can safely pass in `null` at this time.

### Access control

TBD