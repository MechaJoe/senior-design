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

router.get('/username', (req, res) => {
  if (req.session.passport) {
    req.session.username = [req.session.passport.user.emails[0].value.split('@')]
  }
  req.session.save()
  res.json(req.session.username)
})

router.post('/logout', (req, res) => {
  req.session.destroy()
  res.send('Logged out')
})

const verify = async (issuer, profile, cb) => {
  const username = profile.emails[0].value.split('@')[0]
  connection.query(
    `SELECT * FROM Student WHERE username = '${username}'`,
    async (error, results) => {
      if (error) { return cb(error) }
      if (!results || results.length === 0) {
        const [insResults] = await connection.promise().query(
          `SELECT * FROM Instructor WHERE username = '${username}'`,
        )
        if (insResults.length > 0) {
          const instructorProfile = { ...profile, instructor: true }
          return cb(null, instructorProfile)
        }
        const newProfile = profile
        newProfile.create = true
        return cb(null, newProfile)
      }
      return cb(null, profile)
    },
  )
}

router.get('/login/google', passport.authenticate('google'))

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
          }
          req.session.username = username
          req.session.instructor = user.instructor
          req.session.save()
          return res.redirect(`${frontendServer}/courses`)
        }
        return res.redirect(`${frontendServer}/login`)
      },
    )(req, res, next)
  },
)

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    // cb(null, { username: user.emails[0].value.split('@')[0] })
    cb(null, user)
  })
})

passport.deserializeUser((user, cb) => {
  process.nextTick(() => cb(null, user))
})

module.exports = router
