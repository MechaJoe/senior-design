import { useEffect } from 'react'
import axios from 'axios'
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
    <div
      className="container mx-auto bg-gunmetal min-w-full pb-4 justify-center items-center"
    >
      <Grid className="" container spacing={0} justifyContent="space-evenly" alignItems="center" direction="column" style={{ minHeight: '100vh' }}>
        <Grid item xs={6}>
          <div className="text-white text-4xl font-sans">
            Login to Concourse
          </div>
        </Grid>
        <Grid item xs={6}>
          <a href="http://localhost:8080/login/federated/google">
            <button type="button">
              <img className="object-scale-down h-16 w-auto" src={GoogleButton} alt="google sign-in" />
            </button>
          </a>
        </Grid>
      </Grid>
    </div>
  )
}
