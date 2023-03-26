import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import config from '../config.json'
import GroupsPageTabs from '../components/groups_components/GroupsPageTabs'
import Header from '../components/Header'
import { getGroupIds, getGroupSize, getMyGroupId } from '../infoHelpers'

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
  const [groupMembers, setGroupMembers] = useState([])
  const [individuals, setIndividuals] = useState([])
  const [grouped, setGrouped] = useState([])
  const [myGroupId, setMyGroupId] = useState('')
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
    console.log(groupRequested)
    console.log(individualRequested)
    setRequested(new Set(
      groupRequested
        .concat(individualRequested)
        .map((user) => user.username),
    ))
  }

  useEffect(() => {
    getInstructors()
    getClassTitle()
    getRequested()
  }, [])

  // get group members of logged in user
  const getMyGroup = async () => {
    const groupId = await getMyGroupId(classCode, assignmentId)
    setMyGroupId(groupId)
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
    getMyGroup()
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
          <GroupsPageTabs
            classCode={classCode}
            assignmentId={assignmentId}
            groupMembers={groupMembers}
            individuals={individuals}
            grouped={grouped}
            myGroupId={myGroupId}
            groupIds={groupIds}
            groupSize={groupSize}
            requested={requested}
          />
        </div>
      </div>
    </>
  )
}
