import { useEffect } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import GoogleButton from '../assets/google-button.png'

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
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid container spacing={2} justifyContent="center" alignItems="center" direction="column" style={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Typography variant="h2" component="h1">
            Login to Socius
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <button type="button" href="http://localhost:8080/login/federated/google">
            <img className="button google" src={GoogleButton} alt="google sign-in" />
          </button>
        </Grid>
      </Grid>
    </Box>
  )
}
