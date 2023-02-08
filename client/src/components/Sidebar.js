import axios from 'axios'
import { useEffect, useState } from 'react'
import config from '../config.json'

export default function Sidebar(props) {
  const { classCode } = props
  const [instructors, setInstructors] = useState([])

  const getInstructors = async () => {
    const { data: instructorData } = await axios.get(
      encodeURI(`${config.server_domain}/class/${classCode}/instructor`),
    )
    console.log(instructorData)
    if (instructorData) {
      setInstructors(instructorData)
    } else {
      console.log('no instructors found')
    }
  }

  useEffect(() => {
    getInstructors()
  }, [])

  return (
    <div>
      <div className="font-sans font-semibold text-4xl text-gunmetal border-gunmetal border-r-2 py-4 p-4 min-h-screen ">
        {classCode}
      </div>
      <div className="font-sans font-semibold text-4xl text-gunmetal border-gunmetal border-r-2 py-4 p-4 min-h-screen ">
        Instructors:
        {instructors.map((instructor) => (
          <div key={instructor.firstName}>
            {instructor.firstName}
          </div>
        ))}
      </div>
    </div>
  )
}
