/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from './Sidebar'
import AssignmentCard from './AssignmentCard'
import config from './config.json'

function AssignmentsDashboard() {
  let classCode = window.location.href.split('/')[4]
  classCode = decodeURI(classCode)
  console.log(classCode)
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
      setClassName(res[0].className)
    })
    getAssignmentInfo().then((res) => {
      setAssignments(res)
    })
  }, [])
  console.log(assignments)
  return (
    <div className="h-screen">
      <Sidebar
        classCode={classCode}
        className={className}
        instructors={instructors}
      />
      <div className="sticky">
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
      </div>
    </div>

  )
}

export default AssignmentsDashboard
