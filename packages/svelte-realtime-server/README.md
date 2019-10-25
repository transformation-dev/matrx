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
const nsp = getServer(server)
  
app.use(
	compression({ threshold: 0 }),
	sirv('static', { dev }),
)

server.listen(PORT, err => {
	if (err) console.log('error', err);
})

```

### Authentication

To ensure that your connecting clients are who they say they are, you can provide an authentication callback when instantiating the svelte-realtime-server.

```js
function authenticate(socket, credentials, callback) {
  db.findUser('User', {username: credentials.username}, function(err, user) {
    if (err || !user) return callback(new Error("User not found"))
    return callback(null, user.password == credentials.password)
  })
}

const nsp = getServer(server, null, authenticate)
```

Note, the second parameter (that is `null` in the above exmple) is for the future when you can provide database adapters.

### Access control

TBD