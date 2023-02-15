import { useState, useEffect } from 'react'
import {
  Stack, Grid,
} from '@mui/material'
import CourseCard from './CourseCard'
import CoursesSideBar from './CoursesSideBar'
import {
  getUserAllCourses,
} from './infoHelpers'

function StudentCourses() {
  const [studentCourses, setStudentCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // uncomment once localStorage stuff is implemented
    // if (localStorage.getItem('currUsername')) {
    //   getUserAllCourses(localStorage.getItem('currUsername'))
    //     .then((response) => {
    //       setStudentCourses(response)
    //       setIsLoading(false)
    //     })
    // } else {
    //   window.location.href = '/'
    // }

    getUserAllCourses('lejiaz')
      .then((response) => {
        setStudentCourses(response)
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="container-courses-page">
      <h2 className="px-12 pt-12 text-3xl"> Student Courses </h2>
      <h3 className="px-12 pt-6"> Spring 2023</h3>
      <div className="px-12 pt-6">
        {!isLoading && (
        <Grid container spacing={20}>
          {studentCourses.map(
            (course) => (
              <Grid item md={4} key={`my-courses: ${course.classCode}`} style={{ marginTop: 20 }}>
                <CourseCard
                  courseId={course.classCode}
                />
              </Grid>
            ),
          )}
        </Grid>
        )}
      </div>
    </div>
  )
}

function CoursesPage() {
  return (
    <Stack direction="row" spacing={2}>
      <CoursesSideBar />
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        {StudentCourses()}
      </div>
    </Stack>
  )
}

export default CoursesPage
