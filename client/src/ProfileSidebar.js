// import { Box } from '@mui/material'
// import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import {
  Stack, Typography,
} from '@mui/material'
import Initials from './Initials'
// import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'

function ProfileSidebar({
  firstName, lastName, majors, school, year,
}) {
  return (

    <div className="bg-gunmetal w-1/4 h-screen font-sans text-white">
      <Stack spacing={4} alignItems="center" justifyContent="center">
        <div style={{
          height: '50px',
        }}
        />
        {/* <ModeEditOutlineOutlinedIcon justify="space-between" /> */}
        <Initials firstName={firstName} lastName={lastName} />
        <Typography variant="h7" fullWidth className="text-xl font-bold px-6 pt-2">
          <HomeOutlinedIcon />
          {' '}
          {[school]?.join(', ')}
          {' '}
          {year}
          {' '}
        </Typography>
        <Typography variant="h7" fullWidth className="text-xl font-bold px-6 pt-2">
          <BuildOutlinedIcon />
          {' '}
          {[majors]?.join(',')}
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
