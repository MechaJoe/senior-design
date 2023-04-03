import {
  Typography,
} from '@mui/material'

function Initials({ firstName, lastName }) {
  return (
    <div
      className="flex h-screen items-center justify-center"
      style={{
        height: '250px',
        width: '250px',
        backgroundColor: 'skyblue',
        borderRadius: '50%',
      }}

    >
      <Typography variant="h1" fullWidth className="text-xl font-bold px-6 pt-2">
        {firstName[0]}
        {lastName[0]}
      </Typography>
    </div>
  )
}

export default Initials
