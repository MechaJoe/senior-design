const express = require('express')
const mysql = require('mysql2')
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

// Get profile for a user
// TODO: distinguish between Students and Instructors
router.get('/users', async (req, res) => {
  const { username } = req.session
  connection.query(`SELECT * FROM Student
  WHERE username = '${username}';
   `, (error, results) => {
    if (error) {
      res.json({ error })
    } else if (results) {
      res.json({ results })
    }
  })
})

// GETs all classes that a user is in
router.get('/user/:username/classes', async (req, res) => {
  const { username } = req.params
  connection.query(
    `SELECT classCode, className
     FROM StudentOf JOIN Class ON StudentOf.classCode = Class.classCode
     WHERE username = '${username}';`,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json({ results })
      }
    },
  )
})

// GETs a class (all assignments)
router.get('/class/:classCode/assignments', async (req, res) => {
  const { classCode } = req.params
  connection.query(
    `SELECT Class.className, Assignment.assignmentId
    FROM Assignment JOIN Class ON Assignment.classCode = Class.classCode
    WHERE Assignment.classCode = '${classCode}';`,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json({ results })
      }
    },
  )
})

// GETs instructors (email address, first name, last name) for a class
router.get('/class/:classCode/instructor', async (req, res) => {
  const { classCode } = req.params
  connection.query(
    `SELECT Class.className, Instructor.emailAddress, Instructor.firstName, Instructor.lastName, Instructor.emailAddress
    FROM InstructorOf JOIN Class ON InstructorOf.classCode = Class.classCode JOIN Instructor ON InstructorOf.emailAddress = Instructor.emailAddress
    WHERE InstructorOf.classCode = '${classCode}';`,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json({ results })
      }
    },
  )
})

// GETs all students that are in a class
router.get('/class/:classCode/students', async (req, res) => {
  const { classCode } = req.params
  connection.query(
    `SELECT emailAddress
    FROM StudentOf
    WHERE StudentOf.classCode = '${classCode}';
    `,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json({ results })
      }
    },
  )
})

// GETs name of a class
router.get('/class/:classCode', async (req, res) => {
  const { classCode } = req.params
  connection.query(
    `SELECT className
    FROM Class
    WHERE classCode = '${classCode}';
    `,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json({ results })
      }
    },
  )
})

// More routes go here...
/* PROFILE ROUTES */

// POST creates profile for a user
router.post('/profile', async (req, res) => {
  const {
    emailAddress, username, firstName, lastName, year, majors, school,
  } = req.body
  if (req.session.isInstructor) {
    connection.query(
      `INSERT INTO Student (emailAddress, username, firstName, lastName, year, majors, school)
      VALUES ('${emailAddress}', '${username}', '${firstName}', '${lastName}', '${year}', '${majors}', '${school}');
      `,
      (error, results) => {
        if (error) {
          res.json({ error })
        } else if (results) {
          // res.json({ results })
          res.json('success')
        }
      },
    )
  } else {
    connection.query(
      `INSERT INTO Instructor (emailAddress, username, firstName, lastName, profileImageUrl)
      VALUES ('${emailAddress}', '${username}', '${firstName}', '${lastName}', '${profileImageUrl}');
      `,
      (error, results) => {
        if (error) {
          res.json({ error })
        } else if (results) {
          // res.json({ results })
          res.json('success')
        }
      },
    )
  }
})

// [GET] profile for a user
router.get('/users/:user', async (req, res) => {
  const { username } = req.params
  if (req.session.isInstructor) {
    connection.query(
      `SELECT * 
      FROM Student WHERE username = '${username}';
      `,
      (error, results) => {
        if (error) {
          res.json({ error })
        } else if (results) {
          res.json({ results })
        }
      },
    )
  } else {
    connection.query(
      `SELECT * 
      FROM Instructor WHERE username = '${username}';
      `,
      (error, results) => {
        if (error) {
          res.json({ error })
        } else if (results) {
          res.json({ results })
        }
      },
    )
  }
})

