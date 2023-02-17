/* eslint-disable no-unused-vars */
import axios from 'axios'
// import S3 from "react-aws-s3"
import {
  Box, Button, Modal, TextField, Typography, Stack,
} from '@mui/material'
// import { createTheme } from '@mui/material/styles'
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import config from './config.json'
import ProfileSidebar from './ProfileSidebar'
// import { createTheme } from '@mui/material/styles'
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: purple[500],
//     },
//     secondary: {
//       main: '#f44336',
//     },
//   },
// })
function Profile() {
  const navigate = useNavigate()
  const [modal, setModal] = useState(false)
  const [fields, setFields] = useState({})
  const {
    emailAddress, username, firstName, lastName, year, majors, school, // profileImageUrl,
  } = fields

  const fetchData = async () => {
    const { data } = await axios.get(`http://localhost:${config.server_port}/username`)
    if (!data) {
      navigate('/login')
    }
    const { data: { results: [userData] } } = await axios.get(`http://localhost:${config.server_port}/users/${data}`)
    console.log(userData)
    setFields(userData)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // const [bio, setBio] = useState(bio)
  const [bio, setBio] = useState('')
  const handleEditBio = async () => {
    if (!bio) {
      return
    }
    console.log('mhm')
    // const { data } = await axios.post(`http://${config.server_host}:${config.server_port}/profile`, {
    //   emailAddress, username, firstName, lastName, year, profileImageUrl, majors, school,
    // }, { withCredentials: true })
    // if (data === 'success') {
    //   console.log('uploaded successfully')
    //   setModal(false)
    //   // window.location.reload()
    //   // useNavigate('/dashboard', { replace: true })
    // } else {
    //   console.log(data)
    // }
  }

  return (
    <Box
      className="container mx-auto min-w-full bg-white"
    >
      {/* // eslint-disable-next-line react/jsx-indent */}
      <div className="flex flex-row min-h-screen">
        <ProfileSidebar
          firstName={firstName}
          lastName={lastName}
          majors={majors}
          school={school}
          year={year}
        />
        <Stack marginTop={20} marginLeft={10} spacing={6}>
          <Stack spacing={2}>
            {/* <div className="flex flex-col p-6"> */}
            <Typography variant="h3" fullWidth>
              {firstName}
              {' '}
              {lastName}
            </Typography>
            <Typography variant="h8" fullWidth>
              Add a bio...
              {' '}
              <Button onClick={() => setModal(true)}>
                {' '}
                <ModeOutlinedIcon />
              </Button>

            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h6" fullWidth>
              Username
            </Typography>
            <Typography variant="h8" fullWidth>
              {username}
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h6" fullWidth>
              Email
            </Typography>
            <Typography variant="h8" fullWidth>
              {emailAddress}
            </Typography>
            {/* </div> */}
          </Stack>
        </Stack>

      </div>
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', marginTop: '200px', marginBottom: '200px', marginLeft: '300px', marginRight: '300px', borderRadius: 25,
        }}
      >
        <Stack fullWidth spacing={4} alignItems="center" justifyContent="center" className="bg-white p-10 mx-auto min-h-full min-w-full rounded-xl">
          <Typography fullWidth variant="h8">
            Add or modify your profile bio in the text box below
          </Typography>
          <TextField fullWidth id="outlined-basic" variant="outlined" placeholder="Enter bio here..." />
          <Button onClick={() => setModal(false)}> Close </Button>
          <Button onClick={handleEditBio}> Add </Button>
        </Stack>
      </Modal>
    </Box>
  )
}

export default Profile
