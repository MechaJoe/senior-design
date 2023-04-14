import { useState } from 'react'
import { createPortal } from 'react-dom'

export default function FilterModal(props) {
  const {
    show, setShow, classTags, applyFilters,
  } = props
  const yearList = ['2023', '2024', '2025', '2026']
  const schoolList = ['SEAS', 'SAS', 'Wharton', 'Nursing']
  const majorList = ['CIS', 'EE', 'MATH', 'ASAM', 'BE', 'FNCE']
  const emptyFilters = {
    years: [], schools: [], majors: [], tags: [],
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
          <div className="text-gunmetal font-bold pb-6">Filters</div>
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
          <div className="pb-3">School</div>
          <div className="inline-block pb-6">
            {schoolList.map((school) => (
              <button
                key={school}
                className={`
                inline-block
                rounded-full
                px-3 py-1
                mr-2 mb-2
                text-sm
                font-sans
                font-semibold
                transition
                ${selected.schools.includes(school) ? 'bg-gunmetal text-white' : 'bg-tan text-gunmetal'}
                hover:bg-gunmetal/80
                hover:text-white
                active:bg-gunmetal
                `}
                type="button"
                onClick={() => handleSelect(school, 'schools')}
              >
                {school}
              </button>
            ))}
          </div>
          <div className="pb-3">Major</div>
          <div className="inline-block pb-6">
            {majorList.map((major) => (
              <button
                key={major}
                className={`
                inline-block
                rounded-full
                px-3 py-1
                mr-2 mb-2
                text-sm
                font-sans
                font-semibold
                transition
                ${selected.majors.includes(major) ? 'bg-gunmetal text-white' : 'bg-tan text-gunmetal'}
                hover:bg-gunmetal/80
                hover:text-white
                active:bg-gunmetal
                `}
                type="button"
                onClick={() => handleSelect(major, 'majors')}
              >
                {major}
              </button>
            ))}
          </div>
          <div className="pb-3">Class-Specific Tags</div>
          <div className="inline-block pb-6">
            {classTags?.map((tag) => (
              <button
                key={tag.content}
                className={`
                  inline-block
                  bg-rust
                  border
                  ${selected.tags.includes(tag)
                  ? 'bg-rust hover:bg-rust/90 text-white'
                  : 'bg-white text-rust hover:bg-rust/20'}
                  border-rust
                  rounded-full
                  px-3 py-1
                  text-sm
                  font-sans
                  font-semibold
                  transition
                  active:bg-rust
                  active:text-white
                  mr-2 mb-2`}
                type="button"
                onClick={() => handleSelect(tag, 'tags')}
              >
                {tag.content}
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
