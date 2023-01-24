/* eslint-disable react/prop-types */
// import { useState } from 'react'
import axios from 'axios'
import config from './config.json'

function Sidebar({ classCode }) {
  const className = async () => {
    const { data } = await axios.get(
      `http://${config.server_host}:${config.server_port}/class/${classCode}`,
      { withCredentials: true },
    )
    return data[0]
  }

  const instructorInfo = async () => {
    const { data } = await axios.get(
      `http://${config.server_host}:${config.server_port}/class/${classCode}/instructor`,
      { withCredentials: true },
    )
    return data
  }

  return (
    <div>
      <h1>
        {' '}
        {className}
        {' '}
      </h1>
      {
        instructorInfo.map((instructor) => (
          <h2>
            {instructor.name}
          </h2>
        ))
      }
    </div>
  )
}

export default Sidebar
