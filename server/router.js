/* eslint-disable max-len */
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
  multipleStatements: true,
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
  const { username, instructor } = req.session
  if (!instructor) {
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
  } else {
    connection.query(
      `SELECT Class.classCode, className
        FROM InstructorOf JOIN Class ON InstructorOf.classCode = Class.classCode
        WHERE username = '${username}';`,
      (error, results) => {
        if (error) {
          res.json({ error })
        } else if (results) {
          console.log('here')
          res.json({ results })
        }
      },
    )
  }
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

// GETs all students in a class without a group (only singleton groups)
router.get('/class/:classCode/assignments/:assignmentId/no-group', async (req, res) => {
  const { classCode, assignmentId } = req.params
  connection.query(
    `WITH all_students AS (
      SELECT Student.username FROM Student JOIN StudentOf ON StudentOf.username = Student.username
      WHERE StudentOf.classCode = '${classCode}'
    )
      SELECT all_students.username, emailAddress, firstName, lastName, year, profileImageUrl, majors, schools FROM all_students
          JOIN Student ON all_students.username = Student.username
          JOIN BelongsToGroup ON BelongsToGroup.username = all_students.username
        WHERE assignmentId = '${assignmentId}'
        GROUP BY groupId
        HAVING COUNT(groupId) = 1;
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

// GETs all students in a class in any (non-singleton) group
router.get('/class/:classCode/assignments/:assignmentId/grouped', async (req, res) => {
  const { classCode, assignmentId } = req.params
  connection.query(
    `WITH all_students AS (
      SELECT Student.username FROM Student JOIN StudentOf ON StudentOf.username = Student.username
      WHERE StudentOf.classCode = '${classCode}'
    ),
    singletons AS (
      SELECT all_students.username, emailAddress, firstName, lastName, year, profileImageUrl, majors, schools FROM all_students
        JOIN Student ON all_students.username = Student.username
        JOIN BelongsToGroup ON BelongsToGroup.username = all_students.username
        WHERE assignmentId = '${assignmentId}'
        GROUP BY groupId
        HAVING COUNT(groupId) = 1)
    SELECT all_students.username, emailAddress, firstName, lastName, year, profileImageUrl, majors, schools FROM all_students
    JOIN Student ON all_students.username = Student.username
    WHERE all_students.username NOT IN (SELECT username FROM singletons);
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
    emailAddress, username, firstName, lastName, profileImageUrl, year, majors, school, bioInput,
  } = req.body
  const schools = school.join(',')
  const majorsString = majors.join(',')
  if (req.session.isInstructor) {
    connection.query(
      `UPDATE Instructor
SET profileImageUrl = '${profileImageUrl}', firstName= '${firstName}', username = '${username}', lastName = '${lastName}, year = '${year}', schools = '${schools}', bio = '${bioInput}', majors='${majorsString}'
WHERE emailAddress = '${emailAddress}';`,
      (error, results) => {
        if (error) {
          res.json({ error })
        } else if (results) {
          // res.json({ results })
        }
      },
    )
  } else {
    connection.query(
      // TODO: Change these fields based on what to edit
      `UPDATE Student
      SET profileImageUrl = '${profileImageUrl}', firstName= '${firstName}', emailAddress = '${emailAddress}', lastName = '${lastName}', year = '${year}', schools = '${schools}', bio = '${bioInput}', majors='${majorsString}'
      WHERE username = '${username}';`,
      (error, results) => {
        if (error) {
          console.log(error)
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

// INSTRUCTOR MODE ASSIGNMENT ROUTES

// Creates a new assignment
router.post('/class/:classCode/assignments/:assignmentId', async (req, res) => {
  const { classCode, assignmentId } = req.params
  const { deadline, maxGroupSize, minGroupSize } = req.body
  connection.query(
    `INSERT INTO Assignment(assignmentId, classCode, deadline, maxGroupSize, minGroupSize, numGroups)
    VALUES ('${assignmentId}', '${classCode}', '${deadline}', ${maxGroupSize}, ${minGroupSize}, 20);
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

// Updates details for an existing assignment
router.put('/class/:classCode/assignments/:assignmentId', async (req, res) => {
  const { classCode, assignmentId } = req.params
  const { deadline, maxGroupSize, minGroupSize } = req.body
  connection.query(
    `INSERT INTO Assignment(assignmentId, classCode, deadline, maxGroupSize, minGroupSize, numGroups)
    VALUES ('${assignmentId}', '${classCode}', '${deadline}', ${maxGroupSize}, ${minGroupSize}, 20);
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

// [DELETE] assignment
// router.post('/delete-assignment', async (req, res) => {
//   const {
//     classCode, assignmentId,
//   } = req.body
//   // const { username } = req.session.instructor // not sure how to use this
//   // const username = 'jasonhom'
//   connection.query(
//     `DELETE Assignment, GroupAss, BelongsToGroup, Request
//     FROM Assignment
//     LEFT JOIN GroupAss ON Assignment.classCode = GroupAss.classCode AND Assignment.assignmentId = GroupAss.assignmentId
//     LEFT JOIN BelongsToGroup ON Assignment.classCode = BelongsToGroup.classCode AND Assignment.assignmentId = BelongsToGroup.assignmentId
//     LEFT JOIN Request ON Assignment.classCode = Request.classCode AND Assignment.assignmentId = Request.assignmentId
//     WHERE Assignment.classCode = "${classCode}" AND Assignment.assignmentId = "${assignmentId}";`,
//     (error, results) => {
//       if (error) {
//         console.log(error)
//         res.json({ error })
//       } else if (results) {
//         res.json(results)
//       }
//     },
//   )
// })

// [DELETE] requests for a particular assignment
router.post('/delete-assignment-requests', async (req, res) => {
  const {
    classCode, assignmentId,
  } = req.body
  // const { username } = req.session.instructor // not sure how to use this
  // const username = 'jasonhom'
  connection.query(
    `DELETE FROM Request
    WHERE Request.classCode = "${classCode}" AND Request.assignmentId = "${assignmentId}";`,
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

// [DELETE] belongsToGroup for a particular assignment
router.post('/delete-assignment-belongsToGroup', async (req, res) => {
  const {
    classCode, assignmentId,
  } = req.body
  // const { username } = req.session.instructor // not sure how to use this
  // const username = 'jasonhom'
  connection.query(
    `DELETE FROM BelongsToGroup
    WHERE BelongsToGroup.classCode = "${classCode}" AND BelongsToGroup.assignmentId = "${assignmentId}";`,
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

// [DELETE] groupAss for a particular assignment
router.post('/delete-assignment-groupAss', async (req, res) => {
  const {
    classCode, assignmentId,
  } = req.body
  // const { username } = req.session.instructor // not sure how to use this
  // const username = 'jasonhom'
  connection.query(
    `DELETE FROM GroupAss
    WHERE GroupAss.classCode = "${classCode}" AND GroupAss.assignmentId = "${assignmentId}";`,
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

// [DELETE] assignment
router.post('/delete-assignment', async (req, res) => {
  const {
    classCode, assignmentId,
  } = req.body
  // const { username } = req.session.instructor // not sure how to use this
  // const username = 'jasonhom'
  connection.query(
    `DELETE FROM Assignment
    WHERE Assignment.classCode = "${classCode}" AND Assignment.assignmentId = "${assignmentId}";`,
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

// GET all the non-singleton groups for a specific assignment
router.get('/class/:classCode/assignments/:assignmentId/nonSingletonGroups', async (req, res) => {
  const { classCode, assignmentId } = req.params
  connection.query(
    `SELECT GroupAss.groupId
    FROM GroupAss JOIN BelongsToGroup ON GroupAss.groupId = BelongsToGroup.groupId
    WHERE GroupAss.assignmentId = '${assignmentId}' AND GroupAss.classCode = '${classCode}'
    GROUP BY GroupAss.groupId
    HAVING COUNT(GroupAss.groupId) > 1;
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
 SELECT Student.username, firstName, lastName, assignmentId
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

// [GET] the group ID the logged-in user belongs to
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

// [GET] students who are not in a group
router.get('/class/:classCode/assignments/:assignmentId/unassigned', async (req, res) => {
  const { classCode, assignmentId } = req.params
  connection.query(
    `WITH studentsInClass AS (
      SELECT username FROM StudentOf
      WHERE classCode = '${classCode}'
    ),
      studentsInGroup AS (
        SELECT username FROM BelongsToGroup
        WHERE classCode = '${classCode}' AND assignmentId = '${assignmentId}'
      ),
      unassignedStudents AS (
        SELECT username FROM studentsInClass 
        WHERE username NOT IN (SELECT username FROM studentsInGroup)
      )
      SELECT Student.username, emailAddress, firstName, lastName, year, majors, schools FROM unassignedStudents
          JOIN Student ON unassignedStudents.username = Student.username;
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

// [GET] the group ID a user belongs to
router.get('/class/:classCode/assignments/:assignmentId/group-id/:username', async (req, res) => {
  const { classCode, assignmentId, username } = req.params
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

// [POST] Create a group with the specified username as the leader
router.post('/class/:classCode/assignments/:assignmentId/group', async (req, res) => {
  const { classCode, assignmentId } = req.params
  let { leader } = req.body
  if (!leader || leader === '') {
    leader = req.session
  }
  const groupId = uuidv4()
  connection.query(
    `INSERT INTO GroupAss (classCode, groupId, assignmentId, leader) VALUES ('${classCode}', '${groupId}', '${assignmentId}', '${leader}');
     INSERT INTO BelongsToGroup VALUES ('${leader}', '${groupId}', '${classCode}', '${assignmentId}');`,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json(results)
      }
    },
  )
})

// [POST] Create singleton groups when an assignment is created
router.post('/class/:classCode/assignments/:assignmentId/singletongroup', async (req, res) => {
  const { classCode, assignmentId } = req.params

  // const groupId = uuidv4()
  console.log(`Singleotn Class code: ${classCode}`)
  console.log(`Singleton Assignment ID: ${assignmentId}`)

  connection.query(
    `INSERT INTO GroupAss(classCode, assignmentId, leader)
    SELECT
           "${classCode}",
           "${assignmentId}",
           username
    FROM StudentOf
    WHERE classCode = "${classCode}";`,
    (error, results) => {
      if (error) {
        console.log(error)
        res.json({ error })
      } else if (results) {
        console.log('singleton here')
        console.log(results)
        res.json(results)
      }
    },
  )
})

// [POST] Add students belonging to singleton groups when assignment is created
router.post('/class/:classCode/assignments/:assignmentId/belongsToSingletonGroup', async (req, res) => {
  const { classCode, assignmentId } = req.params
  console.log(`Belongs TO Class code: ${classCode}`)
  console.log(`Belongs To Assignment ID: ${assignmentId}`)
  connection.query(
    `INSERT INTO BelongsToGroup(username, groupId, classCode, assignmentId)
    SELECT leader, groupId, classCode, assignmentId
    FROM GroupAss
    WHERE classCode = "${classCode}" AND assignmentId = "${assignmentId}";`,
    (error, results) => {
      if (error) {
        console.log(error)
        res.json({ error })
      } else if (results) {
        console.log('belongs to here')
        console.log(results)
        res.json(results)
      }
    },
  )
})

// [PATCH] (add or remove) a user from a group
router.patch('/class/:classCode/assignments/:assignmentId/group/:groupId', async (req, res) => {
  const { classCode, assignmentId, groupId } = req.params
  const { op } = req.body
  let { username } = req.body
  if (!username || username === '') {
    username = req.session.username
  }
  let sql = ''
  if (op === 'add') {
    sql = `
      INSERT INTO BelongsToGroup (classCode, assignmentId, groupId, username)
      VALUES ('${classCode}', '${assignmentId}', '${groupId}', '${username}');
        DELETE FROM GroupAss WHERE groupId NOT IN
          (SELECT groupId FROM BelongsToGroup);
          `
    console.log(sql)
  } else if (op === 'remove') {
    sql = `
      DELETE FROM BelongsToGroup WHERE classCode = '${classCode}'
        AND assignmentId = '${assignmentId}'
        AND groupId = '${groupId}'
        AND username = '${username}';
      DELETE FROM GroupAss WHERE groupId NOT IN
        (SELECT groupId FROM BelongsToGroup);`
  } else {
    res.json({ error: 'Invalid operation' })
    return
  }
  connection.query(
    sql,
    (error, results) => {
      if (error) {
        console.log(error)
        res.json({ error })
      } else if (results) {
        console.log(results)
        res.json(results)
      }
    },
  )
})

// [DELETE] a group
router.delete('/class/:classCode/assignments/:assignmentId/group/:groupId', async (req, res) => {
  const { classCode, assignmentId, groupId } = req.params
  connection.query(
    `DELETE FROM GroupAss WHERE classCode = '${classCode}' AND assignmentId = '${assignmentId}' AND groupId = '${groupId}';
     DELETE FROM BelongsToGroup WHERE classCode = '${classCode}' AND assignmentId = '${assignmentId}' AND groupId = '${groupId}';`,
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

// [GET] the chat id (if it exists) for the given users
router.get('/chats/id', async (req, res) => {
  const { members } = req.query
  connection.query(
    `WITH relevant_groups AS (
      SELECT chatId, username FROM BelongsToChat
          WHERE username IN ('${members?.join("','")}')),
      group_sizes AS (
          SELECT chatId, COUNT(*) AS total_size FROM BelongsToChat
              GROUP BY chatId
      )
    SELECT relevant_groups.chatId, total_size from relevant_groups
          JOIN group_sizes ON group_sizes.chatId = relevant_groups.chatId
          GROUP BY relevant_groups.chatId
          HAVING COUNT(*) = total_size AND COUNT(*) = ${members?.length}`,
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
  connection.query(
    `SELECT *
    FROM Message
    WHERE chatId = '${chatId}';
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

// [GET] all the members for a given chat
router.get('/chats/:chatId/members', async (req, res) => {
  const { chatId } = req.params
  connection.query(
    `SELECT B.username, firstName
    FROM BelongsToChat B JOIN Student S ON B.username = S.username
    WHERE chatId = '${chatId}';
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
  const response = {
    message: '',
    chatId,
  }
  connection.query(
    `INSERT INTO Chat (chatId, classCode, assignmentId, name) VALUES ('${chatId}', '${classCode}', '${assignmentId}', '${members.join(', ')}');
     `,
    (error, results) => {
      if (error) {
        response.message = 'error inserting into Chat'
      } else if (results) {
        response.message = 'successfully inserted into Chat'
      }
    },
  )
  members.forEach((member) => connection.query(
    `INSERT INTO BelongsToChat VALUES('${chatId}', '${member}')`,
    (error, results) => {
      if (error) {
        response.message = 'error adding member to chat'
      } else if (results) {
        response.message = `successfully added ${member} into chat`
        response.chatId = chatId
      }
    },
  ))
  res.json(response)
})

// [POST] add a new user to a chat
router.post('/chats/:chatId/add', async (req, res) => {
  const { chatId } = req.params
  const {
    newMember,
  } = req.body
  connection.query(
    `INSERT INTO BelongsToChat (chatId, username)
    VALUES ('${chatId}', '${newMember}');
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

// [POST] a new chat (an established group)
router.post('/chats/:classCode/assignments/:assignmentId/groups/:groupId', async (req, res) => {
  const { classCode, assignmentId, groupId } = req.params
  const { members } = req.body
  const chatId = uuidv4()
  const response = {}
  connection.query(
    `INSERT INTO Chat (chatId, classCode, groupId, assignmentId, name)
     VALUES ('${chatId}', '${classCode}', '${groupId}','${assignmentId}', '${members.join(', ')}');
     `,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        members.forEach((member) => connection.query(
          `INSERT INTO BelongsToChat (chatId, username) VALUES ('${chatId}', '${member}');
          `,
          (error2, results2) => {
            if (error2) {
              response.message = 'error adding member to chat'
            } else if (results2) {
              response.message = 'success creating chat and adding members'
            }
          },
        ))
        res.json({ chatId })
      }
    },
  )
})

/* REQUEST ROUTES */
// [GET] all incoming individual requests that a user has received for a class assignment
router.get('/class/:classCode/assignments/:assignmentId/requests/individuals', async (req, res) => {
  const { classCode, assignmentId } = req.params
  const { username } = req.session
  connection.query(
    `WITH myGID AS (
      SELECT groupId
      FROM BelongsToGroup
      WHERE classCode = '${classCode}'
        AND assignmentId = '${assignmentId}'
        AND username = '${username}'
  ), reqs AS (
      SELECT fromGroupId
      FROM Request
      WHERE toGroupId IN (SELECT * FROM myGID)
  ), groupsRequested AS (
      SELECT groupId, classCode, assignmentId
      FROM reqs
               JOIN BelongsToGroup ON reqs.fromGroupId = BelongsToGroup.groupId
      WHERE classCode = '${classCode}'
        AND assignmentId = '${assignmentId}'
  ), individuals AS (
      SELECT username, BelongsToGroup.groupId
  FROM groupsRequested JOIN BelongsToGroup ON groupsRequested.groupId = BelongsToGroup.groupId
  GROUP BY BelongsToGroup.groupId, BelongsToGroup.classCode, BelongsToGroup.assignmentId
  HAVING COUNT(*) = 1
  )
  SELECT Student.username, firstName, lastName, emailAddress, profileImageUrl, year, majors, schools, groupId
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

// [GET] all incoming group requests that a user has received for a class assignment
router.get('/class/:classCode/assignments/:assignmentId/requests/groups', async (req, res) => {
  const { classCode, assignmentId } = req.params
  const { username } = req.session
  connection.query(
    `WITH myGID AS (
      SELECT groupId
      FROM BelongsToGroup
      WHERE classCode = '${classCode}'
        AND assignmentId = '${assignmentId}'
        AND username = '${username}'
  ), reqs AS (
      SELECT fromGroupId
      FROM Request
      WHERE toGroupId IN (SELECT * FROM myGID)
  ), groupsRequested AS (
      SELECT groupId, classCode, assignmentId
      FROM reqs
               JOIN BelongsToGroup ON reqs.fromGroupId = BelongsToGroup.groupId
      WHERE classCode = '${classCode}'
        AND assignmentId = '${assignmentId}'
  ), groupReqs AS (
      SELECT BelongsToGroup.groupId
  FROM groupsRequested JOIN BelongsToGroup ON groupsRequested.groupId = BelongsToGroup.groupId
  GROUP BY BelongsToGroup.groupId, BelongsToGroup.classCode, BelongsToGroup.assignmentId
  HAVING COUNT(*) > 1
  )
  SELECT Student.username, firstName, lastName, emailAddress, profileImageUrl, year, majors, schools, BelongsToGroup.groupId
  FROM groupReqs JOIN BelongsToGroup ON groupReqs.groupId = BelongsToGroup.groupId JOIN Student ON BelongsToGroup.username = Student.username;`,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json(results)
      }
    },
  )
})

// [GET] all outgoing individual requests that a user has received for a class assignment
router.get('/class/:classCode/assignments/:assignmentId/requests/outgoing/individuals', async (req, res) => {
  const { classCode, assignmentId } = req.params
  const { username } = req.session
  // const username = 'jasonhom'
  connection.query(
    `WITH myGID AS (
      SELECT groupId
      FROM BelongsToGroup
      WHERE classCode = '${classCode}'
        AND assignmentId = '${assignmentId}'
        AND username = '${username}'
  ), reqs AS (
      SELECT toGroupId
      FROM Request
      WHERE fromGroupId IN (SELECT * FROM myGID)
  ), groupsRequested AS (
      SELECT groupId, classCode, assignmentId
      FROM reqs
               JOIN BelongsToGroup ON reqs.toGroupId = BelongsToGroup.groupId
      WHERE classCode = '${classCode}'
        AND assignmentId = '${assignmentId}'
  ), individuals AS (
      SELECT username, BelongsToGroup.groupId
  FROM groupsRequested JOIN BelongsToGroup ON groupsRequested.groupId = BelongsToGroup.groupId
  GROUP BY BelongsToGroup.groupId, BelongsToGroup.classCode, BelongsToGroup.assignmentId
  HAVING COUNT(*) = 1
  )
  SELECT Student.username, firstName, lastName, emailAddress, profileImageUrl, year, majors, schools, groupId
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

// [GET] all outgoing group requests that a user has received for a class assignment
router.get('/class/:classCode/assignments/:assignmentId/requests/outgoing/groups', async (req, res) => {
  const { classCode, assignmentId } = req.params
  const { username } = req.session
  // const username = 'jasonhom'
  connection.query(
    `WITH myGID AS (
      SELECT groupId
      FROM BelongsToGroup
      WHERE classCode = '${classCode}'
        AND assignmentId = '${assignmentId}'
        AND username = '${username}'
  ), reqs AS (
      SELECT toGroupId
      FROM Request
      WHERE fromGroupId IN (SELECT * FROM myGID)
  ), groupsRequested AS (
      SELECT groupId, classCode, assignmentId
      FROM reqs
               JOIN BelongsToGroup ON reqs.toGroupId = BelongsToGroup.groupId
      WHERE classCode = '${classCode}'
        AND assignmentId = '${assignmentId}'
  ), groupReqs AS (
      SELECT BelongsToGroup.groupId
  FROM groupsRequested JOIN BelongsToGroup ON groupsRequested.groupId = BelongsToGroup.groupId
  GROUP BY BelongsToGroup.groupId, BelongsToGroup.classCode, BelongsToGroup.assignmentId
  HAVING COUNT(*) > 1
  )
  SELECT Student.username, firstName, lastName, emailAddress, profileImageUrl, year, majors, schools, BelongsToGroup.groupId
  FROM groupReqs JOIN BelongsToGroup ON groupReqs.groupId = BelongsToGroup.groupId JOIN Student ON BelongsToGroup.username = Student.username;`,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json(results)
      }
    },
  )
})

// [POST] request from the current user to another user
router.post('/request/add', async (req, res) => {
  // const { classCode, assignmentId, requestId } = req.params
  const {
    classCode, assignmentId, toGroupId,
  } = req.body
  const { username } = req.session
  connection.query(
    `INSERT INTO Request (classCode, assignmentId, fromGroupId, toGroupId)
    SELECT '${classCode}', '${assignmentId}', groupId, '${toGroupId}'
    FROM BelongsToGroup
    WHERE username = '${username}'
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

// [DELETE] request from another user to current user
router.post('/reject-request', async (req, res) => {
  // const { classCode, assignmentId, requestId } = req.params
  const {
    classCode, assignmentId, fromGroupId,
  } = req.body
  const { username } = req.session
  // const username = 'jasonhom'
  connection.query(
    `WITH myGID AS (
      SELECT groupId
      FROM BelongsToGroup
      WHERE classCode = '${classCode}'
        AND assignmentId = '${assignmentId}'
        AND username = '${username}'
  )
  DELETE FROM Request
  WHERE classCode = '${classCode}' AND assignmentId = '${assignmentId}' AND fromGroupId = '${fromGroupId}' AND toGroupId IN (SELECT * FROM myGID);`,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json(results)
      }
    },
  )
})

// [DELETE] request from the current user to another user
router.post('/cancel-request', async (req, res) => {
  // const { classCode, assignmentId, requestId } = req.params
  const {
    classCode, assignmentId, toGroupId,
  } = req.body
  const { username } = req.session
  // const username = 'jasonhom'
  connection.query(
    `WITH myGID AS (
      SELECT groupId
      FROM BelongsToGroup
      WHERE classCode = '${classCode}'
        AND assignmentId = '${assignmentId}'
        AND username = '${username}'
  )
  DELETE FROM Request
  WHERE classCode = '${classCode}' AND assignmentId = '${assignmentId}' AND toGroupId = '${toGroupId}' AND fromGroupId IN (SELECT * FROM myGID);`,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json(results)
      }
    },
  )
})

// [POST] Accepts request from another user to current user
router.post('/accept-request', async (req, res) => {
  // const { classCode, assignmentId, requestId } = req.params
  const {
    classCode, assignmentId, fromGroupId,
  } = req.body
  const { username } = req.session
  // const username = 'jasonhom'
  connection.query(
    `WITH myGID AS (
      SELECT groupId
      FROM BelongsToGroup
      WHERE classCode = '${classCode}'
        AND assignmentId = '${assignmentId}'
        AND username = '${username}'
  )
  UPDATE BelongsToGroup, myGID
  SET BelongsToGroup.groupId = myGID.groupId
  WHERE classCode = '${classCode}' AND assignmentId = '${assignmentId}' AND BelongsToGroup.groupId = '${fromGroupId}';`,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json(results)
      }
    },
  )
})

// [POST] Create a new course
router.post('/instructor/class/new', async (req, res) => {
  const { classCode, className } = req.body
  const { username } = req.session
  connection.query(
    `INSERT INTO Class (classCode, className) VALUES ('${classCode}', '${className}');
    INSERT INTO InstructorOf (username, classCode) VALUES ('${username}', '${classCode}')`,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json(results)
      }
    },
  )
})

// [POST] Add a student to a course
router.post('/instructor/class/:classCode/:username', async (req, res) => {
  const { classCode, username } = req.params
  connection.query(
    `INSERT INTO StudentOf (username, classCode) VALUES ('${username}', '${classCode}' );`,
    (error, results) => {
      if (error) {
        res.json({ error })
      } else if (results) {
        res.json(results)
      }
    },
  )
})

// [POST] add a new tag for a course
router.post('/instructor/class/:classCode/tags/new', async (req, res) => {
  const { classCode } = req.params
  const { content } = req.body
  const tagId = uuidv4()
  connection.query(
    `INSERT INTO Tag (tagId, classCode, content) VALUES ('${tagId}', '${classCode}', '${content}');`,
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
