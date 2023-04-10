import { useState } from 'react'

export default function AddTagsBar(props) {
  const {
    tags, setTags,
  } = props
  const [input, setInput] = useState('')
  // const [tags, setTags] = useState([])
  const [isKeyReleased, setIsKeyReleased] = useState(false)

  const onChange = (e) => {
    const { value } = e.target
    setInput(value)
  }
  const onKeyDown = (e) => {
    const { key } = e
    const trimmedInput = input.trim()

    if (key === 'Enter' && trimmedInput.length && !tags.includes(trimmedInput)) {
      e.preventDefault()
      setTags((prevState) => [...prevState, trimmedInput])
      setInput('')
    }

    if (key === 'Backspace' && !input.length && tags.length && isKeyReleased) {
      const tagsCopy = [...tags]
      const poppedTag = tagsCopy.pop()
      e.preventDefault()
      setTags(tagsCopy)
      setInput(poppedTag)
    }

    setIsKeyReleased(false)
  }

  const onKeyUp = () => {
    setIsKeyReleased(true)
  }

  const deleteTag = (index) => {
    setTags((prevState) => prevState.filter((tag, i) => i !== index))
  }
  return (
    <div className="container">
      {tags.map((tag, index) => (
        <span className="inline-block bg-orange rounded-full px-3 py-1 text-sm font-sans font-semibold text-white mr-2 mb-2">
          {tag}
          {' '}
          <button
            type="button"
            onClick={() => deleteTag(index)}
          >
            x

          </button>
        </span>
      ))}
      <input
        className="rounded-2xl border border-gunmetal"
        value={input}
        placeholder=" Enter skills here"
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        onChange={onChange}
      />
    </div>
  )
}
