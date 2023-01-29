/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
// import { useState, useEffect } from 'react'
// import axios from 'axios'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
// import config from './config.json'

function Sidebar({ classCode, className, instructors }) {
  // const [instructors, setInstructors] = useState([])

  // useEffect(() => {
  //   getInstructorInfo().then((res) => {
  //     console.log(`InstructorInfo: ${res}`)
  //     // console.log(res.length)
  //     // res.forEach(((elem) => console.log(elem)))
  //     setInstructors(res)
  //   })
  // }, [])

  // const getClassName = async () => {
  //   const { data } = await axios.get(
  //     `http://${config.server_host}:${config.server_port}/class/${classCode}`,
  //     { withCredentials: true },
  //   )
  //   return data[0]
  // }

  // const getInstructorInfo = async () => {
  //   const { data } = await axios.get(
  //     `http://${config.server_host}:${config.server_port}/class/${classCode}/instructor`,
  //     { withCredentials: true },
  //   )
  //   // if (data.length) {
  //   //   data.forEach((elem) => console.log(`Here: ${elem}`))
  //   // }

  //   // console.log(`Data: ${data}`)
  //   return data
  // }

  // console.log(`Instructors: ${instructors[0]}`)

  return (
    <div>
      <h1>
        {' '}
        {classCode}
        {' '}
      </h1>
      <h3>
        {className}
      </h3>

      <h2> Instructors </h2>
      {
        instructors ? instructors.map((instructor) => (
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <AccountCircleOutlinedIcon />
            <h3>
              {instructor.firstName}
              &nbsp;
              {instructor.lastName}
            </h3>
          </div>
        )) : null
      }
    </div>
  )
}

export default Sidebar
