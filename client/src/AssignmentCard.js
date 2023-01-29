/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom'
import {
  Button, ButtonBase, Card, CardContent, Typography, Box,
} from '@mui/material'
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'

function AssignmentCard({
  classCode, assignmentId, deadline, groupInfo,
}) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  console.log(`Group Info: ${groupInfo}`)

  const deadlineDate = new Date(deadline)
  const deadlineString = deadlineDate.toLocaleDateString('en-us', options)
  const enterAssignment = () => {
    const path = `/courses/${classCode}/assignments/${assignmentId}`
    useNavigate(path)
  }

  return (
    <Card sx={{ width: 600, display: 'flex', justifyContent: 'left' }}>
      <Box sx={{ justifyContent: 'left' }}>
        <ButtonBase onClick={enterAssignment}>
          <CardContent sx={{ width: 500 }}>
            <Typography gutterBottom variant="h5" component="div">
              (
              <span style={{ fontSize: '28px' }}>{`Assignment ${assignmentId}`}</span>
              )
            </Typography>
            {
              groupInfo ? groupInfo.map((member) => (
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                  <AccountCircleOutlinedIcon />
                  <h3>
                    {member.firstName}
                    &nbsp;
                    {member.lastName}
                  </h3>
                </div>
              )) : null
            }
            <Button variant="outlined" startIcon={<ChatOutlinedIcon />}> Open Chat </Button>
            <Typography variant="body2" color="text.secondary">
              {deadlineString}
            </Typography>
          </CardContent>
        </ButtonBase>
      </Box>
    </Card>
  )
}

export default AssignmentCard
