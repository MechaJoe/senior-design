const express = require('express')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')
require('https').globalAgent.options.rejectUnauthorized = false
const Router = require('./router')
const AuthRouter = require('./authRouter')
const config = require('./config.json')

const app = express()

// whitelist localhost 3000
app.use(cors({
  credentials: true,
  origin: true,
  exposedHeaders: ['set-cookie'],
}))

app.use(express.json())
app.use(session({
  name: 'session',
  secret: 'mySecret123',
  resave: false,
  unset: 'destroy',
  saveUninitialized: true,
  cookie: {
    maxAge: 360000,
    secure: false, // set to true for HTTPS
  },
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', AuthRouter)
app.use('/', Router)

app.listen(config.backend_server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.backend_server_port}/`)
})

module.exports = app
