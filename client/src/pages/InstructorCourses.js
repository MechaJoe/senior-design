import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Stack, Grid,
} from '@mui/material'
import InstructorCourseCard from '../components/InstructorCourseCard'
import AddCourseCard from '../components/AddCourseCard'
import CoursesSideBar from '../components/CoursesSideBar'
import {
  getLoggedInUserAllCourses,
} from '../infoHelpers'
import Header from '../components/Header'

function InstructorCourses() {
  const [instructorCourses, setInstructorCourses] = useState([])
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
    getUser()
    getLoggedInUserAllCourses().then((response) => {
      setInstructorCourses(response)
      setIsLoading(false)
    })
  }, [])

  return (
    <div className="container-courses-page">
      <h2 className="px-12 pt-6 text-3xl"> Instructor Courses </h2>
      <h3 className="px-12 pt-6 text-xl">
        {' '}
        {`${currSeason} ${currYear}`}
      </h3>
      <div className="px-4">
        {!isLoading && (
          <Grid container spacing={1}>
            {instructorCourses.map(
              (course) => (
                <Grid item md={4} key={`my-courses: ${course.classCode}`} style={{ marginTop: 10 }}>
                  <InstructorCourseCard
                    courseId={course.classCode}
                  />
                </Grid>
              ),
            )}
            <Grid item md={4} style={{ marginTop: 10 }}>
              <AddCourseCard />

            </Grid>
          </Grid>
        )}
      </div>
    </div>
  )
}

function InstructorCoursesPage() {
  return (
    <Stack direction="column">
      <Header />
      <Stack direction="row" spacing={1}>
        <CoursesSideBar />
        <div className="justify-center">
          {InstructorCourses()}
        </div>
      </Stack>
    </Stack>

  )
}

export default InstructorCoursesPage
