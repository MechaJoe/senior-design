import axios from 'axios'

const baseUrl = 'http://localhost:8080'

export const getCourseName = async (classCode) => {
  try {
    const res = await axios.get(`${baseUrl}/class/${classCode}`)
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
