import { createPortal } from 'react-dom'
import { Button } from '@mui/material'

export default function ConfirmModal({ action, confirm, onClose }) {
  return (
    createPortal(
      <div
        className="flex fixed justify-center items-center inset-0 z-2 w-full cursor-default backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={onClose}
        role="button"
        tabIndex={0}
      >
        <div className="flex flex-col justify-center items-center w-96 h-52 bg-white rounded-2xl border-[6px] text-gunmetal text-xl p-6 border-gunmetal">
          {/* eslint-disable-next-line no-nested-ternary */}
          {action === 'leave' ? 'Are you sure you want to leave your group?'
            : action === 'groupRequest' ? 'Are you sure you would like to request to join this group?' : 'Are you sure you would like to request this individual to join your group?' }
          <div className="flex flex-row w-full pt-12 justify-between">
            <Button variant="outlined" color={`${action === 'leave' ? 'error' : 'success'}`} onClick={onClose}>Cancel</Button>
            <Button variant="contained" color={`${action === 'leave' ? 'error' : 'success'}`} onClick={confirm}>Confirm</Button>
          </div>
        </div>
      </div>,
      document.body,
    )
  )
}
