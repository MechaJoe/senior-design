/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Stack from '@mui/material/Stack'
import Sidebar from '../components/Sidebar'
import AssignmentDetailsCard from '../components/AssignmentDetailsCard'
import Header from '../components/Header'
import config from '../config.json'

function InstructorAssignmentsPage() {
  const { classCode } = useParams()
  const [instructors, setInstructors] = useState([])
  const [className, setClassName] = useState('')
  const [assignments, setAssignments] = useState([])

  const navigate = useNavigate()

  const getUser = async () => {
    const { data } = await axios.get('http://localhost:8080/username', { withCredentials: true })
    if (!data) {
      navigate('/login')
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

  const getAssignmentInfo = async () => {
    const { data } = await axios.get(
      `http://${config.server_host}:${config.server_port}/class/${classCode}/assignments`,
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
    getAssignmentInfo().then((res) => {
      setAssignments(res)
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
        <div>
          <h1 className="font-sans text-3xl my-6 font-bold"> Assignments </h1>
          <div className="flex flex-wrap">
            {
              assignments.length ? assignments.map((assignment) => (
                <AssignmentDetailsCard
                  key={assignment.assignmentId}
                  classCode={classCode}
                  assignmentId={assignment.assignmentId}
                  deadline={assignment.deadline}
                // groupInfo={assignmentGroupInfo}
                />
              )) : null
            }
          </div>
        </div>
      </Stack>
    </>
  )
}

export default InstructorAssignmentsPage
