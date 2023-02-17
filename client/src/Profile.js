/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/prop-types */
import axios from 'axios'
// import S3 from "react-aws-s3"
import {
  Box, Button, Modal, TextField, Typography, Stack,
} from '@mui/material'
// import { createTheme } from '@mui/material/styles'
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined'
import { useState } from 'react'
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
// import { useNavigate } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'
// const config = require('./config.json')
// eslint-disable-next-line react/prop-types
// eslint-disable-next-line no-unused-vars
// function Profile({
//  firstName, lastName, username, emailAddress, year, 
// }) {
// function Profile({ bio }) {
function Profile() {
  const emailAddress = 'gansa@wharton.upenn.edu'
  const username = 'gansa'
  const firstName = 'Sam'
  const lastName = 'Gan'
  const majors = ['FNCE']
  const school = ['WHARTON']
  const year = '2023'
  const [modal, setModal] = useState(false)
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
        <ProfileSidebar firstName={firstName} lastName={lastName} majors={majors} school={school} year={year} />
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
          display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', marginTop: '200px', marginBottom: '200px', marginLeft: '400px', marginRight: '400px',
        }}
        sx={{ border: 4, borderColor: 'black', borderRadius: 4 }}
      >
        <Stack fullWidth spacing={4} className="bg-white pt-10 min-h-full min-w-full rounded-xl">
          <Typography fullWidth variant="h8" alignItems="center" justifyContent="center" className="bg-skyblue py-5 text-center w-full">
            Add or modify your profile bio in the text box below
          </Typography>
          <TextField alignItems="center" justifyContent="center" placeholder="Enter bio here..." />
          <Stack direction="row" alignItems="center" justifyContent="right">
            <Button onClick={() => setModal(false)} variant="filled" className="text-black"> Close </Button>
            <Button onClick={handleEditBio} variant="filled"> Add </Button>
          </Stack>
        </Stack>
      </Modal>
    </Box>
  )
}

export default Profile
