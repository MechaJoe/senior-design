import { AppBar, Toolbar } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import ChatIcon from '@mui/icons-material/Chat'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { Link, useParams } from 'react-router-dom'

export default function Header() {
  const { classCode, assignmentId } = useParams()

  return (
    <AppBar position="static" style={{ backgroundColor: '#03254E', borderBottom: 'solid white' }}>
      <Toolbar>
        <Link to="/courses">
          <h1 className="font-sans text-5xl font-bold">
            concourse
          </h1>
        </Link>
        <div className="absolute right-10 space-x-4">
          <Link to="/">
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
          <Link to="/logout">
            <LogoutIcon fontSize="large" />
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  )
}
