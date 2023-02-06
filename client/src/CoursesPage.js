import { useState, useEffect } from 'react'
import CourseCard from './CourseCard'
import {
  getUserAllCourses,
} from './infoHelpers'

function StudentCourses() {
  const [studentCourses, setStudentCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // replace placeholder name with localStorage.getItem('currUsername')
    getUserAllCourses('lejiaz')
      .then((response) => {
        setStudentCourses(response)
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="container-courses-page">
      <h2>Student Courses</h2>
      <div className="container">
        {!isLoading && (
        <ul className="no-bullets" style={{ marginTop: 20 }}>
          {studentCourses.map(
            (item) => (
              <li key={`my-courses: ${item.classCode}`} style={{ marginTop: 20 }}>
                <CourseCard
                  courseId={item.classCode}
                />
              </li>
            ),
          )}
        </ul>
        )}
      </div>
    </div>
  )
}

function CoursesPage() {
  return (
    <div className="container-courses-page">
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        {StudentCourses()}
      </div>
    </div>
  )
}

export default CoursesPage
