import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
import axios from 'axios'
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
  const [requests, setRequests] = useState([])

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

  const getRequests = async () => {
    const { data } = await axios.get(
      `http://${config.server_host}:${config.server_port}/class/${classCode}/assignments/${assignmentId}/requests`,
      { withCredentials: true },
    )
    return data
  }

  useEffect(() => {
    getUser()
    getInstructorInfo().then((res) => {
      setInstructors(res)
    })
    getClassName().then((res) => {
      setClassName(res.results[0].className)
    })
    getRequests().then((res) => {
      setRequests(res)
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
        <h2> Individual Requests </h2>
        <div className="flex flex-wrap">
          {
            requests.length ? requests.map((member) => (
              <RequestCard
                key={member.username}
                firstName={member.firstName}
                lastName={member.lastName}
                emailAddress={member.emailAddress}
                profileImageUrl={member.profileImageUrl}
                year={member.year}
                majors={member.majors}
                schools={member.schools}
              />
            )) : null
          }
        </div>
      </Stack>
    </>
  )
}

export default RequestsPage
