import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { setUserTags } from '../../infoHelpers'

export default function EditClassProfileModal(props) {
  const {
    show, setShow, classTags, userTags, classCode, username,
  } = props

  const [selectedTags, setSelectedTags] = useState(userTags)

  useEffect(() => {
    setSelectedTags(userTags)
  }, [userTags])

  const handleSelect = (item) => {
    let newSelected = [...selectedTags]
    if (newSelected.map((t) => t.tagId).includes(item.tagId)) {
      newSelected = newSelected.filter((i) => i.tagId !== item.tagId)
    } else {
      newSelected.push(item)
    }
    setSelectedTags(newSelected)
  }

  return (
    show
    && createPortal(
      <div
        className="flex fixed justify-center items-center inset-0 z-2 w-full cursor-default backdrop-blur-sm"
      >
        <div className="flex flex-col w-96 justify-start items-start bg-white rounded-2xl border-[6px] text-gunmetal text-xl p-6 border-gunmetal">
          <div className="text-gunmetal font-bold pb-6">Edit Class Profile</div>
          <div className="pb-3">Class-Specific Tags</div>
          <div className="inline-block pb-6">
            {classTags?.map((tag) => (
              <button
                key={tag.tagId}
                className={`
                  inline-block
                  bg-rust
                  border
                  ${selectedTags.map((t) => t.tagId).includes(tag.tagId)
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
                onClick={() => handleSelect(tag)}
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
                setUserTags(classCode, username, selectedTags.map((t) => t.tagId))
                window.location.reload()
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
