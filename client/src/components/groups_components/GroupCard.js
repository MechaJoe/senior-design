import { useState, useEffect } from 'react'
import MiniProfileCard from './MiniProfileCard'
import JoinGroupButton from './JoinGroupButton'
import { getMembers } from '../../infoHelpers'

export default function GroupCard(props) {
  const {
    classCode, assignmentId, groupId, groupSize, locked,
  } = props
  const [groupMembers, setGroupMembers] = useState([])

  useEffect(() => {
    getMembers(classCode, assignmentId, groupId).then((data) => {
      if (data && data !== []) {
        console.log(data)
        setGroupMembers(data)
      } else {
        console.log('no group found')
      }
    })
  }, [])

  return (
    <div className="grid grid-cols-3 gap-4 rounded-2xl border-[6px] border-gunmetal items-center justify-items-center p-6">
      {groupMembers.map((member) => (
        <MiniProfileCard
          key={member.username}
          member={member}
          locked={locked}
        />
      ))}
      {groupMembers.length < groupSize.maxGroupSize && !locked
        ? <JoinGroupButton classCode={classCode} assignmentId={assignmentId} groupId={groupId} />
        : null}
    </div>
  )
}
