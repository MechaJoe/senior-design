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

// Get profile for the currenctly logged-in user
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

// Get profile for a given user
// TODO: distinguish between Students and Instructors
router.get('/users/:username', async (req, res) => {
  const { username } = req.params
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
    `SELECT Class.classCode, className
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
    `SELECT Assignment.assignmentId, Assignment.deadline
    FROM Assignment JOIN Class ON Assignment.classCode = Class.classCode
    WHERE Assignment.classCode = '${classCode}';`,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        // res.json({ results })
        res.json(results)
      }
    },
  )
})

// GETs instructors (className, email address, first name, last name) for a class
router.get('/class/:classCode/instructor', async (req, res) => {
  const { classCode } = req.params
  connection.query(
    `SELECT Class.className, Instructor.username, Instructor.firstName, Instructor.lastName, Instructor.username
    FROM InstructorOf JOIN Class ON InstructorOf.classCode = Class.classCode JOIN Instructor ON InstructorOf.username = Instructor.username
    WHERE InstructorOf.classCode = '${classCode}';`,
    (error, results) => {
      if (error) {
        res.json(error)
      } else if (results) {
        res.json(results)
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
router.post('/user', async (req, res) => {
  const {
    emailAddress, username, firstName, lastName, profileImageUrl, year, majors, school,
  } = req.body
  req.session.isInstructor = false // TODO: delete hardcoding
  const schools = school.join(',')
  const majorsString = majors.join(',')
  if (!req.session.isInstructor) {
    connection.query(
      `INSERT INTO Student (emailAddress, username, firstName, lastName, profileImageUrl, year, majors, schools)
      VALUES ('${emailAddress}', '${username}', '${firstName}', '${lastName}', '${profileImageUrl}', '${year}', '${majorsString}', '${schools}');
      `,
      (error, results) => {
        if (error) {
          res.json({ error })
        } else if (results) {
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

// [POST] update profile for a user
router.post('/profile/edit', async (req, res) => {
  const {
    emailAddress, firstName, lastName, year, profileImageUrl, majors, school,
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
      // TODO: Change these fields based on what to edit
      `UPDATE Student
SET profileImageUrl = '${profileImageUrl}', majors= '${majors}'
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

router.get('/class/:classCode/assignments/:assignmentId/groupSize', async (req, res) => {
  const { classCode, assignmentId } = req.params
  connection.query(
    `SELECT minGroupSize, maxGroupSize
    FROM Assignment
    WHERE classCode = '${classCode}' AND assignmentId = '${assignmentId}';`,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        console.log(results)
        res.json(results[0])
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
    FROM GroupAss
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

// GET metadata for a particular group
router.get('/class/:classCode/assignments/:assignmentId/group/:groupId', async (req, res) => {
  const { classCode, assignmentId, groupId } = req.params
  connection.query(
    `SELECT *
    FROM GroupAss
    WHERE groupId = '${groupId}' AND assignmentId = '${assignmentId}' AND classCode = '${classCode}';`,
    (error, results) => {
      if (error) {
        res.json(error)
        console.log(error)
      } else if (results) {
        res.json(results)
        console.log(results)
      }
    },
  )
})

// [GET] the group members for the group that the user belongs to
router.get(
  '/class/:classCode/assignments/:assignmentId/my-group-info',
  async (req, res) => {
    // const { classCode, assignmentId } = req.params
    // const { username } = req.session
    const username = 'jasonhom'
    const classCode = 'CIS 4000'
    const assignmentId = 2
    connection.query(
      `With GId AS (SELECT groupId FROM BelongsToGroup WHERE username = '${username}'
      AND assignmentId = '${assignmentId}'
      AND classCode = '${classCode}'),
     GroupMembers AS (
         SELECT username, assignmentId
         FROM BelongsToGroup
         WHERE groupId IN (SELECT * FROM GId)
     )
 SELECT firstName, lastName, assignmentId
 From GroupMembers JOIN Student ON GroupMembers.username = Student.username;`,
      (error, results) => {
        if (error) {
          res.json({ error })
        } else if (results) {
          console.log(results)
          res.json(results)
        }
      },
    )
  },
)

// [GET] the group ID the user belongs to
router.get('/class/:classCode/assignments/:assignmentId/my-group', async (req, res) => {
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
        res.json(results)
      }
    },
  )
})

// [GET] the members of a group
router.get('/class/:classCode/assignments/:assignmentId/group/:groupId/members', async (req, res) => {
  const { classCode, assignmentId, groupId } = req.params
  connection.query(
    `SELECT S.username, emailAddress, firstName, lastName, year, profileImageUrl, majors, schools
      FROM BelongsToGroup
      JOIN GroupAss ON GroupAss.classCode = BelongsToGroup.classCode
        AND BelongsToGroup.groupId = GroupAss.groupId
        AND BelongsToGroup.assignmentId = GroupAss.assignmentId
      JOIN Student S on BelongsToGroup.username = S.username
      WHERE GroupAss.classCode = '${classCode}'
        AND GroupAss.assignmentId = '${assignmentId}'
        AND GroupAss.groupId = '${groupId}';
    `,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json(results)
      }
    },
  )
})

module.exports = router
