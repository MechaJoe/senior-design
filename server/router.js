const express = require('express')
const mysql = require('mysql2')
const passport = require('passport')
const config = require('./config.json')

const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.RDS_HOST ? process.env.RDS_HOST : config.rds_host,
  user: process.env.RDS_USER ? process.env.RDS_USER : config.rds_user,
  password: process.env.RDS_PASSWORD ? process.env.RDS_PASSWORD : config.rds_password,
  port: process.env.RDS_PORT ? process.env.RDS_PORT : config.rds_port,
  database: process.env.RDS_DB ? process.env.RDS_DB : config.rds_db,
})

const router = express.Router()

/* USER ROUTES */
// Determines the top artists for a user relative to the songs that they have liked

// Get profile for a user
// TODO: distinguish between Students and Instructors
router.get('/users', async (req, res) => {
  const { emailAddress } = req.session
  connection.query(
  `SELECT * 
	FROM Student
	WHERE emailAddress = '${emailAddress}';
   `, (error, results) => {
    if (error) {
      res.json({ error })
    } else if (results) {
      res.json({ results })
    }
  })
})

// More routes go here...

module.exports = router