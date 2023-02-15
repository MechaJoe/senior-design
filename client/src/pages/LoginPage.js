import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
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
      className="flex container mx-auto bg-porcelain min-w-full min-h-screen pb-4 justify-center items-center"
    >
      <div className="flex flex-col justify-center items-center rounded-lg bg-white max-w-xl p-6 text-center">
        <div className="text-4xl font-sans p-6 pt-12 pb-12">
          Log In to Concourse
        </div>
        <a className="p-6 pb-12" href="http://localhost:8080/login/federated/google">
          <button type="button">
            <img className="object-scale-down h-16 w-auto" src={GoogleButton} alt="google sign-in" />
          </button>
        </a>
      </div>
    </div>
  )
}
