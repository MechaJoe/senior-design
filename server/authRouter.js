/* eslint-disable no-else-return */
const express = require('express')
const GoogleStrategy = require('passport-google-oidc')
const mysql = require('mysql2')
const passport = require('passport')
const querystring = require('node:querystring')
const config = require('./config.json')

const frontendServer = `http://${config.server_host}:${config.frontend_server_port}`

const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.RDS_HOST ? process.env.RDS_HOST : config.rds_host,
  user: process.env.RDS_USER ? process.env.RDS_USER : config.rds_user,
  password: process.env.RDS_PASSWORD ? process.env.RDS_PASSWORD : config.rds_password,
  port: process.env.RDS_PORT ? process.env.RDS_PORT : config.rds_port,
  database: process.env.RDS_DB ? process.env.RDS_DB : config.rds_db,
})

const router = express.Router()

router.post('/login', async (req, res) => {
  const { body } = req
  const { username, password } = body
  const sql = `SELECT password
  FROM User u
  WHERE u.username = '${username}'`
  connection.query(sql, (error, results) => {
    if (error) {
      res.json({ error })
    } else if (results) {
      if (results.length !== 0 && results[0].password === password) {
        req.session.username = username
        req.session.save()
        // console.log(req.session)
        res.send('Successful login')
      } else {
        res.send('Unsuccessful login')
      }
    }
  })
})

router.get('/username', (req, res) => {
  if (req.session.passport) {
    req.session.username = req.session.user
  }
  res.json(req.session.username)
})

router.get('/name', (req, res) => {
  const { username } = req.session
  const sql = `SELECT first_name, last_name FROM User WHERE username = '${username}'`
  connection.query(sql, (error, results) => {
    if (error) {
      res.json({ error })
    } else if (results) {
      res.json(results[0])
    } else {
      res.json({ error: 'No results' })
    }
  })
})

router.post('/logout', (req, res) => {
  req.logout()
  req.session.username = null
  res.send('Logged out')
})

const verify = async (issuer, profile, cb) => {
  const username = profile.emails[0].value.split('@')[0]
  connection.query(
    `SELECT * FROM Student WHERE username = '${username}'`,
    (error, results) => {
      if (error || !results || results.length === 0) {
        const newProfile = profile
        newProfile.create = true
        return cb(null, newProfile)
      } else {
        return cb(null, profile)
      }
    },
  )
}

router.get('/login/federated/google', passport.authenticate('google'))

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID : config.google_client_id,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
      ? process.env.GOOGLE_CLIENT_SECRET : config.google_client_secret,
    callbackURL: '/oauth2/redirect/google',
    scope: ['email', 'profile'],
  },
  verify,
))

router.get(
  '/oauth2/redirect/google',
  (req, res, next) => {
    passport.authenticate(
      'google',
      (err, user) => {
        if (user) {
          const username = user.emails[0].value.split('@')[0]
          if (user.create) {
            const query = querystring.stringify({
              emailAddress: user.emails[0].value,
              username,
              firstName: user.name.givenName,
              lastName: user.name.familyName,
            })
            return res.redirect(
              `${frontendServer}/signup?${query}`,
            )
          } else {
            req.session.username = username
            return res.redirect(`${frontendServer}/courses`)
          }
        } else {
          return res.redirect(`${frontendServer}/login`)
        }
      },
    )(req, res, next)
  },
)

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, { username: user.username })
  })
})

passport.deserializeUser((user, cb) => {
  process.nextTick(() => cb(null, user))
})

module.exports = router
