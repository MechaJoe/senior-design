import { useState } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AddCourseModal from './AddCourseModal'

export default function AddCourseCard() {
  // const navigate = useNavigate()
  const [show, setShow] = useState(false)

  // const onConfirm = () => {
  //   navigate('/')
  // }

  return (
    <>
      {show && (
        <AddCourseModal
          show={show}
          setShow={setShow}
        // onClose={() => setIsShowing(false)}
        // confirm={onConfirm}
        />
      )}
      <button
        type="button"
        onClick={() => setShow(true)}
        className="rounded-2xl w-[350px] h-[200px] m-6 p-6 text-center text-2xl font-bold text-dark bg-card font-sans border-[6px] border-dark border-dashed"
      >
        Create Course
        {' '}
        <AddCircleIcon fontSize="large" />
      </button>
    </>
  )
}
