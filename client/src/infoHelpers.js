import axios from 'axios'
// import { useNavigate } from 'react-router-dom'

const baseUrl = 'http://localhost:8080'
// const navigate = useNavigate()

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
  const { data } = await axios.get('http://localhost:8080/username', { withCredentials: true })
  console.log('data')
  console.log(data)
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
