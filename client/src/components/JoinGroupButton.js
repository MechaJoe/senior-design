import axios from 'axios'
import { baseUrl } from '../infoHelpers'

export default function JoinGroupButton(props) {
  const { classCode, assignmentId, groupId } = props
  const joinGroup = async () => {
    const { data } = await axios.post(`${baseUrl}/class/${classCode}/assignments/${assignmentId}/group/${groupId}/join`)
    if (data === 'request sent') {
      console.log('request successfully sent')
    } else {
      console.log('error sending join group request')
    }
  }
  return (
    <button type="button" className="rounded-2xl w-32 h-32 bg-gray-100 border-dashed border border-gunmetal" onClick={joinGroup} onKeyDown={joinGroup}>+</button>
  )
}