// [PUT] update profile for a user
router.post('/profile/edit', async (req, res) => {
  const {
    emailAddress, username, firstName, lastName, year, profileImageUrl, majors, school,
  } = req.body
  if (!req.session.isInstructor) {
    connection.query(
      `UPDATE Instructor
SET profileImageUrl = '${profileImageUrl}', firstName= '${firstName}' // change based 
on what to edit
WHERE emailAddress = '${emailAddress}';`,
      (error, results) => {
        if (error) {
          res.json({ error })
        } else if (results) {
          res.json({ results })
        }
      },
    )
  } else {
    connection.query(
      `UPDATE Student
SET profileImageUrl = '${profileImageUrl}', majors= '${majors}' // change based 
  on what to edit
WHERE emailAddress = '${emailAddress}';`,
      (error, results) => {
        if (error) {
          res.json({ error })
        } else if (results) {
          res.json({ results })
        }
      },
    )
  }
})

/* ASSIGNMENT ROUTES */

// POST new assignment
router.post('/class/:classCode/assignment', async (req, res) => {
  const { classCode } = req.params
  const {
    deadline, maxGroupSize, minGroupSize, numGroups,
  } = req.body
  connection.query(
    `INSERT INTO Assignment (assignmentId, classCode, deadline, maxGroupSize, minGroupSize, numGroups) 
    VALUES ('${classCode}', '${deadline}', '${maxGroupSize}', '${minGroupSize}', '${numGroups}');    
    `,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json({ results })
      }
    },
  )
})

// GET attributes for a specific assignment
router.get('/class/:classCode/assignment/:assignmentId', async (req, res) => {
  const { classCode, assignmentId } = req.params
  connection.query(
    `SELECT * 
    FROM Assignment
    WHERE assignmentId = '${assignmentId}' AND classCode = '${classCode}';
    `,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json({ results })
      }
    },
  )
})

// PUT edit the attributes for a specific assignment
router.put('/class/:classCode/assignments/:assignmentId', async (req, res) => {
  const { classCode, assignmentId } = req.params
  const {
    deadline, maxGroupSize, minGroupSize, numGroups,
  } = req.body
  connection.query(
    `UPDATE Assignment
    SET deadline = '${deadline}', numGroups= '${numGroups}', maxGroupSize = '${maxGroupSize}', minGroupSize = '${minGroupSize}'
    WHERE classCode= '${classCode}' AND assignmentId = '${assignmentId};
    `,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json({ results })
      }
    },
  )
})

/* GROUP ROUTES */

// GET all the groups for a specific assignment
router.get('/class/:classCode/assignments/:assignmentId/groups', async (req, res) => {
  const { classCode, assignmentId } = req.params
  connection.query(
    `SELECT groupId
    FROM Group
    WHERE assignmentId = '${assignmentId}' AND 
    classCode = '${classCode}';
    `,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json({ results })
      }
    },
  )
})

// GET the group information for a particular group
router.get('/class/:classCode/assignments/:assignmentId/groups/:groupId', async (req, res) => {
  const { classCode, assignmentId, groupId } = req.params
  connection.query(
    `SELECT *
    FROM Group
    WHERE groupId = '${groupId}' AND assignmentId = '${assignmentId}' AND classCode = '${classCode}';  
    `,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json({ results })
      }
    },
  )
})

// [GET] the group the user belongs to
router.get('/class/:classCode/assignments/:assignmentId/groups/my-group', async (req, res) => {
  const { classCode, assignmentId } = req.params
  const { username } = req.session
  connection.query(
    `SELECT groupId FROM BelongsToGroup WHERE username = '${username}'
     AND assignmentId = '${assignmentId}' 
     AND classCode = '${classCode}';`,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json({ results })
      }
    },
  )
})
module.exports = router
