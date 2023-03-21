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
import Header from './components/Header'
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
// eslint-disable-next-line react/prop-types
// eslint-disable-next-line no-unused-vars
// function Profile({
//  firstName, lastName, username, emailAddress, year,
// }) {
// function Profile({ bio }) {
function Profile() {
  const navigate = useNavigate()
  const [emailAddress, setEmailAddress] = useState('yuanb@seas.upenn.edu')
  const [username, setUsername] = useState('yuanb')
  const [firstName, setFirstName] = useState('Brandy')
  const [lastName, setLastName] = useState('Yuan')
  const [majors, setMajors] = useState(['CIS'])
  const [school, setSchool] = useState(['SEAS'])
  const [year, setYear] = useState('2023')
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const [modal, setModal] = useState(false)
  // const [fields, setFields] = useState({})
  // const {
  //   emailAddress, username, firstName, lastName, year, majors, school, // profileImageUrl,
  // } = fields
  const [bio, setBio] = useState('')

  const fetchData = async () => {
    const { data: [data] } = await axios.get(`http://localhost:${config.server_port}/profile`)
    if (data) {
      setEmailAddress(data.emailAddress)
      setUsername(data.username)
      setFirstName(data.firstName)
      setLastName(data.lastName)
      setProfileImageUrl(data.profileImageUrl)
      setYear(data.year)
      setMajors(data.majors.split(','))
      setSchool(data.schools.split(','))
      setBio(data.bio)
    } else {
      console.log(data)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  const handleEditBio = async () => {
    setBio(bio)
    if (!bio) {
      return
    }
    const { data } = await axios.post(`http://${config.server_host}:${config.server_port}/profile/edit`, {
      emailAddress, username, firstName, lastName, profileImageUrl, year, majors, school, bio,
    }, { withCredentials: true })
    if (data === 'success') {
      console.log('uploaded successfully')
      navigate('/profile', {
        firstName, lastName, majors, school, username, emailAddress, year, profileImageUrl, bio,
      })
      // window.location.reload()
      // useNavigate('/dashboard', { replace: true })
    } else {
      console.log(data)
    }
  }

  return (
    <Box
      className="container mx-auto min-w-full bg-white"
    >
      <Header />
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
          display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', marginTop: '200px', marginBottom: '200px', marginLeft: '400px', marginRight: '400px',
        }}
        sx={{ border: 4, borderColor: 'black', borderRadius: 4 }}
      >
        <Stack fullWidth spacing={4} className="bg-white pt-10 min-h-full min-w-full rounded-xl">
          <Typography fullWidth variant="h8" alignItems="center" justifyContent="center" className="bg-skyblue py-5 text-center w-full">
            Add or modify your profile bio in the text box below
          </Typography>
          <TextField alignItems="center" value={bio} onInput={(e) => setBio(e.target.value)} justifyContent="center" placeholder="Enter bio here..." />
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
