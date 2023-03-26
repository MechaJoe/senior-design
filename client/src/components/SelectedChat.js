// import Typography from '@mui/material/Typography'
// import Message from './Message'

function SelectedChat(props) {
  const { selected } = props
  const curr = 'lejiaz'
  return (
    <div>
      {selected.map((m) => (
        <div className={m.sender === curr ? 'sender-r' : ''}>
          <b className="sender">
            {' '}
            {m.sender}
          </b>
          <p className={m.sender === curr ? 'bubble-r' : 'bubble-l'}>
            {m.content}
          </p>
        </div>
      ))}
    </div>
    // <div>
    //   {selected.map((msg) => (
    //     <Message msg={msg} />
    //   ))}
    // </div>
  )
}

export default SelectedChat
