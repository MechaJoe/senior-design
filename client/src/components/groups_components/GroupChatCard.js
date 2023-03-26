import { useNavigate } from 'react-router-dom'
import ChatIcon from '@mui/icons-material/Chat'

export default function GroupChatCard({ groupId }) {
  const navigate = useNavigate()

  const onClick = () => {
    navigate(`/chat/${groupId}`) // navigate to chat page
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
