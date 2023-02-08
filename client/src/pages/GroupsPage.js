import axios from 'axios'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// import { useState, useEffect } from 'react'
import { useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import config from '../config.json'
import FullCard from '../components/FullCard'

export default function GroupsPage() {
  // TODO: Uncomment this to enable redirect when user is not logged in
  // const [username, setUsername] = useState('')
  // const navigate = useNavigate()
  // const getUser = async () => {
  // eslint-disable-next-line max-len
  //   const { data } = await axios.get(`${config.server_domain}/username`, { withCredentials: true })
  //   if (!data) {
  //     navigate('/login')
  //   }
  //   setUsername(data.username)
  // }
  // useEffect(() => {
  //   getUser()
  // }, [])

  // get group members of logged in user
  const { classCode, assignmentId } = useParams()
  const [groupMembers, setGroupMembers] = useState([])
  // const [viewMode, setViewMode] = useState('myGroup') // myGroup, individuals, or allGroups

  const getMyGroup = async () => {
    const { data: [{ groupId }] } = await axios.get(
      encodeURI(`${config.server_domain}/class/${classCode}/assignments/${assignmentId}/my-group`),
    )
    if (groupId) {
      const { data: members } = await axios.get(
        encodeURI(`${config.server_domain}/class/${classCode}/assignments/${assignmentId}/group/${groupId}/members`),
      )
      if (members) {
        console.log(members)
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
    // setViewMode('myGroup')
  }, [])

  return (
    <Box
      className="container mx-auto min-w-full"
    >
      <div className="flex flex-row min-h-screen">
        <Sidebar classCode={classCode} />
        <div className="flex flex-col p-6">
          <Typography variant="h2">
            Assignment
            {' '}
            {assignmentId}
          </Typography>
          <div className="flex flex-row">
            {groupMembers?.map((member) => (
              <FullCard key={member.username} username={member.username} />
            ))}
          </div>
        </div>
      </div>
    </Box>
  )
}
