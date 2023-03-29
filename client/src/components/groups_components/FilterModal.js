import { createPortal } from 'react-dom'

export default function FilterModal(props) {
  const {
    show, setShow, tags, // setFilters,
  } = props
  const yearList = ['2023', '2024', '2025', '2026']
  const schoolList = ['SEAS', 'SAS', 'WHARTON', 'NURSING']
  const majorList = ['CIS', 'EE', 'MATH', 'ASAM', 'BE', 'FNCE']

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
                className="inline-block bg-tan rounded-full px-3 py-1 text-sm font-sans font-semibold transition hover:bg-gunmetal hover:text-white text-gunmetal mr-2 mb-2"
                type="button"
              >
                {year}

              </button>
            ))}
          </div>
          <div className="pb-3">School</div>
          <div className="inline-block pb-6">
            {schoolList.map((school) => (
              <button
                className="inline-block bg-tan rounded-full px-3 py-1 text-sm font-sans font-semibold transition hover:bg-gunmetal hover:text-white text-gunmetal mr-2 mb-2"
                type="button"
              >
                {school}
              </button>
            ))}
          </div>
          <div className="pb-3">Major</div>
          <div className="inline-block pb-6">
            {majorList.map((major) => (
              <button
                className="inline-block bg-tan rounded-full px-3 py-1 text-sm font-sans font-semibold transition hover:bg-gunmetal hover:text-white text-gunmetal mr-2 mb-2"
                type="button"
              >
                {major}

              </button>
            ))}
          </div>
          <div className="pb-3">Class-Specific Tags</div>
          <div className="inline-block pb-6">
            {tags.map((tag) => (
              <button
                className="inline-block bg-rust rounded-full px-3 py-1 text-sm font-sans font-semibold transition hover:bg-gunmetal hover:text-white text-white mr-2 mb-2"
                type="button"
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
              onClick={() => setShow(false)}
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
