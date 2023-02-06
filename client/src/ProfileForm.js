/* eslint-disable no-trailing-spaces */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/prop-types */
import axios from 'axios'
// import S3 from "react-aws-s3"
import {
  Select, MenuItem, FormControl, InputLabel, Chip, Button, Stack, Typography,
} from '@mui/material'
import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'
const config = require('./config.json')
// eslint-disable-next-line react/prop-types
// eslint-disable-next-line no-unused-vars
function ProfileForm({ userObj }) {
  // const fileInput = React.useRef()
  // const {
  //   emailAddress, username, firstName, lastName,
  // } = userObj
  // const baseUrl = 'http://localhost:8080'
  const [pt1, setPt1] = useState(true)
  const emailAddress = 'gansa@wharton.upenn.edu'
  const username = 'gansa'
  const firstName = 'Sam'
  const lastName = 'Gan'
  const profileImageUrl = ''
  // const [year, setYear] = useState(userObj.year)
  const [year, setYear] = useState('')
  // const [profileImageUrl, setProfileImageUrl] = useState('')
  const [majors, setMajors] = useState([])
  const [school, setSchool] = useState([])

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

  const handleSave = async () => {
    if (!year || majors.length === 0 || school.length === 0) {
      alert('Please complete all fields')
      return
    }
    console.log('mhm')
    const { data } = await axios.post(`http://${config.server_host}:${config.server_port}/profile`, {
      emailAddress, username, firstName, lastName, year, profileImageUrl, majors, school,
    }, { withCredentials: true })
    if (data === 'success') {
      console.log('uploaded successfully')
      // useNavigate('/courses')
      // window.location.reload()
      // useNavigate('/dashboard', { replace: true })
    } else {
      console.log(data)
    }
  }
  return (
    pt1 ?
      <Stack spacing={2} alignItems="center" justifyContent="center">
        <Typography variant="h3" fullWidth>
          {' '}
          Welcome,
          {firstName}
        </Typography>
        <Typography variant="h5" fullWidth> Start your profile to help you find your team! </Typography>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Year</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={year}
            label="Year"
            onChange={(e) => setYear(e.target.value)}
          >
            <MenuItem value={2023}>2023</MenuItem>
            <MenuItem value={2024}>2024</MenuItem>
            <MenuItem value={2025}>2025</MenuItem>
            <MenuItem value={2026}>2026</MenuItem>
          </Select>
          {/* <FormHelperText>Select your year</FormHelperText> */}
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label"> Major(s)</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            multiple
            value={majors}
            onChange={(e) => setMajors(e.target.value)}
            renderValue={(m) => (
              <div>
                {m.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </div>
            )}
          >
            <MenuItem value="CIS">CIS</MenuItem>
            <MenuItem value="EE">EE</MenuItem>
            <MenuItem value="ASAM">ASAM</MenuItem>
            <MenuItem value="BE">BE</MenuItem>
            <MenuItem value="FNCE">FNCE</MenuItem>
            <MenuItem value="MATH">MATH</MenuItem>
          </Select>
          {/* <FormHelperText>Select your major(s)</FormHelperText> */}
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>School(s)</InputLabel>
          <Select
            multiple
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            renderValue={(s) => (
              <div>
                {s.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </div>
            )}
          >
            <MenuItem value="SEAS">SEAS</MenuItem>
            <MenuItem value="SAS">SAS</MenuItem>
            <MenuItem value="WHARTON">WHARTON</MenuItem>
            <MenuItem value="NURSING">NURSING</MenuItem>
          </Select>
          {/* <FormHelperText>Select your school(s)</FormHelperText> */}
        </FormControl>
        <Button fullWidth onClick={() => setPt1(false)}> Next </Button>
      </Stack> :
      <Stack spacing={2} alignItems="center" justifyContent="center">
        <Typography variant="h3" fullWidth>
          Add a profile photo!
        </Typography>
        <Button
          variant="contained"
          component="label"
        >
          Add a photo
          <input
            type="file"
            hidden
          />
        </Button>
        <Button fullWidth onClick={handleSave}> Skip </Button>
      </Stack>

  )
}

export default ProfileForm
