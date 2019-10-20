const http = require('http')
const serveStatic = require('serve-static')
const express = require('express')
const compression = require('compression')
const uuidv4 = require('uuid/v4')
const helmet = require('helmet')

const {getServer} = require('@matrx/svelte-realtime-server')
const adapters = {
  'cosmos-db-temporal': require('@matrx/svelte-realtime-adapter-cosmos-db-temporal')
}

const PORT = process.env.PORT || 8080
const {NODE_ENV} = process.env
// const dev = NODE_ENV === 'development'

function authenticate(socket, data, callback) {
  const username = data.username
  const password = data.password
  const user = {hashedPassword: 'abc', salt: '123'}
  function hash(password, salt) {
    return 'abc'
  }
  if (!user) {
    return callback(new Error('User not found'))
  }
  // if (err) return callback(err)
  return callback(null, user.hashedPassword === hash(password, user.salt))
  // return callback(null, false)
  // db.findUser('User', {username:username}, function(err, user) {
  //   if (err || !user) return callback(new Error("User not found"))
  //   return callback(null, user.password == password)
  // })
}

const app = express()
const server = http.createServer(app)
// const nsp = getServer(server, adapters, authenticate)
const nsp = getServer(server)  // TODO: Restore the above line with a real authenticate and adapters
  
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

app.use(
  compression({threshold: 0}),
  serveStatic('dist')
)

server.listen(PORT, err => {
  if (err) {
    console.log('error', err)
  } else {
    console.log('server running on', PORT)
  }
})
