import { Button } from '@mui/material'
// import CloseIcon from '@mui/icons-material/Close'
// import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import IconButton from '@mui/material/IconButton'
import CancelIcon from '@mui/icons-material/Cancel'
// import ChatIcon from '@mui/icons-material/Chat'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RequestProfileCard from './RequestProfileCard'
import config from '../config.json'

export default function RequestCard({
  classCode, assignmentId, students, isIncoming,
}) {
  const handleAcceptOnClick = async () => {
    await Promise.all([
      axios.post(`http://${config.server_host}:${config.server_port}/accept-request`, { classCode, assignmentId, fromGroupId: students[0].groupId }),
      axios.post(`http://${config.server_host}:${config.server_port}/reject-request`, { classCode, assignmentId, fromGroupId: students[0].groupId }),
    ])
    window.location.reload()
  }

  const handleRejectOnClick = async () => {
    await axios.post(`http://${config.server_host}:${config.server_port}/reject-request`, { classCode, assignmentId, fromGroupId: students[0].groupId })
    window.location.reload()
  }

  const handleCancelOnClick = async () => {
    await axios.post(`http://${config.server_host}:${config.server_port}/cancel-request`, { classCode, assignmentId, toGroupId: students[0].groupId })
    window.location.reload()
  }
  return (
    <div className="bg-powderblue m-5 rounded-2xl">
      <div className="justify-center flex flex-row items-center">
        {
          students.length ? students.map((member) => (
            <RequestProfileCard
              key={member.username}
              firstName={member.firstName}
              lastName={member.lastName}
              emailAddress={member.emailAddress}
              profileImageUrl={member.profileImageUrl}
              year={member.year}
              majors={member.majors}
              schools={member.schools}
            />
          )) : null
        }
      </div>
      <div className="justify-center flex flex-row items-center mb-4">
        {/* <Button
          variant="contained"
          style={{
            margin: '15px', backgroundColor: '#16681E', color: 'white',
          }}
        >
          Accept
        </Button> */}
        {isIncoming ? (
          <>
            <IconButton onClick={handleAcceptOnClick}>
              <CheckCircleIcon style={{ color: '#16681E', fontSize: 60 }} />
            </IconButton>
            <IconButton onClick={handleRejectOnClick}>
              <CancelIcon style={{ color: '#CB5045', fontSize: 60 }} />
            </IconButton>
          </>
        )
          : (
            <Button
              onClick={handleCancelOnClick}
              variant="contained"
              style={{
                margin: '15px', backgroundColor: '#CB5045', color: 'white',
              }}
            >
              Cancel
            </Button>
          )}
        {/* <IconButton>
          <Avatar sx={{ width: '40px', height: '40px' }}>
            <ChatIcon style={{ color: '#162368', fontSize: 60 }} />
          </Avatar>
        </IconButton> */}

        {/* <Button
          variant="contained"
          startIcon={<CloseIcon />}
          style={{
            backgroundColor: '#CB5045', color: 'white', borderRadius: '180px', width: '10px',
          }}
        /> */}
        <Button
          variant="contained"
          style={{
            margin: '15px', backgroundColor: '#162368', color: 'white',
          }}
        >
          Chat
        </Button>
      </div>
    </div>
  )
}
