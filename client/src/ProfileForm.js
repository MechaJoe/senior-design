import axios from 'axios'
import {
  Box, Select, MenuItem, FormControl, InputLabel, Chip, Button, Stack, Typography,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const config = require('./config.json')

function ProfileForm() {
  const [searchParams] = useSearchParams()
  const {
    emailAddress, username, firstName, lastName,
  } = Object.fromEntries(searchParams)
  const navigate = useNavigate()
  const profileImageUrl = ''
  const [year, setYear] = useState('')
  const [majors, setMajors] = useState([])
  const [school, setSchool] = useState([])

  const handleSave = async () => {
    if (!year || majors.length === 0 || school.length === 0) {
      return
    }
    const { data } = await axios.post(`http://${config.server_host}:${config.server_port}/profile`, {
      emailAddress, username, firstName, lastName, year, profileImageUrl, majors, school,
    })
    if (data === 'success') {
      console.log('uploaded successfully')
      navigate('/profile', {
        firstName, lastName, majors, school, username, emailAddress, year, profileImageUrl,
      })
    } else {
      console.log(data)
    }
  }
  return (
    <Box
      className="container h-screen mx-auto min-w-full bg-white"
    >
      <Stack spacing={2} alignItems="center" justifyContent="center" paddingTop={10} paddingBottom={10} paddingLeft={50} paddingRight={50}>
        <Typography variant="h3" fullWidth>
          Welcome,
          {' '}
          {firstName}
        </Typography>
        <Typography variant="h5" fullWidth> Let&apos;s start your profile to help you find your team! </Typography>
        <Stack />
        <Stack />
        <FormControl fullWidth>
          <InputLabel>Year</InputLabel>
          <Select
            value={year}
            label="Year"
            onChange={(e) => setYear(e.target.value)}
          >
            <MenuItem value={2023}>2023</MenuItem>
            <MenuItem value={2024}>2024</MenuItem>
            <MenuItem value={2025}>2025</MenuItem>
            <MenuItem value={2026}>2026</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel> Major(s)</InputLabel>
          <Select
            multiple
            value={majors}
            label="Major(s)"
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
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>School(s)</InputLabel>
          <Select
            multiple
            value={school}
            label="School(s)"
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
        </FormControl>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSave}
        >
          {' '}
          Next
          {' '}

        </Button>
      </Stack>
    </Box>
  )
}

export default ProfileForm
