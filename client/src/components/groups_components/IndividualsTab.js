import { useState } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import TuneIcon from '@mui/icons-material/Tune'
import ConfirmModal from './ConfirmModal'
import FilterModal from './FilterModal'
import FullProfileCard from './FullProfileCard'
import { sendRequest, getGroupId } from '../../infoHelpers'

export default function IndividualsTab(props) {
  const {
    individuals, grouped, requested, classCode, assignmentId,
    // tags, TODO: get tags from route in GroupsPage
  } = props
  const [requestShow, setRequestShow] = useState(false)
  const [filterShow, setFilterShow] = useState(false)
  const [filtersApplied, setFiltersApplied] = useState(false)
  const [toGroupId, setToGroupId] = useState('')
  const students = individuals?.concat(grouped)
  const items = students.map(
    (member) => ({
      id: member.username,
      name: `${member.firstName} ${member.lastName}`,
    }),
  )

  const tags = ['Frontend', 'Backend', 'Fullstack', 'Design', 'UX', 'UI', 'Data Science', 'Machine Learning', 'Mobile', 'Web']

  return (
    <>
      {requestShow && (
      <ConfirmModal
        action="request"
        onClose={() => setRequestShow(false)}
        confirm={() => sendRequest(classCode, assignmentId, toGroupId)}
      />
      )}
      <FilterModal show={filterShow} setShow={setFilterShow} students={students} tags={tags} />
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
          />
        </div>
        <button
          className={`col-span-1 border border-gunmetal font-sans rounded-xl ${filtersApplied ? 'bg-gunmetal text-white' : 'bg-white text-gunmetal'}`}
          type="button"
          onClick={() => {
            if (!filtersApplied) {
              setFilterShow(true)
            } else {
              // TODO: clear filters
              setFiltersApplied(false)
            }
          }}
        >
          Filter
          {' '}
          <TuneIcon />
        </button>
      </div>
      <div className="grid laptop:grid-cols-3 grid-cols-2 gap-4 pt-4 justify-items-center">
        {individuals?.map((member) => (
          <FullProfileCard
            classCode={classCode}
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
            showModal={async () => {
              setRequestShow(true)
              const tgid = await getGroupId(classCode, assignmentId, member.username)
              setToGroupId(tgid)
            }}
            requested={requested?.has(member.username)}
          />
        ))}
        {grouped?.map((member) => (
          <FullProfileCard
            username={member.username}
            key={member.username}
            firstName={member.firstName}
            lastName={member.lastName}
            emailAddress={member.emailAddress}
            profileImageUrl={member.profileImageUrl}
            year={member.year}
            majors={member.majors}
            schools={member.schools}
            grayed
          />
        ))}
      </div>
    </>
  )
}
