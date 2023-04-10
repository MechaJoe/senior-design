// import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'
// import ConfirmModal from './groups_components/ConfirmModal'
import CreateAssignmentModal from './CreateAssignmentModal'

export default function CreateAssignmentCard({ classCode }) {
  // const navigate = useNavigate()
  const [show, setShow] = useState(false)

  // const onConfirm = () => {
  //   navigate('/')
  // }

  return (
    <>
      {show && (
        <CreateAssignmentModal
          classCode={classCode}
          show={show}
          setShow={setShow}
        // onClose={() => setIsShowing(false)}
        // confirm={onConfirm}
        />
      )}
      <button
        type="button"
        onClick={() => setShow(true)}
        className="rounded-2xl w-[350px] h-[340px] m-6 p-6 text-center text-2xl text-white font-sans border-[6px] bg-gunmetal border-gunmetal"
      >
        Create Assignment
        {' '}
        <AddCircleIcon fontSize="large" />
      </button>
    </>
  )
}
