import { createPortal } from 'react-dom'

export default function FilterModal(props) {
  const { students, show, setShow } = props
  console.log(students)

  return (
    show
    && createPortal(
      <div
        className="flex fixed justify-center items-center inset-0 z-2 w-full cursor-default backdrop-blur-sm"
        onClick={() => setShow(false)}
        onKeyDown={() => setShow(false)}
        role="button"
        tabIndex={0}
      >
        <div className="flex flex-col justify-center items-center w-96 h-52 bg-white rounded-2xl border-[6px] text-gunmetal text-xl p-6 border-gunmetal">
          <div className="flex flex-row w-full pt-12 justify-between">
            <button type="button" onClick={() => setShow(false)}>Cancel</button>
            <button type="button" onClick={() => setShow(false)}>Apply Filters</button>
          </div>
        </div>
      </div>,
      document.body,
    )
  )
}
