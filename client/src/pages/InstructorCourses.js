// // import axios from 'axios'
// import {
//   Box, FormControl, Button, Stack, Typography, TextField,
// } from '@mui/material'
// import { useState } from 'react'
// // import { useNavigate } from 'react-router-dom'
// // import { useNavigate, useSearchParams } from 'react-router-dom'
// // import { search } from '../../server/authRouter'

// // eslint-disable-next-line react/prop-types
// // eslint-disable-next-line no-unused-vars
// function InstructorCourses() {
//   // const navigate = useNavigate()
//   // const emailAddress = 'gansa@wharton.upenn.edu'
//   // const username = 'gansa'
//   // const firstName = 'Sam'
//   // const lastName = 'Gan'
//   const [name, setName] = useState('')
//   const [classCode, setClassCode] = useState('')
//   // const [profileImageUrl, setProfileImageUrl] = useState('')

//   // const handleClick = (event) => {
//   //   event.preventDefault();
//   //   let newArr = fileInput.current.files;
//   //   for (let i = 0; i < newArr.length; i++) {
//   //     handleUpload(newArr[i]);
//   //   }
//   // };

//   // const handleUpload = (file) => {
//   //   let newFileName = file.name.replace(/\..+$/, "");
//   //   const ReactS3Client = new S3(config);
//   //   ReactS3Client.uploadFile(file, newFileName).then((data) => {
//   //     if (data.status === 204) {
//   //       console.log("success");
//   //     } else {
//   //       console.log("fail");
//   //     }
//   //   });
//   // };

//   //   const handleSave = async () => {
//   //     if (!year || majors.length === 0 || school.length === 0) {
//   //       alert('Please complete all fields')
//   //       return
//   //     }
//   //     const { data } = await axios.post(`http://${config.server_host}:${config.server_port}/profile`, {
//   //       emailAddress, username, firstName, lastName, year, profileImageUrl, majors, school,
//   //     })
//   //     if (data === 'success') {
//   //       console.log('uploaded successfully')
//   //       navigate('/profile', {
//   //         firstName, lastName, majors, school, username, emailAddress, year, profileImageUrl,
//   //       })
//   //       // window.location.reload()
//   //       // useNavigate('/dashboard', { replace: true })
//   //     } else {
//   //       console.log(data)
//   //     }
//   //   }
//   return (
//     <Box
//       className="container h-screen mx-auto min-w-full bg-white"
//     >
//       <Stack spacing={2} alignItems="center" justifyContent="center" paddingTop={10}
// paddingBottom={10} paddingLeft={50} paddingRight={50}>
//         <Typography variant="h5" fullWidth> Enter Information for the Course </Typography>
//         <Stack />
//         <Stack />
//         <FormControl fullWidth>
//           <TextField
//             required
//             id="outlined-required"
//             label="Course Code"
//             value={classCode}
//             onChange={(e) => setClassCode(e.target.value)}
//           />
//           {/* <FormHelperText>Select your year</FormHelperText> */}
//         </FormControl>

//         <FormControl fullWidth>
//           <TextField
//             required
//             id="outlined-required"
//             label="Course Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           {/* <FormHelperText>Select your year</FormHelperText> */}
//         </FormControl>

//         <Button
//           fullWidth
//           variant="contained"
//                 // color="#D87731"
//         >
//           {' '}
//           Submit
//           {' '}

//         </Button>
//         {/* </Box> */}
//       </Stack>
//     </Box>
//   )
// }

// export default InstructorCourses

import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Stack, Grid,
} from '@mui/material'
import CourseCard from '../components/CourseCard'
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
                  <CourseCard
                    courseId={course.classCode}
                  />
                </Grid>
              ),
            )}
          </Grid>
        )}
        <AddCourseCard />
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
