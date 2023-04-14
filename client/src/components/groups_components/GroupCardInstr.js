import { useState } from 'react'
import MiniProfileCard from './MiniProfileCard'
import JoinGroupButton from './JoinGroupButton'
import ConfirmModal from './ConfirmModal'
import { sendRequest } from '../../infoHelpers'

export default function GroupCardInstr(props) {
  const {
    groupMembers, classCode, assignmentId, groupId, groupSize, locked,
  } = props

  const [show, setShow] = useState(false)

  //   useEffect(() => {
  //     console.log(groupMembers)
  //   getMembers(classCode, assignmentId, groupId).then((data) => {
  //     if (data && data !== []) {
  //       console.log(data)
  //       setGroupMembers(data)
  //     } else {
  //       console.log('no group found')
  //     }
  //   })
  //   }, [])

  return (
    <>
      {show && (
      <ConfirmModal
        action="request"
        onClose={() => setShow(false)}
        confirm={() => sendRequest(classCode, assignmentId, groupId)}
      />
      )}
      <div className="grid grid-cols-3 gap-4 rounded-2xl border-[6px] border-gunmetal items-center justify-items-center p-6">
        {groupMembers.map((member) => (
          <MiniProfileCard
            classCode={classCode}
            assignmentId={assignmentId}
            username={member.username}
            key={member.username}
            member={member}
            locked={locked}
          />
        ))}
        {groupMembers.length < groupSize.maxGroupSize && !locked
          ? <JoinGroupButton classCode={classCode} assignmentId={assignmentId} groupId={groupId} />
          : null}
      </div>
    </>
  )
}
