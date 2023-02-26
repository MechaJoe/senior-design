import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import config from '../config.json'
import GroupsPageTabs from '../components/GroupsPageTabs'

export default function GroupsPage() {
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
    const { data: classData } = await axios.get(
      encodeURI(`${config.server_domain}/class/${classCode}`),
    )
    if (classData) {
      setClassTitle(classData.className)
    } else {
      console.log('no class found')
    }
  }

  useEffect(() => {
    getInstructors()
    getClassTitle()
  }, [])

  // get group members of logged in user
  const [groupMembers, setGroupMembers] = useState([])

  const getMyGroup = async () => {
    const { data: [{ groupId }] } = await axios.get(
      encodeURI(`${config.server_domain}/class/${classCode}/assignments/${assignmentId}/my-group-id`),
    )
    if (groupId) {
      const { data: members } = await axios.get(
        encodeURI(`${config.server_domain}/class/${classCode}/assignments/${assignmentId}/group/${groupId}/members`),
      )
      if (members) {
        setGroupMembers(members)
      } else {
        console.log('empty group')
      }
    } else {
      console.log('no group members')
    }
    return groupId
  }
  useEffect(() => {
    getMyGroup()
    getClassTitle()
  }, [])

  return (
    <div className="mx-auto min-w-full flex flex-row min-h-screen">
      <Sidebar classCode={classCode} className={classTitle} instructors={instructors} />
      <div className="flex flex-col w-5/6 p-6">
        <div className="font-sans font-bold text-4xl">
          Assignment
          {' '}
          {assignmentId}
        </div>
        <GroupsPageTabs groupMembers={groupMembers} />
      </div>
    </div>
  )
}
