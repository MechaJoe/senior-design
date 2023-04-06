import { useState, useEffect } from 'react'
import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
import {
  Button, ButtonBase, Card, CardContent, Box, IconButton,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditAssignmentModal from './EditAssignmentModal'
import config from '../config.json'

function AssignmentCard({
  classCode, assignmentId, deadline,
}) {
  // const navigate = useNavigate()
  const [groupSize, setGroupSize] = useState({})
  const [shadow, setShadow] = useState(1)
  const [editShow, setEditShow] = useState(false)

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

  const handleEditOnClick = () => {
    console.log('I am editing')
    setEditShow(true)
    console.log(`EditShow is: ${editShow}`)
  }

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
        width: 350, height: 340, display: 'flex', justifyContent: 'center', backgroundColor: '#E6DCC740', border: 6, borderColor: '#212D3B', borderRadius: 8, margin: '30px',
      }}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      zDepth={shadow}
    >
      <Box sx={{ justifyContent: 'left', width: 350, height: 340 }}>
        <ButtonBase>
          <CardContent sx={{ width: 350, height: 340 }}>
            <h1 className="font-bold text-2xl p-4" style={{ display: 'inline-block' }}>
              {`Assignment ${assignmentId}`}
            </h1>
            <div className="text-center space-y-4">
              <div className="text-left space-y-2" style={{ display: 'inline-block' }}>
                <h2>
                  <b>Group Formation Deadline:</b>
                  <br />
                  {deadlineString}
                </h2>
                <h2>
                  <b>Minimum Group Size:</b>
                  &nbsp;
                  {groupSize.minGroupSize}
                </h2>
                <h2>
                  <b>Maximum Group Size:</b>
                  &nbsp;
                  {groupSize.maxGroupSize}
                </h2>
              </div>
              <Button>
                View Groups
              </Button>
            </div>
            <div className="text-2xl" style={{ display: 'inline-block' }}>
              {/* TODO: Add onclick later */}
              <EditAssignmentModal
                assName={assignmentId}
                deadlineDate={deadlineDate}
                groupMinMax={groupSize}
                classCode={classCode}
                editShow={editShow}
                setEditShow={setEditShow}
              />
              <IconButton>
                <EditIcon
                  style={{ color: '#227FEC', fontSize: 40 }}
                  onClick={handleEditOnClick}
                />
              </IconButton>
              <IconButton>
                <DeleteForeverIcon style={{ color: '#CB5045', fontSize: 40 }} />
              </IconButton>
            </div>
          </CardContent>
        </ButtonBase>
      </Box>
    </Card>
    // </div>
  )
}

export default AssignmentCard
