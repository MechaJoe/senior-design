import { useEffect } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import GoogleButton from '../assets/google-button.png'

export default function LoginPage() {
  const navigate = useNavigate()
  const getUser = async () => {
    const { data } = await axios.get('http://localhost:8080/username', { withCredentials: true })
    if (data) {
      navigate('/')
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
      <Grid className="" container spacing={2} justifyContent="center" alignItems="center" direction="column" style={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Typography variant="h2" component="h1">
            Login to Socius
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <a href="http://localhost:8080/login/federated/google">
            <button type="button">
              <img className="max-w-full h-auto" src={GoogleButton} alt="google sign-in" />
            </button>
          </a>
        </Grid>
      </Grid>
    </Box>
  )
}
