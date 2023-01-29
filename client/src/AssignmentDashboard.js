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
  const [groupInfo, setGroupInfo] = useState([])

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

  const getGroupInfo = async (assignmentId) => {
    const { data } = await axios.get(
      `http://${config.server_host}:${config.server_port}/class/${classCode}/assignments/${assignmentId}/groups/my-group-infos`,
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
      console.log('Setting assignments')
      setAssignments(res)
      // console.log(`Assignments length: ${assignments.length}`)
      res.forEach((assignment) => {
        const aId = assignment.assignmentId
        getGroupInfo(aId).then((groupRes) => {
          console.log('Setting groupInfo')
          setGroupInfo((prevState) => [...prevState, groupRes])
          // console.log(`GroupInfo Length: ${groupInfo.length}`)
        })
      })
    })
  }, [])
  console.log(`Assignments length: ${assignments.length}`)
  console.log(`GroupInfo Length: ${groupInfo.length}`)
  console.log(`GroupInfo: ${groupInfo}`)
  return (
    <>
      <Sidebar
        classCode={classCode}
        className={className}
        instructors={instructors}
      />
      {
        assignments.length ? assignments.map((assignment) => {
          groupInfo.forEach((ass) => console.log(`Ass ID: ${ass.assignmentId}`))
          const assignmentGroupInfo = groupInfo.filter((info) => info.assignmentId
            === assignment.assignmentId)
          console.log(`Assignment Group Info: ${assignmentGroupInfo}`)
          return (
            <AssignmentCard
              classCode={classCode}
              assignmentId={assignment.assignmentId}
              deadline={assignment.deadline}
              groupInfo={assignmentGroupInfo}
            />
          )
        }) : null
      }
    </>
  )
}

export default AssignmentsDashboard
