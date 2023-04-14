/* eslint-disable indent */
import { createPortal } from 'react-dom'

export default function DeleteAssignmentModal({ action, confirm, onClose }) {
  const generateMessage = (a) => {
    if (a === 'leave') {
      return 'Are you sure you want to leave your group?'
    } if (a === 'groupRequest') {
      return 'Are you sure you want to leave your current group and request to join this group?'
    } if (a === 'deleteAssignment') {
      return 'Are you sure you want to delete this assignment?'
    }
    return 'Are you sure you would like to request this individual to join your group?'
  }

  return (
    createPortal(
      <div
        className="flex fixed justify-center items-center inset-0 z-2 w-full cursor-default backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={onClose}
        role="button"
        tabIndex={0}
      >
        <div className="flex flex-col justify-center items-center w-96 h-52 bg-white rounded-2xl border-[6px] text-gunmetal text-xl p-6 border-gunmetal font-sans">
          {generateMessage(action)}
          <div className="flex flex-row w-full pt-12 justify-between">
            <button
              type="button"
              className={`p-2 rounded-xl transition border
                ${action === 'leave'
                  ? 'border-red-700 text-red-700 bg-white hover:bg-red-100'
                  : 'border-green-700 text-green-700 bg-white hover:bg-green-100'
                }`}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`p-2 rounded-xl transition border
                ${action === 'leave'
                  ? 'border-red-700 hover:bg-red-800 bg-red-700 text-white'
                  : 'border-green-700 hover:bg-green-800 bg-green-700 text-white'
                }`}
              onClick={confirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>,
      document.body,
    )
  )
}
