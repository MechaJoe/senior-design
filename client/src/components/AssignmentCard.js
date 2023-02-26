/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  Button, ButtonBase, Card, CardContent, Typography, Box,
} from '@mui/material'
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import ControlPointDuplicateRoundedIcon from '@mui/icons-material/ControlPointDuplicateRounded'
import config from '../config.json'

function AssignmentCard({
  classCode, assignmentId, deadline,
}) {
  const navigate = useNavigate()
  const [groupInfo, setGroupInfo] = useState([])
  const [groupSize, setGroupSize] = useState({})
  const [shadow, setShadow] = useState(1)

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  const deadlineDate = new Date(deadline)
  const deadlineString = deadlineDate.toLocaleDateString('en-us', options)
  const enterAssignment = () => {
    const path = `/courses/${classCode}/assignments/${assignmentId}`
    navigate(path)
  }
  const getGroupInfo = async () => {
    const { data } = await axios.get(
      `http://${config.server_host}:${config.server_port}/class/${classCode}/assignments/${assignmentId}/my-group-info`,
      { withCredentials: true },
    )
    return data
  }

  const getGroupSize = async () => {
    const { data } = await axios.get(
      `http://${config.server_host}:${config.server_port}/class/${classCode}/assignments/${assignmentId}/groupSize`,
      { withCredentials: true },
    )
    return data
  }

  const onMouseOver = () => setShadow(20)
  const onMouseOut = () => setShadow(1)

  useEffect(() => {
    getGroupInfo().then((res) => {
      if (!res.length) {
        navigate('/')
      }
      setGroupInfo(res)
    })
    getGroupSize().then((res) => {
      setGroupSize(res)
    })
  }, [])

  return (
    // <div className="bg-rust-500">
    <Card
      className="bg-rust-500"
      sx={{
        // NOTE: it doesn't use tailwind css's defined color
        width: 350, height: 400, display: 'flex', justifyContent: 'center', backgroundColor: '#E6DCC740', border: 6, borderColor: '#212D3B', borderRadius: 8, margin: '30px',
      }}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      zDepth={shadow}
    >
      <Box sx={{ justifyContent: 'left', width: 350, height: 400 }}>
        <ButtonBase onClick={enterAssignment}>
          <CardContent sx={{ width: 350, height: 400 }}>
            <h1 className="font-bold text-2xl p-4" style={{ display: 'inline-block' }}>
              {`Assignment ${assignmentId}`}
            </h1>
            <div className="text-2xl" style={{ display: 'inline-block' }}>
              {
                groupInfo.length >= groupSize.minGroupSize
                  ? <CheckCircleOutlineRoundedIcon fontSize="large" style={{ color: '#10981D' }} /> : <ControlPointDuplicateRoundedIcon fontSize="large" style={{ color: '#FBBC02' }} />
              }
            </div>
            {/* <Typography gutterBottom variant="h5" component="div">
              (
              {`Assignment ${assignmentId}`}
              )
            </Typography> */}
            {/* <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              {groupInfo ? groupInfo.map((member) => (
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                  <AccountCircleOutlinedIcon />
                  <h3>
                    &nbsp;
                    {member.firstName}
                    &nbsp;
                    {member.lastName}
                  </h3>
                </div>
              )) : null}

            </div> */}
            {
              groupInfo ? groupInfo.map((member) => (
                <div className="pl-8 pt-2 pb-2 pr-2" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                  <AccountCircleOutlinedIcon />
                  <h3>
                    &nbsp;
                    {member.firstName}
                    &nbsp;
                    {member.lastName}
                  </h3>
                </div>
              )) : null
            }
            <Button
              variant="contained"
              startIcon={<ChatOutlinedIcon />}
              style={{
                margin: '15px', backgroundColor: 'white', color: 'black',
              }}
            >
              Open Chat
            </Button>
            <p>
              {groupSize.maxGroupSize - groupInfo.length}
              &nbsp;
              slot(s) available!
            </p>
            <Typography variant="body2" color="text.secondary">
              Due:
              &nbsp;
              {deadlineString}
            </Typography>
          </CardContent>
        </ButtonBase>
      </Box>
    </Card>
    // </div>
  )
}

export default AssignmentCard
