/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  FormControl, TextField,
} from '@mui/material'
import AddTagsBar from './AddTagsBar'
import {
  addTag, addStudent, createCourse,
} from '../infoHelpers'

export default function AddCourseModal(props) {
  const {
    show, setShow,
  } = props
  const [name, setName] = useState('')
  const [tags, setTags] = useState([])
  const [classCode, setClassCode] = useState('')
  const [pt1, setPt1] = useState(true)
  const [pt2, setPt2] = useState(true)

  const [file, setFile] = useState()
  const [array, setArray] = useState([])

  const fileReader = new FileReader()

  const handleOnChange = (e) => {
    setFile(e.target.files[0])
  }

  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf('\n')).split(',')
    const csvRows = string.slice(string.indexOf('\n') + 1).split('\n')

    const arr = csvRows.map((i) => {
      const values = i.split(',')
      const obj = csvHeader.reduce((ob, header, index) => {
        ob[header] = values[index]
        return ob
      }, {})
      return obj
    })
    setArray(arr)
  }

  const addStudents = () => {
    array.map((item) => (
      addStudent(Object.values(item)[0], classCode)
    ))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()

    if (file) {
      fileReader.onload = (event) => {
        const text = event.target.result
        csvFileToArray(text)
      }
      fileReader.readAsText(file)
      alert('Successfully submitted CSV')
    }
  }

  const addTags = () => {
    tags.map((tag) => (
      addTag(classCode, tag)
    ))
  }

  return (
    show
    && createPortal(
      <div
        className="flex fixed justify-center items-center inset-0 z-2 w-full cursor-default backdrop-blur-sm"
      >
        {
            pt1
              ? (
                <div className="flex flex-col w-96 justify-start items-start bg-white rounded-2xl border-[6px] text-gunmetal text-xl p-6 border-gunmetal">
                  <div className="text-gunmetal font-bold pb-6">Enter Information for the Course</div>
                  <FormControl fullWidth>
                    <TextField
                      required
                      id="outlined-required"
                      label="Course Code"
                      value={classCode}
                      onChange={(e) => setClassCode(e.target.value)}
                    />
                  </FormControl>
                  <br />
                  <FormControl fullWidth>
                    <TextField
                      required
                      id="outlined-required"
                      label="Course Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormControl>
                  <br />
                  <div className="flex flex-row w-full justify-between">
                    <button
                      className="border border-red-700 text-red-700 transition hover:bg-red-700 hover:text-white rounded-lg p-2"
                      type="button"
                      onClick={() => setShow(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="border border-green-700 text-green-700 transition hover:bg-green-700 hover:text-white rounded-lg p-2"
                      type="button"
                      onClick={() => {
                        // setShow(false)
                        setPt1(false)
                        createCourse(classCode, name)
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )
              : (
                pt2
                  ? (
                    <div className="flex flex-col w-96 justify-start items-start bg-white rounded-2xl border-[6px] text-gunmetal text-xl p-6 border-gunmetal">
                      <div className="text-gunmetal font-bold pb-6">Upload Roster for the Course</div>
                      <form>
                        <input
                          type="file"
                          id="csvFileInput"
                          accept=".csv"
                          onChange={handleOnChange}
                        />
                        <br />
                      </form>
                      <br />
                      <div className="flex flex-row w-full justify-center">
                        <button
                          className="border border-blue-700 text-blue-700 transition hover:bg-blue-700 hover:text-white rounded-lg p-2"
                          type="button"
                          onClick={(e) => {
                            handleOnSubmit(e)
                          }}
                        >
                          Submit CSV
                        </button>
                      </div>
                      <br />
                      <div className="flex flex-row w-full justify-between">
                        <button
                          className="border border-red-700 text-red-700 transition hover:bg-red-700 hover:text-white rounded-lg p-2"
                          type="button"
                          onClick={() => setShow(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="border border-green-700 text-green-700 transition hover:bg-green-700 hover:text-white rounded-lg p-2"
                          type="button"
                          onClick={() => {
                            // setShow(false)
                            setPt2(false)
                            addStudents()
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )
                  : (
                    <div className="flex flex-col w-96 justify-start items-start bg-white rounded-2xl border-[6px] text-gunmetal text-xl p-6 border-gunmetal">
                      <div className="text-gunmetal font-bold pb-6">Define Useful Skills for the Course</div>
                      <AddTagsBar
                        tags={tags}
                        setTags={setTags}
                      />
                      <br />
                      <div className="flex flex-row w-full justify-between">
                        <button
                          className="border border-red-700 text-red-700 transition hover:bg-red-700 hover:text-white rounded-lg p-2"
                          type="button"
                          onClick={() => setShow(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="border border-green-700 text-green-700 transition hover:bg-green-700 hover:text-white rounded-lg p-2"
                          type="button"
                          onClick={() => {
                            setShow(false)
                            addTags()
                            window.location.reload()
                          }}
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  )
              )
        }

      </div>,
      document.body,
    )
  )
}
