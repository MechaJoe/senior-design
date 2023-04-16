import { useState } from 'react'
import { sendRequest } from '../../infoHelpers'
import ConfirmModal from './ConfirmModal'

export default function JoinGroupButton(props) {
  const { classCode, assignmentId, groupId } = props
  const [isShowing, setIsShowing] = useState(false)

  const onConfirm = () => {
    // leaveGroup(classCode, assignmentId, groupId)
    sendRequest(classCode, assignmentId, groupId)
  }

  return (
    <>
      {isShowing
      && (
      <ConfirmModal
        action="groupRequest"
        confirm={() => onConfirm()}
        onClose={() => setIsShowing(false)}
      />
      )}
      <button
        type="button"
        className="rounded-2xl w-32 h-32 bg-gray-100 border-dashed border border-gunmetal"
        onClick={() => setIsShowing(true)}
        onKeyDown={() => setIsShowing(true)}
      >
        +
      </button>
    </>
  )
}
