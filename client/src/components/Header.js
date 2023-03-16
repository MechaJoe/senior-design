import {
  AppBar,
  Toolbar,
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import ChatIcon from '@mui/icons-material/Chat'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} style={{ backgroundColor: '#03254E', borderBottom: 'solid white' }}>
      <Toolbar>
        <h1 className="font-sans text-5xl font-bold">
          concourse
        </h1>
        {/* <Typography variant="h3" className="font-sans">
          concourse
        </Typography> */}
        <div className="absolute right-10 space-x-4">
          <Link to="/">
            <ChatIcon fontSize="large" />
          </Link>
          <Link to="/about">
            <NotificationsIcon fontSize="large" />
          </Link>
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
