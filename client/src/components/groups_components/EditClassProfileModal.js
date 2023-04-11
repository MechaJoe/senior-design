import { useState } from 'react'
import { createPortal } from 'react-dom'

export default function EditClassProfileModal(props) {
  const {
    show, setShow, tags, applyFilters,
  } = props
  const yearList = ['2023', '2024', '2025', '2026']
  const emptyFilters = {
    years: [], schools: [], majors: [], tag: [],
  }
  const [selected, setSelected] = useState(emptyFilters)

  const handleSelect = (item, type) => {
    const newSelected = { ...selected }
    if (newSelected[type].includes(item)) {
      newSelected[type] = newSelected[type].filter((i) => i !== item)
    } else {
      newSelected[type].push(item)
    }
    setSelected(newSelected)
  }

  return (
    show
    && createPortal(
      <div
        className="flex fixed justify-center items-center inset-0 z-2 w-full cursor-default backdrop-blur-sm"
      >
        <div className="flex flex-col w-96 justify-start items-start bg-white rounded-2xl border-[6px] text-gunmetal text-xl p-6 border-gunmetal">
          <div className="text-gunmetal font-bold pb-6">Edit Class Profile</div>
          <div className="pb-3">Year</div>
          <div className="inline-block pb-6">
            {yearList.map((year) => (
              <button
                key={year}
                className={`
                inline-block
                rounded-full
                px-3 py-1
                mr-2 mb-2
                text-sm
                font-sans
                font-semibold
                transition
                ${selected.years.includes(year) ? 'bg-gunmetal text-white' : 'bg-tan text-gunmetal'}
                hover:bg-gunmetal/80
                hover:text-white
                active:bg-gunmetal
                `}
                type="button"
                onClick={() => handleSelect(year, 'years')}
              >
                {year}
              </button>
            ))}
          </div>
          <div className="pb-3">Class-Specific Tags</div>
          <div className="inline-block pb-6">
            {tags?.map((tag) => (
              <button
                key={tag}
                className="inline-block bg-rust rounded-full px-3 py-1 text-sm font-sans font-semibold transition hover:bg-gunmetal hover:text-white text-white mr-2 mb-2"
                type="button"
                onClick={() => handleSelect(tag, 'tags')}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="flex flex-row w-full justify-between">
            <button
              className="border border-red-700 text-red-700 transition hover:bg-red-700 hover:text-white rounded-xl p-2"
              type="button"
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
            <button
              className="border border-green-700 text-green-700 transition hover:bg-green-700 hover:text-white rounded-xl p-2"
              type="button"
              onClick={() => {
                setShow(false)
                applyFilters(selected)
                setSelected(emptyFilters)
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>,
      document.body,
    )
  )
}
