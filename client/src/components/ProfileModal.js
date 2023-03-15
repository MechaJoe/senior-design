import { createPortal } from 'react-dom'
import { Avatar } from '@mui/material'

function ProfileModal({ onClose, profile }) {
  const {
    firstName, lastName, emailAddress, profileImageUrl, year, majors, schools,
  } = profile
  const majorList = majors.split(',')
  const schoolList = schools.split(',')

  return (
    createPortal(
      <div
        className="flex absolute justify-center items-center inset-0 z-2 w-full min-h-screen cursor-default backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={onClose}
        role="button"
        tabIndex={0}
      >
        <div
          className="rounded-2xl w-[330px] h-[360px] p-6 text-center z-3 border-[6px] bg-cardstock border-gunmetal cursor-default"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="button"
          tabIndex={0}
        >
          {profileImageUrl
            ? <img className="w-32 h-32 mx-auto" src={profileImageUrl} alt="profile" />
            : (
              <Avatar
                sx={{
                  width: 130, height: 130, font: 'Montserrat', fontSize: '3rem',
                }}
                className="mx-auto"
                alt="profile"
              >
                {firstName[0] + lastName[0]}
              </Avatar>
            )}
          <div className="p-4">
            <div className="font-sans text-xl font-semibold">
              {firstName}
              {' '}
              {lastName}
            </div>
            <div className="p-3">
              <span className="inline-block bg-tan rounded-full px-3 py-1 text-sm font-sans font-semibold text-gunmetal mr-2 mb-2">{year}</span>
              {schoolList.map((school) => (
                <span key={school} className="inline-block bg-tan rounded-full px-3 py-1 text-sm font-sans font-semibold text-gunmetal mr-2 mb-2">{school}</span>
              ))}
              {majorList.map((major) => (
                <span key={major} className="inline-block bg-tan rounded-full px-3 py-1 text-sm font-sans font-semibold text-gunmetal mr-2 mb-2">{major}</span>
              ))}
            </div>
            <div className="font-sans text-l pb-4">
              {emailAddress}
            </div>
            <div className="grid grid-cols-2 gap-4 justify-items-center">
              <button type="button" className=" bg-buttonblue text-white rounded w-24">Chat</button>
              <button type="button" className=" bg-buttongreen text-white rounded w-24">Request</button>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    )
  )
}

export default ProfileModal
