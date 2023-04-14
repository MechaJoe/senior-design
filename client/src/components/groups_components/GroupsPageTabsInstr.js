/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
// import Box from '@mui/material/Box'
import { createTheme, ThemeProvider } from '@mui/material/styles'
// import Tabs from '@mui/material/Tabs'
// import Tab from '@mui/material/Tab'
import {
  Stack, Grid, Item, Typography, Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useState, useEffect } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import FullProfileCard from './FullProfileCard'
import GroupCardInstr from './GroupCardInstr'
// import GroupChatCard from './GroupChatCard'
// import LeaveGroupCard from './LeaveGroupCard'
import ConfirmModal from './ConfirmModal'
import Student from './Student'
import { sendRequest, getGroupId, getMembers } from '../../infoHelpers'

const theme = createTheme({
  palette: {
    primary: {
      main: '#03254E',
    },
  },
})

export default function GroupsPageTabsInstr(props) {
  const {
    unassigned,
    setUnassigned,
    grouped,
    requested,
    groupIds,
    setGroupIds,
    classCode,
    assignmentId,
    groupSize,
  } = props
  // const [value, setValue] = useState(0)
  const [requestShow, setRequestShow] = useState(false)
  const [toGroupId, setToGroupId] = useState('')
  const [groupMembers, setGroupMembers] = useState([])
  const items = unassigned.map(
    (student) => ({
      id: student.username,
      name: `${student.firstName} ${student.lastName}`,
    }),
  )

  useEffect(() => {
    groupIds.forEach((g, i) => {
      let members = []
      getMembers(classCode, assignmentId, g.groupId).then((data) => {
        if (data && data !== []) {
          console.log(data)
          members = [...members, data]
        } else {
          console.log('no group found')
        }
      })
      return { ...g, members }
    })
  }, [])

  return (
    <div className="min-w-full max-w-full pt-6">
      <ThemeProvider theme={theme}>
        {requestShow && (
          <ConfirmModal
            action="request"
            onClose={() => setRequestShow(false)}
            confirm={() => sendRequest(classCode, assignmentId, toGroupId)}
          />
        )}
        <Stack direction="row">
          <Grid container spacing={2}>
            <Grid item xs={6} md={5}>
              <Stack spacing={2}>
                <Typography variant="h6">
                  Unassigned Students (
                  {
                    unassigned.length
                  }
                  )
                </Typography>
                <ReactSearchAutocomplete
                  placeholder="Search by name..."
                  items={items}
                  styling={
                    {
                      borderRadius: '16px',
                    }
                  }
                />
                {unassigned?.map((student) => (
                  <Student
                    classCode={classCode}
                    assignmentId={assignmentId}
                    student={student}
                    groupIds={groupIds}
                    setGroupIds={setGroupIds}
                    unassigned={unassigned}
                    setUnassigned={setUnassigned}
                  />
                ))}
              </Stack>
            </Grid>
            <Grid item xs={6} md={7}>
              <Stack spacing={2}>
                <Typography variant="h6">
                  Groups (
                  {groupIds.length}
                  )
                </Typography>
                {groupIds.map((g, index) => {
                  getMembers(classCode, assignmentId, g.groupId).then((data) => {
                    if (data && data !== []) {
                      console.log(data)
                      setGroupMembers(data)
                    } else {
                      console.log('no group found')
                    }
                  })
                  return (
                    <Accordion key={g.groupId}>
                      <AccordionSummary
                        key={g.groupId}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography key={g.groupId}>
                          Group
                          {' '}
                          {index + 1}

                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails key={g.groupId}>
                        <GroupCardInstr
                          key={g.groupId}
                          groupMembers={groupMembers}
                          groupId={g.groupId}
                          classCode={classCode}
                          assignmentId={assignmentId}
                          groupSize={groupSize}
                        />
                      </AccordionDetails>
                    </Accordion>
                  )
                })}
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </ThemeProvider>
    </div>
  )
}
