import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import LogoutIcon from '@mui/icons-material/Logout'
import ConfirmModal from './ConfirmModal'
import { leaveGroup } from '../../infoHelpers'

export default function LeaveGroupCard({ assignmentId, classCode, groupId }) {
  const navigate = useNavigate()
  const [isShowing, setIsShowing] = useState(false)

  const onConfirm = () => {
    leaveGroup(classCode, assignmentId, groupId)
    navigate(`/courses/${classCode}/assignments/${assignmentId}`) // navigate to assignment page
  }

  return (
    <>
      {isShowing && (
      <ConfirmModal
        action="leave"
        onClose={() => setIsShowing(false)}
        confirm={onConfirm}
      />
      )}
      <button
        type="button"
        onClick={() => setIsShowing(true)}
        className="rounded-2xl w-[330px] h-[426px] p-6 text-center text-2xl text-red-700 font-sans border-[3px] bg-white border-red-700 border-dashed"
      >
        Leave Group
        {' '}
        <LogoutIcon fontSize="large" />
      </button>
    </>
  )
}
