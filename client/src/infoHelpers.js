import axios from 'axios'
import config from './config.json'

// export const baseUrl = http://localhost:8080
export const baseUrl = `http://${config.server_host}:${config.server_port}`

export const getCourseName = async (classCode) => {
  try {
    const res = await axios.get(`${baseUrl}/class/${classCode}`)
    return res.data.results
  } catch (err) {
    throw new Error(err.message)
  }
}

export const getLoggedInUserAllCourses = async () => {
  try {
    const res = await axios.get(`${baseUrl}/user/classes`)
    return res.data.results
  } catch (err) {
    throw new Error(err.message)
  }
}

export const getUserAllCourses = async (username) => {
  try {
    const res = await axios.get(`${baseUrl}/user/${username}/classes`)
    return res.data.results
  } catch (err) {
    throw new Error(err.message)
  }
}

export const getUser = async (username) => {
  try {
    const res = await axios.get(`${baseUrl}/user/${username}`)
    return res.data.results
  } catch (err) {
    throw new Error(err.message)
  }
}

export const checkUserLoggedIn = async () => {
  const { data } = await axios.get(`${baseUrl}/username`, { withCredentials: true })
  return data
}

// get all group IDs in a class
export const getGroupIds = async (classCode, assignmentId) => {
  const { data: { results } } = await axios.get(
    encodeURI(`${baseUrl}/class/${classCode}/assignments/${assignmentId}/groups`),
  )
  return results
}

export const getMyGroupId = async (classCode, assignmentId) => {
  const { data: [{ groupId }] } = await axios.get(
    `${baseUrl}/class/${classCode}/assignments/${assignmentId}/my-group-id`,
  )
  return groupId
}

// get all members in a group
export const getMembers = async (classCode, assignmentId, groupId) => {
  const { data } = await axios.get(`${baseUrl}/class/${classCode}/assignments/${assignmentId}/group/${groupId}/members`)
  return data
}

export const getGroupSize = async (classCode, assignmentId) => {
  const { data } = await axios.get(
    `${baseUrl}/class/${classCode}/assignments/${assignmentId}/groupSize`,
  )
  return data
}

export const getUserAllChats = async () => {
  try {
    const res = await axios.get(`${baseUrl}/chats/all`)
    console.log(res.data)
    return res.data
  } catch (err) {
    throw new Error(err.message)
  }
}

export const getUserFilteredChats = async (classCode) => {
  try {
    const res = await axios.get(`${baseUrl}/chats/${classCode}/all`)
    return res.data
  } catch (err) {
    throw new Error(err.message)
  }
}

export const getChatAllMessages = async (chatId) => {
  try {
    const res = await axios.get(`${baseUrl}/chats/${chatId}`)
    console.log(res.data)
    return res.data
  } catch (err) {
    throw new Error(err.message)
  }
}
