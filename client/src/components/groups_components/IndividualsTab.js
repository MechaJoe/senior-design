/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import TuneIcon from '@mui/icons-material/Tune'
import ConfirmModal from './ConfirmModal'
import FilterModal from './FilterModal'
import FullProfileCard from './FullProfileCard'
import { sendRequest, getGroupId, getUserTags } from '../../infoHelpers'

export default function IndividualsTab(props) {
  const {
    groupMembers, individuals, myUsername, grouped, requested, classCode, assignmentId,
    classTags,
  } = props

  const compareStudent = (a, b) => {
    if (individuals?.includes(a) && (grouped?.includes(b))) {
      return -1
    }
    if (individuals?.includes(b) && (grouped?.includes(a))) {
      return 1
    }
    return a.username.localeCompare(b.username)
  }

  const students = individuals?.concat(grouped).sort(compareStudent)
  const items = students.map(
    (student) => ({
      id: student.username,
      name: `${student.firstName} ${student.lastName}`,
    }),
  )
  const groupUsernames = groupMembers.map((member) => member.username)
  const [requestShow, setRequestShow] = useState(false)
  const [filterShow, setFilterShow] = useState(false)
  const [filtersApplied, setFiltersApplied] = useState(false)
  const [toGroupId, setToGroupId] = useState('')
  const [displayed, setDisplayed] = useState(students)

  useEffect(() => {
    students.forEach((s) => {
      getUserTags(classCode, s.username)
        .then((tags) => {
          // eslint-disable-next-line no-param-reassign
          s.tags = tags.map((t) => t.content)
        })
    })
    console.log(students)
  }, [])

  const applyFilters = (filters) => {
    console.log(filters)
    const newDisplayed = []
    students.forEach((student) => {
      if (((!filters.years.length) || filters.years.includes(`${student.year}`))
        && ((!filters.tags.length)
          || filters.tags.filter((t) => student.tags.includes(t.content)).length)
        && ((!filters.schools.length) || filters.schools.filter((s) => student.schools.split(',').includes(s)).length)
        && ((!filters.majors.length) || filters.majors.filter((m) => student.majors.split(',').includes(m)).length)) {
        newDisplayed.push(student)
      }
    })
    setDisplayed(newDisplayed)
    setFiltersApplied(true)
  }

  const selectStudent = (filters) => {
    const newDisplayed = []
    students.forEach((student) => {
      if (`${student.firstName} ${student.lastName}` === filters.name) {
        newDisplayed.push(student)
        setDisplayed(newDisplayed)
      }
    })
  }

  const handleOnSearch = (string, results) => {
    if (string) {
      const usernames = new Set(results.map((item) => item.id))
      setDisplayed(students.filter((s) => usernames.has(s.username)))
    } else {
      setDisplayed(students)
    }
  }

  return (
    <>
      {requestShow && (
      <ConfirmModal
        action="request"
        onClose={() => setRequestShow(false)}
        confirm={() => sendRequest(classCode, assignmentId, toGroupId)}
      />
      )}
      <FilterModal
        show={filterShow}
        setShow={setFilterShow}
        classTags={classTags}
        applyFilters={applyFilters}
      />
      <div className="grid grid-cols-4 gap-4 px-5">
        <div className="col-span-3">
          <ReactSearchAutocomplete
            placeholder="Search by name..."
            items={items}
            styling={
              {
                borderRadius: '16px',
                fontFamily: 'Montserrat',
              }
            }
            onSelect={(item) => selectStudent(item)}
            onSearch={handleOnSearch}
            onClear={() => setDisplayed(students)}
          />
        </div>
        <button
          className={`col-span-1
          border
          border-gunmetal
          rounded-xl
          font-sans
          ${filtersApplied ? 'bg-gunmetal text-white' : 'bg-white text-gunmetal'}`}
          type="button"
          onClick={() => {
            if (!filtersApplied) {
              setFilterShow(true)
            } else {
              setFiltersApplied(false)
              setDisplayed(students)
            }
          }}
        >
          Filter
          {' '}
          <TuneIcon />
        </button>
      </div>
      <div className="grid laptop:grid-cols-3 grid-cols-2 gap-4 pt-4 justify-items-center">
        {displayed?.map((member) => (
          <FullProfileCard
            classCode={classCode}
            classTags={classTags}
            assignmentId={assignmentId}
            username={member.username}
            key={member.username}
            firstName={member.firstName}
            lastName={member.lastName}
            emailAddress={member.emailAddress}
            profileImageUrl={member.profileImageUrl}
            year={member.year}
            majors={member.majors}
            schools={member.schools}
            bio={member.bio}
            showModal={async () => {
              setRequestShow(true)
              const tgid = await getGroupId(classCode, assignmentId, member.username)
              setToGroupId(tgid)
            }}
            requested={requested?.has(member.username)}
            grayed={grouped?.includes(member.username)}
            locked={groupUsernames?.includes(member.username)}
            editable={member.username === myUsername}
          />
        ))}
      </div>
    </>
  )
}
