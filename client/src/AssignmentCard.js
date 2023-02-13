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
import config from './config.json'

function AssignmentCard({
  classCode, assignmentId, deadline,
}) {
  const [groupInfo, setGroupInfo] = useState([])
  const [groupSize, setGroupSize] = useState({})
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
    useNavigate(path)
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

  useEffect(() => {
    getGroupInfo().then((res) => {
      if (!res.length) {
        useNavigate('/')
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
        width: 600, display: 'flex', justifyContent: 'left', backgroundColor: '#E6DCC720', border: 6, borderColor: '#212D3B', borderRadius: 8,
      }}
    >
      <Box sx={{ justifyContent: 'left' }}>
        {
          groupInfo.length >= groupSize.minGroupSize
            ? <CheckCircleOutlineRoundedIcon /> : <ControlPointDuplicateRoundedIcon />
        }
        <ButtonBase onClick={enterAssignment}>
          <CardContent sx={{ width: 500 }}>
            <h1 className="font-bold text-2xl">
              {`Assignment ${assignmentId}`}
            </h1>
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
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
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
            <Button variant="outlined" startIcon={<ChatOutlinedIcon />}> Open Chat </Button>
            <p>
              Needs
              &nbsp;
              {groupSize.minGroupSize - groupInfo.length}
              -
              {groupSize.maxGroupSize - groupInfo.length}
              &nbsp;
              more teammates!
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
