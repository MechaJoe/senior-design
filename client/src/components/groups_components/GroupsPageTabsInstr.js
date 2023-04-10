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
import { useState } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import FullProfileCard from './FullProfileCard'
import GroupCard from './GroupCard'
// import GroupChatCard from './GroupChatCard'
// import LeaveGroupCard from './LeaveGroupCard'
import ConfirmModal from './ConfirmModal'
import Student from './Student'
import { sendRequest, getGroupId } from '../../infoHelpers'

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
    grouped,
    requested,
    groupIds,
    classCode,
    assignmentId,
    groupSize,
  } = props
  // const [value, setValue] = useState(0)
  const [requestShow, setRequestShow] = useState(false)
  const [toGroupId, setToGroupId] = useState('')

  // const handleChange = (event, newValue) => {
  //   setValue(newValue)
  // }

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
                {groupIds.map((g, index) => (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>
                        Group
                        {' '}
                        {index + 1}

                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <GroupCard
                        key={g}
                        groupId={g}
                        classCode={classCode}
                        assignmentId={assignmentId}
                        groupSize={groupSize}
                      />
                    </AccordionDetails>
                  </Accordion>

                ))}
              </Stack>
            </Grid>
          </Grid>
          {/* {unassigned?.map((member) => (
              <FullProfileCard
                classCode={classCode}
                assignmentId={assignmentId}
                username={member.username}
                key={member.username}
                firstName={member.firstName}
                lastName={member.lastName}
                emailAddress={member.emailAddress}
                profileImageUrl={member.profileImageUrl}
                year={member.year}
                majors={member.majors}
                schools={member.schools}
                showModal={async () => {
                  setRequestShow(true)
                  const tgid = await getGroupId(classCode, assignmentId, member.username)
                  setToGroupId(tgid)
                }}
                requested={requested?.has(member.username)}
              />
            ))} */}
          {/* {grouped?.map((member) => (
              <FullProfileCard
                username={member.username}
                key={member.username}
                firstName={member.firstName}
                lastName={member.lastName}
                emailAddress={member.emailAddress}
                profileImageUrl={member.profileImageUrl}
                year={member.year}
                majors={member.majors}
                schools={member.schools}
                grayed
              />
            ))} */}
        </Stack>
      </ThemeProvider>
    </div>
  )
}
