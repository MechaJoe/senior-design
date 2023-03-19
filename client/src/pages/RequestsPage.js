import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import RequestCard from '../components/RequestCard'
import config from '../config.json'

function RequestsPage() {
  let classCode = window.location.href.split('/')[4]
  classCode = decodeURI(classCode)
  let assignmentId = window.location.href.split('/')[6]
  assignmentId = decodeURI(assignmentId)
  const [instructors, setInstructors] = useState([])
  const [className, setClassName] = useState('')
  const [individualRequests, setIndividualRequests] = useState([])
  // const [groupRequests, setGroupRequests] = useState([])
  const [groupToMembers, setGroupToMembers] = useState({})

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
      // setGroupToMembers(groupDict)
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
    getGroupRequests().then((res) => {
      setGroupToMembers(res)
      // setGroupRequests(res)
      // console.log(`Group Requests: ${JSON.stringify(groupRequests)}`)
      // separateGroups(groupRequests)
      // console.log(`Dictionary: ${JSON.stringify(groupToMembers)}`)
    })
    // separateGroups(groupRequests)
  }, [])

  // console.log(`Group Requests: ${JSON.stringify(groupRequests)}`)
  console.log(`Dictionary: ${JSON.stringify(groupToMembers)}`)

  return (
    <>
      <Header />
      <Stack direction="row" spacing={2}>
        <Sidebar
          classCode={classCode}
          className={className}
          instructors={instructors}
        />
        <div>
          <h1 className="font-sans text-3xl my-6 font-bold">
            {' '}
            Assignment
            {' '}
            {assignmentId}
            :
            {' '}
            Requests
            {' '}
          </h1>
          {/* <h1 className="font-sans text-3xl my-6 font-bold"> Requests </h1> */}
          <Divider sx={{ borderBottomWidth: 4 }} />
          <h1 className="font-sans text-xl my-6 font-bold"> Individual Requests </h1>
          <div className="grid grid-cols-3 flex flex-wrap mb-4">
            {
              individualRequests.length ? individualRequests.map((member) => (
                <RequestCard
                  students={[member]}
                />
              )) : null
            }
          </div>
          <Divider sx={{ borderBottomWidth: 4 }} />
          <h1 className="font-sans text-xl my-6 font-bold"> Group Requests </h1>
          <div className="flex flex-col">
            {
              groupToMembers ? Object.values(groupToMembers).map((group) => (
                <RequestCard
                  students={group}
                />
              )) : null
            }
          </div>
        </div>
      </Stack>
    </>
  )
}

export default RequestsPage
