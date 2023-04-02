import Avatar from '@mui/material/Avatar'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getChatId, createChat, checkUserLoggedIn } from '../../infoHelpers'

export default function FullProfileCard(props) {
  const {
    classCode,
    assignmentId,
    username, firstName, lastName, emailAddress, profileImageUrl, year, majors, schools, grayed,
    requested,
    showModal,
    locked,
  } = props

  const navigate = useNavigate()

  const majorList = majors.split(',')
  const schoolList = schools.split(',')
  const [dmId, setDmId] = useState('')

  useEffect(() => {
    checkUserLoggedIn()
      .then((user) => {
        getChatId([user, username])
          .then((chatId) => setDmId(chatId))
      })
  }, [])

  const openChat = async () => {
    if (dmId) {
      navigate(`/chat/${dmId}`)
    } else {
      const { chatId } = await createChat(
        classCode,
        assignmentId,
        [username, await checkUserLoggedIn()],
      )
      console.log('here')
      console.log(chatId)
      navigate(`/chat/${chatId}`)
    }
  }

  return (
    <div className={`rounded-2xl w-[330px] h-[360px] p-6 text-center border-[6px] ${grayed ? 'bg-gray-200 border-gray-300' : 'bg-tan/5 border-gunmetal'}`}>
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
      <div className="p-3">
        <span className="inline-block bg-tan rounded-full px-3 py-1 text-sm font-sans font-semibold text-gunmetal mr-2 mb-2">{year}</span>
        {schoolList.map((school) => (
          <span key={school} className="inline-block bg-tan rounded-full px-3 py-1 text-sm font-sans font-semibold text-gunmetal mr-2 mb-2">{school}</span>
        ))}
        {majorList.map((major) => (
          <span key={major} className="inline-block bg-tan rounded-full px-3 py-1 text-sm font-sans font-semibold text-gunmetal mr-2 mb-2">{major}</span>
        ))}
      </div>
      <div className="">
        <div className="font-sans text-l font-semibold">
          {firstName}
          {' '}
          {lastName}
        </div>
        <div className="font-sans text-l">
          {emailAddress}
        </div>
        {grayed || locked
          ? (
            <div className="justify-items-center items-center p-4 font-sans">
              <button type="button" onClick={() => openChat()} className=" bg-buttonblue text-white rounded w-24">Chat</button>
            </div>
          )
          : (
            <div className="grid grid-cols-2 gap-4 justify-items-center p-4 font-sans">
              <button type="button" onClick={() => openChat()} className=" bg-buttonblue text-white rounded w-24">Chat</button>
              {requested ? <button type="button" className="text-white bg-slate-400 cursor-default rounded w-24">Request</button>
                : <button type="button" onClick={showModal} className="bg-buttongreen text-white rounded w-24">Request</button>}
            </div>
          )}
      </div>
    </div>
  )
}
