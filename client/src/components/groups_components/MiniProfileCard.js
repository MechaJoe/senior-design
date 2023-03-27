import { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import ProfileModal from './ProfileModal'

export default function MiniProfileCard(props) {
  const {
    member, locked, requested, classCode, assignmentId,
  } = props
  const { firstName, lastName, profileImageUrl } = member

  const [isShowing, setIsShowing] = useState(false)

  return (
    <>
      {isShowing
      && (
      <ProfileModal
        onClose={() => setIsShowing(!isShowing)}
        classCode={classCode}
        assignmentId={assignmentId}
        profile={member}
        locked={locked}
        requested={requested}
      />
      )}
      <button
        type="button"
        className="rounded-2xl p-6 text-center bg-tan/10"
        onClick={() => setIsShowing(true)}
      >
        {profileImageUrl
          ? <img className="w-32 h-32 mx-auto" src={profileImageUrl} alt="profile" />
          : (
            <Avatar
              sx={{
                width: 65, height: 65, font: 'Montserrat', fontSize: '2rem',
              }}
              className="mx-auto"
              alt="profile"
            >
              {firstName[0] + lastName[0]}
            </Avatar>
          )}
        <div className="p-1">
          <div className="font-sans text-l font-semibold">
            {firstName}
            {' '}
            {lastName}
          </div>
        </div>
      </button>
    </>
  )
}
