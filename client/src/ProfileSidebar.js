/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
// import { Box } from '@mui/material'
// import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
// import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import {
  Stack, Typography,
} from '@mui/material'

function ProfileSidebar({
  majors, school, year,
}) {
  return (

    <div className="bg-gunmetal w-1/4 h-screen font-sans text-white">
      <Stack spacing={4} alignItems="center" justifyContent="center">
        <div style={{
          height: '50px',
        }}
        />
        {/* <ModeEditOutlineOutlinedIcon justify="space-between" /> */}
        <div style={{
          padding: '60px',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          height: '250px',
          width: '250px',
          backgroundColor: '#E9EFF3',
          borderRadius: '50%',
        }}
        />
        <Typography variant="h7" fullWidth className="text-xl font-bold px-6 pt-2">
          <HomeOutlinedIcon />
          {' '}
          {school.join(', ')}
          {' '}
          {year}
          {' '}
        </Typography>
        <Typography variant="h7" fullWidth className="text-xl font-bold px-6 pt-2">
          <BuildOutlinedIcon />
          {' '}
          {majors.join(',')}
          {' '}
          Undergrad
        </Typography>
        <Typography variant="h7" fullWidth className="text-xl font-bold px-6 pt-2">
          <LocationOnOutlinedIcon />
          {' '}
          Philadelphia, PA
        </Typography>
      </Stack>
    </div>

  )
}

export default ProfileSidebar
