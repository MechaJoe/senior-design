import axios from 'axios'
import { AppBar, Toolbar } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import ChatIcon from '@mui/icons-material/Chat'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { baseUrl } from '../infoHelpers'

export default function Header() {
  const { classCode, assignmentId } = useParams()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await axios.post(`${baseUrl}/logout`)
    navigate('/login')
  }

  return (
    <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} style={{ backgroundColor: '#03254E', borderBottom: 'solid white' }}>
      <Toolbar>
        <Link to="/courses">
          <h1 className="font-sans text-5xl font-bold">
            concourse
          </h1>
        </Link>
        <div className="absolute right-10 space-x-4">
          <Link to="/chat">
            <ChatIcon fontSize="large" />
          </Link>
          {classCode && assignmentId
          && (
          <Link to={`/courses/${classCode}/assignments/${assignmentId}/requests`}>
            <NotificationsIcon fontSize="large" />
          </Link>
          )}
          <Link to="/profile">
            <AccountCircleIcon fontSize="large" />
          </Link>
          <button type="button" onClick={handleLogout}>
            <LogoutIcon fontSize="large" />
          </button>
        </div>
      </Toolbar>
    </AppBar>
  )
}
