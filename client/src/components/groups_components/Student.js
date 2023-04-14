/* eslint-disable no-unused-vars */
import { useState } from 'react'
// import Card from '@mui/material/Card'
// import CardHeader from '@mui/material/CardHeader'
// import CardMedia from '@mui/material/CardMedia'
// import CardContent from '@mui/material/CardContent'
// import CardActions from '@mui/material/CardActions'
// import Avatar from '@mui/material/Avatar'
// import IconButton from '@mui/material/IconButton'
// import Typography from '@mui/material/Typography'
// import { red } from '@mui/material/colors'
// import FavoriteIcon from '@mui/icons-material/Favorite'
// import ShareIcon from '@mui/icons-material/Share'
// import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'
import {
  Stack, Typography, Button, Grid, Popover,
} from '@mui/material'
import { joinGroupInstr, getNonSingletonGroupIds } from '../../infoHelpers'

export default function Student(props) {
  // const [open, setOpen] = useState(false)
  const {
    classCode, assignmentId, student, groupIds, setGroupIds, unassigned, setUnassigned,
  } = props
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleAssignStudent = async (groupId, username) => {
    const { error } = joinGroupInstr(classCode, assignmentId, groupId, username)
    if (error) {
      console.log(error)
    } else {
      setUnassigned(unassigned.filter((stu) => stu.username !== username))
      setGroupIds(groupIds.map((group) => {
        if (group.id === groupId) {
          return ({ ...group, members: [...group.groupMembers, username] })
        }
        return group
      }))
    }
  }

  const open = Boolean(anchorEl)
  return (
    <Stack direction="row" className="pl-4">
      <Typography>
        {' '}
        {student.firstName}
        &nbsp;
        {student.lastName}
        {' '}
      </Typography>
      <Grid container justifyContent="flex-end">

        <Button onClick={handleClick}><AddIcon fontSize="small" /></Button>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Stack sx={{ paddingBottom: 1 }}>
            <Typography sx={{ p: 2 }}>Add to Group</Typography>
            {groupIds.map((g, index) => (
              <Button
                key={g.groupId}
                onClick={() => handleAssignStudent(g.groupId, student.username)}
                sx={{ paddingLeft: 1, paddingRight: 1 }}
              >
                <Typography id={g.groupId}>
                  Group
                  {' '}
                  {index + 1}
                </Typography>
              </Button>
            ))}
          </Stack>
        </Popover>

      </Grid>
    </Stack>
  )
}
