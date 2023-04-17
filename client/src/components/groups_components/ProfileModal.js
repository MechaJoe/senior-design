import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@mui/material'
import { getChatId, createChat, checkUserLoggedIn } from '../../infoHelpers'

function ProfileModal(props) {
  const {
    locked, requested, onClose, profile,
  } = props
  const {
    classCode, assignmentId, username, firstName, lastName, emailAddress, profileImageUrl, year,
    majors,
    schools,
  } = profile
  const majorList = majors.split(',')
  const schoolList = schools.split(',')
  const navigate = useNavigate()

  const [dmId, setDmId] = useState('')

  useEffect(() => {
    getChatId(username).then((chatId) => setDmId(chatId))
  }, [])

  const openChat = async (chatId) => {
    if (chatId) {
      navigate(`/chat/${chatId}`)
    }
    const newChatId = await createChat(
      classCode,
      assignmentId,
      [username, await checkUserLoggedIn()],
    )
    navigate(`/chat/${newChatId}`)
  }

  return (
    createPortal(
      <div
        className="flex fixed justify-center items-center inset-0 z-2 w-full min-h-screen cursor-default backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={onClose}
        role="button"
        tabIndex={0}
      >
        <div
          className="rounded-2xl w-[330px] p-6 text-center z-3 border-[6px] bg-cardstock border-gunmetal cursor-default"
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
            {locked
              ? (
                <div className="justify-items-center items-center font-sans">
                  <button type="button" onClick={() => openChat(dmId)} className=" bg-buttonblue text-white rounded w-24">Chat</button>
                </div>
              )
              : (
                <div className="grid grid-cols-2 gap-4 justify-items-center p-4 font-sans">
                  <button type="button" onClick={() => openChat(dmId)} className=" bg-buttonblue text-white rounded w-24">Chat</button>
                  {requested ? <button type="button" className="bg-gray-500 text-white rounded w-24">Request</button>
                    : <button type="button" className=" bg-buttongreen text-white rounded w-24">Request</button>}
                </div>
              )}
          </div>
        </div>
      </div>,
      document.body,
    )
  )
}

export default ProfileModal
