import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Stack, Grid,
} from '@mui/material'
import CourseCard from '../components/CourseCard'
import CoursesSideBar from '../components/CoursesSideBar'
import {
  getLoggedInUserAllCourses,
} from '../infoHelpers'
// import {
//   getUserAllCourses,
// } from '../infoHelpers'
import Header from '../components/Header'

// const navigate = useNavigate()

function StudentCourses() {
  const [studentCourses, setStudentCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()

  const currDate = new Date()
  const currMonth = currDate.getMonth() + 1
  const currYear = currDate.getFullYear()
  const currSeason = currMonth <= 7 ? 'Spring' : 'Fall'

  const getUser = async () => {
    const { data } = await axios.get('http://localhost:8080/username', { withCredentials: true })
    if (!data) {
      navigate('/login')
    }
    return data
  }

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

    // if (!checkUserLoggedIn) {
    //   navigate('/login')
    //   // window.location.href = '/login'
    // }
    // checkUserLoggedIn().then((user) => {
    //   console.log('user')
    //   console.log(user)
    //   getUserAllCourses(user).then((response) => {
    //     setStudentCourses(response)
    //     setIsLoading(false)
    //   })
    // })
    getUser()
    getLoggedInUserAllCourses().then((response) => {
      setStudentCourses(response)
      setIsLoading(false)
    })
  }, [])

  return (
    <div className="container-courses-page">
      <h2 className="px-12 pt-6 text-3xl"> Student Courses </h2>
      <h3 className="px-12 pt-6 text-xl">
        {' '}
        {`${currSeason} ${currYear}`}
      </h3>
      <div className="px-4">
        {!isLoading && (
          <Grid container spacing={1}>
            {studentCourses.map(
              (course) => (
                <Grid item md={4} key={`my-courses: ${course.classCode}`} style={{ marginTop: 10 }}>
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
    <Stack direction="column">
      <Header />
      <Stack direction="row" spacing={1}>
        <CoursesSideBar />
        <div className="justify-center">
          {StudentCourses()}
        </div>
      </Stack>
    </Stack>

  )
}

export default CoursesPage
