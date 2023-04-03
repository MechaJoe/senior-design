import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatIcon from '@mui/icons-material/Chat'
import { getChatId, createGroupChat } from '../../infoHelpers'

export default function GroupChatCard({
  classCode, assignmentId, groupId, groupMembers,
}) {
  const navigate = useNavigate()
  const [chatId, setChatId] = useState('')
  const groupUsernames = groupMembers.map((m) => m.username)

  useEffect(() => {
    getChatId(groupUsernames)
      .then((cid) => setChatId(cid))
  }, [])

  const onClick = async () => {
    if (chatId) {
      navigate(`/chat/${chatId}`)
    } else {
      const newChatId = await createGroupChat(
        classCode,
        assignmentId,
        groupId,
        groupUsernames,
      )
      navigate(`/chat/${newChatId}`)
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl w-[330px] h-[360px] p-6 text-center text-2xl text-white font-sans border-[6px] bg-gunmetal border-gunmetal"
    >
      Open Group Chat
      {' '}
      <ChatIcon fontSize="large" />
    </button>
  )
}
