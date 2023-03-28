import { useState } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import ConfirmModal from './ConfirmModal'
import FullProfileCard from './FullProfileCard'
import { sendRequest, getGroupId } from '../../infoHelpers'

export default function IndividualsTab(props) {
  const {
    individuals, grouped, requested, classCode, assignmentId,
  } = props
  const [requestShow, setRequestShow] = useState(false)
  const [toGroupId, setToGroupId] = useState('')

  return (
    <>
      {requestShow && (
      <ConfirmModal
        action="request"
        onClose={() => setRequestShow(false)}
        confirm={() => sendRequest(classCode, assignmentId, toGroupId)}
      />
      )}
      <ReactSearchAutocomplete
        placeholder="Search by name..."
        styling={
      {
        borderRadius: '16px',
      }
    }
      />
      <div className="grid laptop:grid-cols-3 grid-cols-2 gap-4 pt-4">
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
