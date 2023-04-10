/* eslint-disable react/jsx-props-no-spreading */
import Box from '@mui/material/Box'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import FullProfileCard from './FullProfileCard'
import GroupCard from './GroupCard'
// import GroupChatCard from './GroupChatCard'
// import LeaveGroupCard from './LeaveGroupCard'
import ConfirmModal from './ConfirmModal'
import { sendRequest, getGroupId } from '../../infoHelpers'

const theme = createTheme({
  palette: {
    primary: {
      main: '#03254E',
    },
  },
})

function TabPanel(props) {
  const { children, value, index } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default function GroupsPageTabsInstr(props) {
  const {
    // individuals,
    unassigned,
    grouped,
    requested,
    groupIds,
    classCode,
    assignmentId,
    groupSize,
  } = props
  const [value, setValue] = useState(0)
  const [requestShow, setRequestShow] = useState(false)
  const [toGroupId, setToGroupId] = useState('')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div className="min-w-full max-w-full pt-6">
      <ThemeProvider theme={theme}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="groups view tab selector"
            variant="fullWidth"
          >
            <Tab label="Individuals" {...a11yProps(1)} />
            <Tab label="All Groups" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          {/* Individuals */}
          {requestShow && (
          <ConfirmModal
            action="request"
            onClose={() => setRequestShow(false)}
            confirm={() => sendRequest(classCode, assignmentId, toGroupId)}
          />
          )}
          <ReactSearchAutocomplete
            placeholder="Search by name..."
            styling={
            {
              borderRadius: '16px',
            }
          }
          />
          <div className="grid laptop:grid-cols-3 grid-cols-2 gap-4 pt-4">
            {unassigned?.map((member) => (
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
            ))}
            {grouped?.map((member) => (
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
            ))}
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          {/* All Groups */}
          <div className="grid grid-cols-2 gap-4">
            {groupIds.map((g) => (
              <GroupCard
                key={g}
                groupId={g}
                classCode={classCode}
                assignmentId={assignmentId}
                groupSize={groupSize}
              />
            ))}
          </div>
        </TabPanel>
      </ThemeProvider>
    </div>
  )
}
