/* eslint-disable react/jsx-props-no-spreading */
import Box from '@mui/material/Box'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import RequestCard from '../components/RequestCard'
import config from '../config.json'

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

function RequestsPage() {
  let classCode = window.location.href.split('/')[4]
  classCode = decodeURI(classCode)
  let assignmentId = window.location.href.split('/')[6]
  assignmentId = decodeURI(assignmentId)
  const [instructors, setInstructors] = useState([])
  const [className, setClassName] = useState('')
  const [individualRequests, setIndividualRequests] = useState([])
  const [outgoingIndividualRequests, setOutgoingIndividualRequests] = useState([])
  const [groupToMembers, setGroupToMembers] = useState({})
  const [outgoingGroupToMembers, setOutgoingGroupToMembers] = useState({})
  const [value, setValue] = useState(0)

  const isIncoming = true

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  // const navigate = useNavigate()

  const getUser = async () => {
    const { data } = await axios.get('http://localhost:8080/username', { withCredentials: true })
    if (!data) {
      // navigate('/login')
    }
    return data
  }

  const getInstructorInfo = async () => {
    const { data } = await axios.get(
      `http://${config.server_host}:${config.server_port}/class/${classCode}/instructor`,
      { withCredentials: true },
    )
    return data
  }

  const getClassName = async () => {
    const { data } = await axios.get(
      `http://${config.server_host}:${config.server_port}/class/${classCode}`,
      { withCredentials: true },
    )
    return data
  }

  const getIndividualRequests = async () => {
    const { data } = await axios.get(
      `http://${config.server_host}:${config.server_port}/class/${classCode}/assignments/${assignmentId}/requests/individuals`,
      { withCredentials: true },
    )
    return data
  }

  const getOutgoingIndividualRequests = async () => {
    const { data } = await axios.get(
      `http://${config.server_host}:${config.server_port}/class/${classCode}/assignments/${assignmentId}/requests/outgoing/individuals`,
      { withCredentials: true },
    )
    return data
  }

  const getGroupRequests = async () => {
    const { data } = await axios.get(
      `http://${config.server_host}:${config.server_port}/class/${classCode}/assignments/${assignmentId}/requests/groups`,
      { withCredentials: true },
    )
    const groupDict = {}
    if (data) {
      const groups = new Set()
      data.forEach((student) => {
        groups.add(student.groupId)
      })
      groups.forEach((groupId) => {
        const members = data.filter((member) => member.groupId === groupId)
        groupDict[groupId] = members
      })
    }
    return groupDict
  }

  const getOutgoingGroupRequests = async () => {
    const { data } = await axios.get(
      `http://${config.server_host}:${config.server_port}/class/${classCode}/assignments/${assignmentId}/requests/outgoing/groups`,
      { withCredentials: true },
    )
    const groupDict = {}
    if (data) {
      const groups = new Set()
      data.forEach((student) => {
        groups.add(student.groupId)
      })
      groups.forEach((groupId) => {
        const members = data.filter((member) => member.groupId === groupId)
        groupDict[groupId] = members
      })
    }
    return groupDict
  }

  useEffect(() => {
    getUser()
    getInstructorInfo().then((res) => {
      setInstructors(res)
    })
    getClassName().then((res) => {
      setClassName(res.results[0].className)
    })
    getIndividualRequests().then((res) => {
      setIndividualRequests(res)
    })
    getOutgoingIndividualRequests().then((res) => {
      setOutgoingIndividualRequests(res)
    })
    getGroupRequests().then((res) => {
      setGroupToMembers(res)
    })
    getOutgoingGroupRequests().then((res) => {
      setOutgoingGroupToMembers(res)
    })
  }, [])

  return (
    <>
      <Header />
      <Stack direction="row" spacing={2}>
        <Sidebar
          classCode={classCode}
          className={className}
          instructors={instructors}
        />
        <div className="min-w-fit max-w-fit pt-6">
          <ThemeProvider theme={theme}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="groups view tab selector"
                variant="fullWidth"
              >
                <Tab label="Incoming Requests" {...a11yProps(0)} />
                <Tab label="Outgoing Requests" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <div>
                <h1 className="font-sans text-3xl my-6 font-bold">
                  {' '}
                  Assignment
                  {' '}
                  {assignmentId}
                  :
                  {' '}
                  Incoming Requests
                  {' '}
                </h1>
                {/* <h1 className="font-sans text-3xl my-6 font-bold"> Requests </h1> */}
                <Divider sx={{ borderBottomWidth: 4 }} />
                <h1 className="font-sans text-xl my-6 font-bold"> Individual Requests </h1>
                <div className="grid grid-cols-3 flex flex-wrap mb-4">
                  {
                    individualRequests.length ? individualRequests.map((member) => (
                      <RequestCard
                        classCode={classCode}
                        assignmentId={assignmentId}
                        students={[member]}
                        isIncoming={isIncoming}
                      />
                    )) : <h1> No individual requests currently </h1>
                  }
                </div>
                <Divider sx={{ borderBottomWidth: 4 }} />
                <h1 className="font-sans text-xl my-6 font-bold"> Group Requests </h1>
                <div className="flex flex-col">
                  {
                    Object.keys(groupToMembers).length
                      ? Object.values(groupToMembers).map((group) => (
                        <RequestCard
                          classCode={classCode}
                          assignmentId={assignmentId}
                          students={group}
                          isIncoming={isIncoming}
                        />
                      )) : <h1> No group requests currently </h1>
                  }
                </div>
              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div>
                <h1 className="font-sans text-3xl my-6 font-bold">
                  {' '}
                  Assignment
                  {' '}
                  {assignmentId}
                  :
                  {' '}
                  Outgoing Requests
                  {' '}
                </h1>
                {/* <h1 className="font-sans text-3xl my-6 font-bold"> Requests </h1> */}
                <Divider sx={{ borderBottomWidth: 4 }} />
                <h1 className="font-sans text-xl my-6 font-bold"> Individual Requests </h1>
                <div className="grid grid-cols-3 flex flex-wrap mb-4">
                  {
                    outgoingIndividualRequests.length ? outgoingIndividualRequests.map((member) => (
                      <RequestCard
                        classCode={classCode}
                        assignmentId={assignmentId}
                        students={[member]}
                        isIncoming={!isIncoming}
                      />
                    )) : <h1> No individual requests currently </h1>
                  }
                </div>
                <Divider sx={{ borderBottomWidth: 4 }} />
                <h1 className="font-sans text-xl my-6 font-bold"> Group Requests </h1>
                <div className="flex flex-col">
                  {
                    Object.keys(outgoingGroupToMembers).length
                      ? Object.values(outgoingGroupToMembers).map((group) => (
                        <RequestCard
                          classCode={classCode}
                          assignmentId={assignmentId}
                          students={group}
                          isIncoming={!isIncoming}
                        />
                      )) : <h1> No group requests currently </h1>
                  }
                </div>
              </div>
            </TabPanel>
          </ThemeProvider>
        </div>
      </Stack>
    </>
  )
}

export default RequestsPage
