import { useEffect } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import Grid from '@mui/material/Grid'

export default function LoginPage() {
  const history = useNavigate()

  const getUser = async () => {
    const { data } = await axios.get('http://localhost:8080/username', { withCredentials: true })
    if (data) {
      history.push('/me')
    }
    return data
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <Box
      className="container mx-auto bg-blue-200 min-w-full pb-4"
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid className="" container spacing={2} justifyContent="center" alignItems="center" style={{ minHeight: '100vh', margin: 2 }}>
        <Grid item xs={3}>
          <Typography variant="h2" component="h1">
            Sidebar
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="h2" component="h1">
            Assignments
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}
