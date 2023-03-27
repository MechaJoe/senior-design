/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  Button, ButtonBase, Card, CardContent, Typography, Box,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import config from '../config.json'

function AssignmentCard({
  classCode, assignmentId, deadline,
}) {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate()
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
        <ButtonBase>
          <CardContent sx={{ width: 350, height: 400 }}>
            <h1 className="font-bold text-2xl p-4" style={{ display: 'inline-block' }}>
              {`Assignment ${assignmentId}`}
            </h1>
            <div className="text-2xl" style={{ display: 'inline-block' }}>
              <EditIcon />
              <DeleteForeverIcon />
            </div>
            <Typography variant="body2" color="text.secondary">
              Group Formation Deadline:
              &nbsp;
              {deadlineString}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Minimum Group Size:
              &nbsp;
              {groupSize.minGroupSize}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Maximum Group Size:
              &nbsp;
              {groupSize.maxGroupSize}
            </Typography>
            <Button>
              View Groups
            </Button>
          </CardContent>
        </ButtonBase>
      </Box>
    </Card>
    // </div>
  )
}

export default AssignmentCard
