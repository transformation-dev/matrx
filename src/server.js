const http = require('http')
const fs = require('fs')
const serveStatic = require('serve-static')
const express = require('express')
const jsonParser = express.json()
const compression = require('compression')
const uuidv4 = require('uuid/v4')
const helmet = require('helmet')
// const csrf = require('csurf')
// const cookieParser = require('cookie-parser')
const debug = require('debug')('matrx-server')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const expressSession = require('express-session')
const FileStore = require('session-file-store')(expressSession)

passport.use(new LocalStrategy(
	function(username, password, done) {
    debug('LocalStrategy callback called.  username: %s', username)
		if (password === 'admin') {
			return done(null, {id: 1, name: username})  // TODO: Upgrade this with the real information
		} else {
			return done(null, false)
		}
	}
))

passport.serializeUser(function(user, cb) {
  cb(null, user)  // TODO: Should probably just stick the userID into the session store
	// cb(null, JSON.stringify(user))
})

passport.deserializeUser(function(packet, cb) {
  // TODO: Lookup in database the user and return it instead of packet
  cb(null, packet)
	// cb(null, JSON.parse(packet))
})

const {getServer} = require('@matrx/svelte-realtime-server')
const adapters = {
  // 'cosmos-db-temporal': require('@matrx/svelte-realtime-adapter-cosmos-db-temporal')
}

const PORT = process.env.PORT || 8080
const {NODE_ENV, SESSION_SECRET, HOME} = process.env
if (!SESSION_SECRET) throw new Error('Must set SESSION_SECRET environment variable')
const dev = NODE_ENV === 'development'
const sessionPath = (HOME || '/home') + '/sessions'
if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath)
fs.chmodSync(sessionPath, 0o755)

const sessionStore = new FileStore({path: sessionPath})
const app = express()
const server = http.createServer(app)
const svelteRealtimeServer = getServer(server, adapters, sessionStore)

app.use(expressSession({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionID',
  store: sessionStore,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },  // 30 days
}))
app.use(passport.initialize())
app.use(passport.session())

// app.use(cookieParser())

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

// app.use(csrf({cookie: true}))

app.post('/login',
  function(req, res, next) {
    debug('Got POST to /login')
    return next()
  },
  jsonParser,
  function(req, res, next) {
    debug('Got POST to /login.  req.body: %O', req.body)
    return next()
  },
  passport.authenticate('local'),
  function(req, res, next) {
    debug('Login succeeded', req.user)
    return res.status(200).json({status: 'Login successful'})
  }
)

app.get('/checkauth',
  function isAuthenticated(req,res,next) {
    if (req.user) {
      return next()
    } else {
      return res.status(401).json({error: 'User not authenticated'})
    }
  }, 
  function(req, res){
   return res.status(200).json({status: 'Login successful'})
  }
)

app.get('/logout',
  function(req, res, next) {
    debug('Got GET to /logout.\nreq.user: %O\nreq.sessionID: %O', req.user, req.sessionID)
    req.session.destroy()
    svelteRealtimeServer.logout(req.sessionID)
    return res
      .status(401)
      .clearCookie('sessionID', {httpOnly: true})
      .json({status: 'Logout successful'})
  }
)

server.listen(PORT, err => {
  if (err) {
    console.log('error', err)
  } else {
    console.log('server running on', PORT)
  }
})
