/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { useState } from 'react'
import axios from 'axios'
import {
  FormControl, Button, TextField, Typography, Box, Modal, Slider,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import config from '../config.json'

export default function EditAssignmentModal({
  assignmentId, deadlineDate, groupMinMax, classCode, editShow, setEditShow,
}) {
  const [assName, setAssName] = useState(assignmentId)
  const currentDate = new Date()
  const [deadline, setDeadline] = useState(deadlineDate.toISOString())
  const [groupSize, setGroupSize] = useState(groupMinMax)
  const handleClose = () => setEditShow(false)

  console.log(`Edit Show is: ${editShow}`)
  console.log(`DDate: ${deadlineDate.toISOString()}`)
  console.log(`Ass Name: ${assName}`)
  console.log(`Deadline: ${deadline}`)
  console.log(`Min: ${groupSize[0]}, Max: ${groupSize[1]}`)

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 450,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    m: 8,
    fontStyle: 'font-sans',
  }

  const handleCancelOnClick = () => setEditShow(false)

  const handleSaveOnClick = async () => {
    await axios.put(`http://${config.server_host}:${config.server_port}/class/${classCode}/assignments/${assName}`, { deadline, maxGroupSize: groupSize[1], minGroupSize: groupSize[0] })
    setEditShow(false)
  }

  return (
    <Modal
      open={editShow}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mt: 2 }} className="font-sans">
          Edit Assignment
        </Typography>
        <FormControl fullWidth>
          <TextField id="outlined-basic" value={assName} label="Assignment Name" variant="outlined" sx={{ mt: 4 }} onChange={(e) => setAssName(e.target.value)} />
        </FormControl>

        <FormControl fullWidth sx={{ my: 4 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Group Formation Deadline"
              // value={deadline}
              inputFormat="YYYY-MM-DDTHH:mm:ss. sssZ"
              onChange={(newDeadline) => {
                const date = new Date(newDeadline)
                setDeadline(date.toISOString())
              }}
            />
          </LocalizationProvider>
        </FormControl>

        <FormControl fullWidth>
          <h2> Group Size </h2>
          <Slider
            value={groupSize}
            min={1}
            max={10}
            step={1}
            onChange={(e, newValue) => setGroupSize(newValue)}
            valueLabelDisplay="auto"
            backgroundColor="red"
          />
        </FormControl>
        <div className="absolute right-0 mr-6 mt-4">
          <Button
            onClick={handleCancelOnClick}
            style={{
              margin: '15px', backgroundColor: '#CB5045', color: 'white',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveOnClick}
            style={{
              margin: '15px', backgroundColor: '#16681E', color: 'white',
            }}
          >
            Save
          </Button>
        </div>
      </Box>
    </Modal>
  )
}
