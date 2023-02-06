/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from './Sidebar'
import AssignmentCard from './AssignmentCard'
import config from './config.json'

function AssignmentsDashboard({ classCode }) {
  const [instructors, setInstructors] = useState([])
  const [className, setClassName] = useState('')
  const [assignments, setAssignments] = useState([])

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
    getInstructorInfo().then((res) => {
      setInstructors(res)
    })
    getClassName().then((res) => {
      setClassName(res)
    })
    getAssignmentInfo().then((res) => {
      setAssignments(res)
    })
  }, [])

  return (
    <>
      <Sidebar
        classCode={classCode}
        className={className}
        instructors={instructors}
      />
      {
        assignments.length ? assignments.map((assignment) => (
          <AssignmentCard
            classCode={classCode}
            assignmentId={assignment.assignmentId}
            deadline={assignment.deadline}
          // groupInfo={assignmentGroupInfo}
          />
        )) : null
      }
    </>
  )
}

export default AssignmentsDashboard
