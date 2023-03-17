const express = require('express')
const mysql = require('mysql2')
const { v4: uuidv4 } = require('uuid')
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

// GETs all classes that a logged-in user is in
router.get('/user/classes', async (req, res) => {
  const { username } = req.session
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

// GETs all students in a class without a group
router.get('/class/:classCode/assignments/:assignmentId/no-group', async (req, res) => {
  const { classCode, assignmentId } = req.params
  connection.query(
    `WITH all_students AS (
      SELECT Student.username FROM Student JOIN StudentOf ON StudentOf.username = Student.username
      WHERE StudentOf.classCode = '${classCode}'
    )
    SELECT all_students.username, emailAddress, firstName, lastName, year, profileImageUrl, majors, schools FROM all_students JOIN Student ON all_students.username = Student.username
      WHERE all_students.username NOT IN (
        SELECT all_students.username FROM all_students JOIN BelongsToGroup ON all_students.username = BelongsToGroup.username
        WHERE assignmentId = '${assignmentId}'
      );
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

// GETs all students in a class in any group
router.get('/class/:classCode/assignments/:assignmentId/grouped', async (req, res) => {
  const { classCode, assignmentId } = req.params
  connection.query(
    `WITH all_students AS (
      SELECT Student.username FROM Student JOIN StudentOf ON StudentOf.username = Student.username
      WHERE StudentOf.classCode = '${classCode}'
    )
      SELECT all_students.username, emailAddress, firstName, lastName, year, profileImageUrl, majors, schools FROM all_students
          JOIN Student ON all_students.username = Student.username
          JOIN BelongsToGroup ON BelongsToGroup.username = all_students.username
      WHERE assignmentId = '${assignmentId}';
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
    emailAddress, username, firstName, lastName, profileImageUrl, year, majors, school,
  } = req.body
  req.session.isInstructor = false // TODO: delete hardcoding
  const schools = school.join(',')
  const majorsString = majors.join(',')
  if (!req.session.isInstructor) {
    connection.query(
      `INSERT INTO Student (emailAddress, username, firstName, lastName, profileImageUrl, year, majors, schools, bio)
      VALUES ('${emailAddress}', '${username}', '${firstName}', '${lastName}', '${profileImageUrl}', '${year}', '${majorsString}', '${schools}', '');
      `,
      (error, results) => {
        if (error) {
          res.json({ error })
        } else if (results) {
          req.session.username = username
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
router.get('/profile', async (req, res) => {
  const { username } = req.session
  if (!req.session.isInstructor) {
    connection.query(
      `SELECT * 
      FROM Student WHERE username = '${username}';
      `,
      (error, data) => {
        if (error) {
          res.json({ error })
        } else if (data) {
          res.json(data)
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

// // [GET] profile for a user
// router.get('/users/:user', async (req, res) => {
//   const { username } = req.params
//   if (req.session.isInstructor) {
//     connection.query(
//       `SELECT *
//       FROM Student WHERE username = '${username}';
//       `,
//       (error, results) => {
//         if (error) {
//           res.json({ error })
//         } else if (results) {
//           res.json({ results })
//         }
//       },
//     )
//   } else {
//     connection.query(
//       `SELECT *
//       FROM Instructor WHERE username = '${username}';
//       `,
//       (error, results) => {
//         if (error) {
//           res.json({ error })
//         } else if (results) {
//           res.json({ results })
//         }
//       },
//     )
//   }
// })

// [POST] update profile for a user
router.post('/profile/edit', async (req, res) => {
  const {
    emailAddress, username, firstName, lastName, profileImageUrl, year, majors, school, bio,
  } = req.body
  const schools = school.join(',')
  const majorsString = majors.join(',')
  if (req.session.isInstructor) {
    connection.query(
      `UPDATE Instructor
SET profileImageUrl = '${profileImageUrl}', firstName= '${firstName}', username = '${username}', lastName = '${lastName}, year = '${year}', schools = '${schools}', bio = '${bio}', majors='${majorsString}'
WHERE emailAddress = '${emailAddress}';`,
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
      // TODO: Change these fields based on what to edit
      `UPDATE Student
      SET profileImageUrl = '${profileImageUrl}', firstName= '${firstName}', emailAddress = '${emailAddress}', lastName = '${lastName}', year = '${year}', schools = '${schools}', bio = '${bio}', majors='${majorsString}'
      WHERE username = '${username}';`,
      (error, results) => {
        if (error) {
          console.log('erroring here')
          res.json({ error })
        } else if (results) {
          // res.json({ results })
          res.json('success')
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
    `INSERT INTO Assignment (assignmentId, classCode, deadline, maxGroupSize, minGroupSize, numGroups) VALUES ('${classCode}', '${deadline}', '${maxGroupSize}', '${minGroupSize}', '${numGroups}');    
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
      } else if (results) {
        res.json(results)
      }
    },
  )
})

// [GET] the group members for the group that the user belongs to
router.get(
  '/class/:classCode/assignments/:assignmentId/my-group-info',
  async (req, res) => {
    const { classCode, assignmentId } = req.params
    const { username } = req.session
    connection.query(
      `With GId AS (SELECT groupId FROM BelongsToGroup WHERE username = '${username}'
      AND assignmentId = '${assignmentId}'
      AND classCode = '${classCode}'),
     GroupMembers AS (
         SELECT username, assignmentId
         FROM BelongsToGroup
         WHERE groupId IN (SELECT * FROM GId) AND assignmentId = '${assignmentId}'
     )
 SELECT firstName, lastName, assignmentId
 From GroupMembers JOIN Student ON GroupMembers.username = Student.username;`,
      (error, results) => {
        if (error) {
          res.json({ error })
        } else if (results) {
          // console.log(results)
          res.json(results)
        }
      },
    )
  },
)

// [GET] the group ID the user belongs to
/* Note: All students should have a group created for them when the assignment is created
 *       on the instructor side
 */
router.get('/class/:classCode/assignments/:assignmentId/my-group-id', async (req, res) => {
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

/* REQUEST ROUTES */
// [GET] all individual requests that a user has received for a class assignment
router.get('/class/:classCode/assignments/:assignmentId/requests/individuals', async (req, res) => {
  const { classCode, assignmentId } = req.params
  // const { username } = req.session
  const username = 'jasonhom'
  connection.query(
    `WITH reqs AS (
      SELECT requestId, fromStudent, messageId
      FROM Request
      WHERE classCode = '${classCode}' AND assignmentId = '${assignmentId}' AND toStudent = '${username}'
  ), groupsRequested AS (
      SELECT groupId, classCode, assignmentId
      FROM reqs
               JOIN BelongsToGroup ON reqs.fromStudent = BelongsToGroup.username
      WHERE classCode = '${classCode}'
        AND assignmentId = '${assignmentId}'
  ), individuals AS (
      SELECT username
  FROM groupsRequested JOIN BelongsToGroup ON groupsRequested.groupId = BelongsToGroup.groupId
  GROUP BY BelongsToGroup.groupId, BelongsToGroup.classCode, BelongsToGroup.assignmentId
  HAVING COUNT(*) = 1
  )
  SELECT firstName, lastName, emailAddress, profileImageUrl, year, majors, schools
  FROM individuals JOIN Student ON individuals.username = Student.username;`,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json(results)
      }
    },
  )
})

// [GET] all individual requests that a user has received for a class assignment
router.get('/class/:classCode/assignments/:assignmentId/requests/groups', async (req, res) => {
  const { classCode, assignmentId } = req.params
  // const { username } = req.session
  const username = 'jasonhom'
  connection.query(
    `WITH reqs AS (
      SELECT requestId, fromStudent, messageId
      FROM Request
      WHERE classCode = '${classCode}' AND assignmentId = '${assignmentId}' AND toStudent = '${username}'
  ), groupsRequested AS (
      SELECT groupId, classCode, assignmentId
      FROM reqs
               JOIN BelongsToGroup ON reqs.fromStudent = BelongsToGroup.username
      WHERE classCode = '${classCode}'
        AND assignmentId = '${assignmentId}'
  ), groupReqs AS (
      SELECT BelongsToGroup.groupId
  FROM groupsRequested JOIN BelongsToGroup ON groupsRequested.groupId = BelongsToGroup.groupId
  GROUP BY BelongsToGroup.groupId, BelongsToGroup.classCode, BelongsToGroup.assignmentId
  HAVING COUNT(*) > 1
  )
  SELECT firstName, lastName, emailAddress, profileImageUrl, year, majors, schools, BelongsToGroup.groupId
  FROM groupReqs JOIN BelongsToGroup ON groupReqs.groupId = BelongsToGroup.groupId JOIN Student ON BelongsToGroup.username = Student.username;`,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        console.log(`Group Results: ${JSON.stringify(results)}`)
        res.json(results)
      }
    },
  )
})

// [GET] all requests that a user has received for a class assignment

// router.get('/class/:classCode/assignments/:assignmentId/requests', async (req, res) => {
//   const { classCode, assignmentId } = req.params
//   // const { username } = req.session
//   const username = 'jasonhom'
//   connection.query(
//     `WITH reqs AS (
//       SELECT requestId, fromStudent, messageId
//       FROM Request
//       WHERE classCode = '${classCode}' AND assignmentId = '${assignmentId}'
// AND toStudent = '${username}'
//   )
//   SELECT firstName, lastName, emailAddress, profileImageUrl, year, majors, schools
//   FROM Student JOIN reqs ON Student.username = reqs.fromStudent;`,
//     (error, results) => {
//       if (error) {
//         res.json({ error })
//       } else if (results) {
//         res.json(results)
//       }
//     },
//   )
// })
// router.get('/class/:classCode/assignments/:assignmentId/requests', async (req, res) => {
//   const { classCode, assignmentId } = req.params
//   const { username } = req.session
//   connection.query(
//     `SELECT requestId, fromStudent, messageId
//     FROM Request
//     WHERE classCode = '${classCode}' AND assignmentId = '${assignmentId}'
// AND toStudent = '${username}';`,
//     (error, results) => {
//       if (error) {
//         res.json({ error })
//       } else if (results) {
//         res.json(results)
//       }
//     },
//   )
// })

// TODO: Add datetime attribute after discussing chat
// [POST] new request from the current user to another user
router.post('/user/:user/requests', async (req, res) => {
  // const { classCode, assignmentId, requestId } = req.params
  const {
    classCode, assignmentId, requestId, toStudent, username,
  } = req.body
  // const { username } = req.session
  const messageId = null // TODO: Change later
  connection.query(
    `INSERT INTO Request (classCode, assignmentId, requestId, fromStudent, toStudent, messageId)
      VALUES ('${classCode}', '${assignmentId}', '${requestId}', '${username}', '${toStudent}', 
        ${messageId});`, // TODO: left quotes out for messageId since we are setting to null, must change later
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json(results)
      }
    },
  )
})

// TODO: Add datetime attribute after discussing chat
// [DELETE] request from the current user to another user
router.delete('/delete-request/:requestId', async (req, res) => {
  // const { classCode, assignmentId, requestId } = req.params
  const {
    classCode, assignmentId, requestId,
  } = req.body
  connection.query(
    `DELETE FROM Request 
    WHERE classCode = '${classCode}' AND assignmentId = '${assignmentId}' AND requestId = '${requestId}';`,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json(results)
      }
    },
  )
})

// CHAT ROUTES

// [GET] all the chats for a given user
router.get('/chats/all', async (req, res) => {
  const { username } = req.session
  connection.query(
    `SELECT *
    FROM BelongsToChat B NATURAL JOIN Chat C
    WHERE username = '${username}';
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

// [GET] filtered chats for the logged in user
router.get('/chats/:classCode/all', async (req, res) => {
  const { username } = req.session
  const { classCode } = req.params
  connection.query(
    `SELECT *
    FROM BelongsToChat B NATURAL JOIN Chat C
    WHERE username = '${username}' AND classCode = '${classCode}';
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

// [GET] all the messages for a given chat
router.get('/chats/:chatId', async (req, res) => {
  const { chatId } = req.params
  console.log(chatId)
  connection.query(
    `SELECT *
    FROM Message
    WHERE chatId = '${chatId}';
    `,
    (error, results) => {
      if (error) {
        console.log(error)
        res.json({ error })
      } else if (results) {
        res.json(results)
      }
    },
  )
})

// [POST] a new message for a given chat
router.post('/chats/:chatId', async (req, res) => {
  const { chatId } = req.params
  const { username } = req.session // TODO: req.session not working
  console.log(username)
  const {
    messageContent,
  } = req.body
  const timestamp = new Date()
  messageContent.replace("'", "''")
  connection.query(
    `INSERT INTO Message (content, sender, chatId, timestamp)
    VALUES ('${messageContent}', '${username}', '${chatId}', '${timestamp}');
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

// [POST] a new chat (not an established group)
router.post('/chats/:classCode/assignments/:assignmentId', async (req, res) => {
  const { classCode, assignmentId } = req.params
  const { members } = req.body
  const chatId = uuidv4()
  console.log('members')
  console.log(members)
  connection.query(
    `INSERT INTO Chat (chatId, classCode, assignmentId) VALUES ('${classCode}', '${chatId}', '${assignmentId}'');
     `,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json(results)
      }
    },
  )
  members.forEach((member) => connection.query(
    `INSERT INTO BelongstoChat VALUES('${chatId}', '${member})
    `,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json(results)
      }
    },
  ))
})

// [POST] a new chat (an established group)
router.post('/chats/:classCode/assignments/:assignmentId/:groupId', async (req, res) => {
  const { classCode, assignmentId, groupId } = req.params
  const { members } = req.body
  const chatId = uuidv4()
  console.log('members')
  console.log(members)
  connection.query(
    `INSERT INTO Chat (chatId, classCode, groupId, assignmentId) VALUES ('${chatId}', '${classCode}', '${groupId}','${assignmentId}'');
     `,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json(results)
      }
    },
  )
  members.forEach((member) => connection.query(
    `INSERT INTO BelongstoChat VALUES('${chatId}', '${member})
    `,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json(results)
      }
    },
  ))
})

module.exports = router
