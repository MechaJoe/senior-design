import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  const getUser = async () => {
    const { data } = await axios.get('http://localhost:8080/username', { withCredentials: true })
    if (!data) {
      navigate('/login')
    }
    return data
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <div className="container mx-auto bg-gunmetal rounded-xl shadow border p-8 m-10">
      <p className="text-4xl text-white font-bold mb-5">
        Welcome!
      </p>
      <p className="text-white text-lg">
        React and Tailwind CSS in action
      </p>
    </div>
  )
}
