import axios from 'axios'
import qs from 'qs'
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

export const getUnassignedStudents = async (classCode, assignmentId) => {
  const { data } = await axios.get(
    `${baseUrl}/class/${classCode}/assignments/${assignmentId}/unassigned`,
  )
  return data
}

// get group ID of a user
export const getGroupId = async (classCode, assignmentId, username) => {
  const { data: [{ groupId }] } = await axios.get(
    `${baseUrl}/class/${classCode}/assignments/${assignmentId}/group-id/${username}`,
  )
  return groupId
}

// get all members in a group
export const getMembers = async (classCode, assignmentId, groupId) => {
  const { data } = await axios.get(`${baseUrl}/class/${classCode}/assignments/${assignmentId}/group/${groupId}/members`)
  return data
}

export const getGroupSize = async (classCode, assignmentId) => {
  const { data } = await axios.get(`${baseUrl}/class/${classCode}/assignments/${assignmentId}/groupSize`)
  return data
}

// Create a singleton group for the currently logged in user
export const createGroup = async (classCode, assignmentId) => {
  const { data } = await axios.post(`${baseUrl}/class/${classCode}/assignments/${assignmentId}/group`)
  return data
}

export const joinGroup = async (classCode, assignmentId, groupId) => {
  const { data } = await axios.patch(`${baseUrl}/class/${classCode}/assignments/${assignmentId}/group/${groupId}`, { op: 'add' })
  return data
}

// When a user leaves a group, they are placed into their own singleton group
export const leaveGroup = async (classCode, assignmentId, groupId) => {
  await axios.patch(`${baseUrl}/class/${classCode}/assignments/${assignmentId}/group/${groupId}`, { op: 'remove' })
  const { data } = await axios.post(`${baseUrl}/class/${classCode}/assignments/${assignmentId}/group`)
  return data
}

export const sendRequest = async (classCode, assignmentId, groupId) => {
  if (!groupId) {
    const errMessage = 'Invalid request: groupId is undefined'
    throw new Error(errMessage)
  }
  const { data } = await axios.post(`${baseUrl}/request/add`, { classCode, assignmentId, toGroupId: groupId })
  return data
}

export const getChatId = async (members) => {
  const { data: [{ chatId }] } = await axios.get(
    `${baseUrl}/chats/id`,
    {
      params: { members },
      paramsSerializer: { serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' }) },
    },
  )
  return chatId
}

export const createChat = async (classCode, assignmentId, members) => {
  try {
    const { data } = await axios.post(`${baseUrl}/chats/${classCode}/assignments/${assignmentId}`, { members })
    return data
  } catch (err) {
    throw new Error(err.message)
  }
}

export const createGroupChat = async (classCode, assignmentId, groupId, members) => {
  const { data } = await axios.post(`${baseUrl}/chats/${classCode}/assignments/${assignmentId}/groups/${groupId}`, { members })
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
    return res.data
  } catch (err) {
    console.log(err)
    throw new Error(err.message)
  }
}

export const getChatAllMembers = async (chatId) => {
  try {
    const res = await axios.get(`${baseUrl}/chats/${chatId}/members`)
    return res.data
  } catch (err) {
    console.log(err)
    throw new Error(err.message)
  }
}

export const createCourse = async (classCode, className) => {
  try {
    const { data } = await axios.post(`${baseUrl}/instructor/class/new`, { classCode, className })
    return data
  } catch (err) {
    throw new Error(err.message)
  }
}

export const addStudent = async (username, classCode) => {
  try {
    const { data } = await axios.post(`${baseUrl}/instructor/class/${classCode}/${username}`)
    return data
  } catch (err) {
    throw new Error(err.message)
  }
}

export const addTag = async (classCode, content) => {
  try {
    const { data } = await axios.post(`${baseUrl}/instructor/class/${classCode}/tags/new`, { content })
    return data
  } catch (err) {
    throw new Error(err.message)
  }
}
