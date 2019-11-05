const http = require('http')
const serveStatic = require('serve-static')
const express = require('express')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const compression = require('compression')
const uuidv4 = require('uuid/v4')
const helmet = require('helmet')
const debug = require('debug')('matrx-server')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(
	function(username, password, done) {
    debug('LocalStrategy callback called.  username: %s', username)
		if (password === 'admin') {
			return done(null, {id: 1, name: username})
		} else {
			return done(null, false)
		}
	}
))

passport.serializeUser(function(user, cb) {
	cb(null, JSON.stringify(user))
})

passport.deserializeUser(function(packet, cb) {
	cb(null,JSON.parse(packet))
})

const {getServer} = require('@matrx/svelte-realtime-server')
const adapters = {
  // 'cosmos-db-temporal': require('@matrx/svelte-realtime-adapter-cosmos-db-temporal')
}

const PORT = process.env.PORT || 8080
const {NODE_ENV, SESSION_SECRET} = process.env
if (!SESSION_SECRET) throw new Error('Must set SESSION_SECRET environment variable')
const dev = NODE_ENV === 'development'

// function authenticate(socket, data, callback) {
//   const username = data.username
//   const password = data.password
//   const user = {hashedPassword: 'abc', salt: '123'}
//   function hash(password, salt) {
//     return 'abc'
//   }
//   if (!user) {
//     return callback(new Error('User not found'))
//   }
//   // if (err) return callback(err)
//   return callback(null, user.hashedPassword === hash(password, user.salt))
//   // return callback(null, false)
//   // db.findUser('User', {username:username}, function(err, user) {
//   //   if (err || !user) return callback(new Error("User not found"))
//   //   return callback(null, user.password == password)
//   // })
// }

const app = express()
const server = http.createServer(app)
const nsp = getServer(server, adapters)
// const nsp = getServer(server)  // TODO: Restore the above line with a real authenticate and adapters

app.use(require('express-session')({
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionID',
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },  // 30 days
}))
app.use(passport.initialize())
app.use(passport.session())

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

app.post('/login',
  jsonParser,
  function(req, res, next) {
    debug('Got POST to login.  req.body: %O', req.body)
    return next()
  },
  passport.authenticate('local'),
  function(req, res, next) {
    debug('login succeeded', req.user)
    res.status(200).send('login successful')
  }
)

server.listen(PORT, err => {
  if (err) {
    console.log('error', err)
  } else {
    console.log('server running on', PORT)
  }
})
