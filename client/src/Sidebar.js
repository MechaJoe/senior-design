/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import axios from 'axios'
import config from './config.json'

function Sidebar({ classCode }) {
  console.log(`Class code: ${classCode}`)
  const [instructors, setInstructors] = useState([])

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    getInstructorInfo().then((res) => {
      console.log(res)
      // console.log(res.length)
      // res.forEach(((elem) => console.log(elem)))
      setInstructors(res)
    })
  }, [])

  // const className = async () => {
  //   const { data } = await axios.get(
  //     `http://${config.server_host}:${config.server_port}/class/${classCode}`,
  //     { withCredentials: true },
  //   )
  //   return data[0]
  // }
  console.log(`Host: ${config.server_host}`)
  console.log(`Port: ${config.server_port}`)
  const getInstructorInfo = async () => {
    const { data } = await axios.get(
      `http://${config.server_host}:${config.server_port}/class/${classCode}/instructor`,
      { withCredentials: true },
    )
    // if (data.length) {
    //   data.forEach((elem) => console.log(`Here: ${elem}`))
    // }

    // console.log(`Data: ${data}`)
    return data
  }

  console.log(`Instructors: ${instructors[0]}`)

  return (
    <div>
      <h1>
        {' '}
        {/* {className} */}
        {' '}
      </h1>
      {/* {console.log(instructors)} */}
      {instructors[0].username}
      {/* {
        instructors ? instructors.map((instructor) => (
          <h2>
            {instructor.username}
          </h2>
        )) : null
      } */}
    </div>
  )
}

export default Sidebar
