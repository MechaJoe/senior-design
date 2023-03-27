// import axios from 'axios'
import {
  Box, FormControl, Button, Stack, Typography, TextField,
} from '@mui/material'
import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useNavigate, useSearchParams } from 'react-router-dom'
// import { search } from '../../server/authRouter'

// eslint-disable-next-line react/prop-types
// eslint-disable-next-line no-unused-vars
function InstructorCourses() {
  // const navigate = useNavigate()
  // const emailAddress = 'gansa@wharton.upenn.edu'
  // const username = 'gansa'
  // const firstName = 'Sam'
  // const lastName = 'Gan'
  const [name, setName] = useState('')
  const [classCode, setClassCode] = useState('')
  // const [profileImageUrl, setProfileImageUrl] = useState('')

  // const handleClick = (event) => {
  //   event.preventDefault();
  //   let newArr = fileInput.current.files;
  //   for (let i = 0; i < newArr.length; i++) {
  //     handleUpload(newArr[i]);
  //   }
  // };

  // const handleUpload = (file) => {
  //   let newFileName = file.name.replace(/\..+$/, "");
  //   const ReactS3Client = new S3(config);
  //   ReactS3Client.uploadFile(file, newFileName).then((data) => {
  //     if (data.status === 204) {
  //       console.log("success");
  //     } else {
  //       console.log("fail");
  //     }
  //   });
  // };

  //   const handleSave = async () => {
  //     if (!year || majors.length === 0 || school.length === 0) {
  //       alert('Please complete all fields')
  //       return
  //     }
  //     const { data } = await axios.post(`http://${config.server_host}:${config.server_port}/profile`, {
  //       emailAddress, username, firstName, lastName, year, profileImageUrl, majors, school,
  //     })
  //     if (data === 'success') {
  //       console.log('uploaded successfully')
  //       navigate('/profile', {
  //         firstName, lastName, majors, school, username, emailAddress, year, profileImageUrl,
  //       })
  //       // window.location.reload()
  //       // useNavigate('/dashboard', { replace: true })
  //     } else {
  //       console.log(data)
  //     }
  //   }
  return (
    <Box
      className="container h-screen mx-auto min-w-full bg-white"
    >
      <Stack spacing={2} alignItems="center" justifyContent="center" paddingTop={10} paddingBottom={10} paddingLeft={50} paddingRight={50}>
        <Typography variant="h5" fullWidth> Enter Information for the Course </Typography>
        <Stack />
        <Stack />
        <FormControl fullWidth>
          <TextField
            required
            id="outlined-required"
            label="Course Code"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
          />
          {/* <FormHelperText>Select your year</FormHelperText> */}
        </FormControl>

        <FormControl fullWidth>
          <TextField
            required
            id="outlined-required"
            label="Course Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {/* <FormHelperText>Select your year</FormHelperText> */}
        </FormControl>

        <Button
          fullWidth
          variant="contained"
                // color="#D87731"
        >
          {' '}
          Submit
          {' '}

        </Button>
        {/* </Box> */}
      </Stack>
    </Box>
  )
}

export default InstructorCourses
