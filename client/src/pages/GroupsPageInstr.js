/* eslint-disable no-unused-vars */
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import config from '../config.json'
import GroupsPageTabsInstr from '../components/groups_components/GroupsPageTabsInstr'
import Header from '../components/Header'
import { getGroupIds, getGroupSize, getUnassignedStudents } from '../infoHelpers'

export default function GroupsPageInstr() {
  const navigate = useNavigate()
  const getUser = async () => {
    const { data } = await axios.get(`${config.server_domain}/username`)
    if (!data) {
      navigate('/login')
    }
  }
  useEffect(() => {
    getUser()
  }, [])

  const { classCode, assignmentId } = useParams()
  const [classTitle, setClassTitle] = useState('')
  const [instructors, setInstructors] = useState([])
  //   const [groupMembers, setGroupMembers] = useState([])
  const [individuals, setIndividuals] = useState([])
  const [grouped, setGrouped] = useState([])
  const [unassigned, setUnassigned] = useState([])
  const [groupIds, setGroupIds] = useState([])
  const [groupSize, setGroupSize] = useState({})
  const [requested, setRequested] = useState(new Set())

  const getInstructors = async () => {
    const { data: instructorData } = await axios.get(
      encodeURI(`${config.server_domain}/class/${classCode}/instructor`),
    )
    if (instructorData) {
      setInstructors(instructorData)
    } else {
      console.log('no instructors found')
    }
  }

  const getClassTitle = async () => {
    const { data: { results: [{ className }] } } = await axios.get(
      encodeURI(`${config.server_domain}/class/${classCode}`),
    )
    if (className) {
      setClassTitle(className)
    } else {
      console.log('no class found')
    }
  }

  const getRequested = async () => {
    const { data: groupRequested } = await axios.get(`${config.server_domain}/class/${classCode}/assignments/${assignmentId}/requests/groups`)
    const { data: individualRequested } = await axios.get(`${config.server_domain}/class/${classCode}/assignments/${assignmentId}/requests/individuals`)
    const { data: outgoingGroupRequested } = await axios.get(`${config.server_domain}/class/${classCode}/assignments/${assignmentId}/requests/outgoing/groups`)
    const { data: outgoingIndividualRequested } = await axios.get(`${config.server_domain}/class/${classCode}/assignments/${assignmentId}/requests/outgoing/individuals`)
    const allRequested = new Set(
      groupRequested
        .concat(individualRequested)
        .concat(outgoingGroupRequested)
        .concat(outgoingIndividualRequested)
        .map((user) => user.username),
    )
    setRequested(allRequested)
  }

  useEffect(() => {
    getInstructors()
    getClassTitle()
    getRequested()
  }, [])

  // get group members of logged in user
  const getUnassigned = async () => {
    const { results } = await getUnassignedStudents(classCode, assignmentId)
    console.log(results)
    setUnassigned(results)
  }

  // get all individuals in class without a group
  const getIndividuals = async () => {
    const { data: { results } } = await axios.get(
      encodeURI(`${config.server_domain}/class/${classCode}/assignments/${assignmentId}/no-group`),
    )
    if (results) {
      setIndividuals(results)
    } else {
      console.log('no individuals found')
    }
  }

  // get all individuals in class with a group
  const getGrouped = async () => {
    const { data: { results } } = await axios.get(
      encodeURI(`${config.server_domain}/class/${classCode}/assignments/${assignmentId}/grouped`),
    )
    if (results) {
      setGrouped(results)
    } else {
      console.log('no grouped individuals found')
    }
  }

  useEffect(() => {
    getUnassigned()
    getClassTitle()
    getIndividuals()
    getGrouped()
    getGroupIds(classCode, assignmentId).then((data) => {
      if (data) {
        setGroupIds(data.map((group) => group.groupId))
      } else {
        console.log('no grouped individuals found')
      }
    })
    getGroupSize(classCode, assignmentId).then((data) => {
      if (data) {
        setGroupSize(data)
      } else {
        console.log('no group size found')
      }
    })
  }, [])

  return (
    <>
      <Header />
      <div className="mx-auto min-w-full flex flex-row min-h-screen">
        <Sidebar classCode={classCode} className={classTitle} instructors={instructors} />
        <div className="flex flex-col w-5/6 p-6">
          <div className="font-sans font-bold text-4xl">
            Assignment
            {' '}
            {assignmentId}
          </div>
          <GroupsPageTabsInstr
            classCode={classCode}
            assignmentId={assignmentId}
            unassigned={unassigned}
            individuals={individuals}
            grouped={grouped}
            groupIds={groupIds}
            groupSize={groupSize}
            requested={requested}
          />
        </div>
      </div>
    </>
  )
}
