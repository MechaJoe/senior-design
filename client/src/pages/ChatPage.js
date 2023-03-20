/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import axios from 'axios'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import {
  Stack, TextField, Typography, Modal,
} from '@mui/material'
// import Toolbar from '@mui/material/Toolbar'
// import SelectedChat from '../components/SelectedChat'
// import ChatSideBar from '../components/ChatSideBar'
import Header from '../components/Header'
import {
  getUserAllChats, getChatAllMessages, getUserAllCourses, getUserFilteredChats,
} from '../infoHelpers'

const drawerWidth = 240

function ChatPage() {
  const [chats, setChats] = useState([])
  // pass selected to Selected Chat
  const [selected, setSelected] = useState([])
  const [messageContent, setMessageContent] = useState('')
  const [studentCourses, setStudentCourses] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [filter, setFilter] = useState('')
  const [selectedChatId, setSelectedChatId] = useState('') // selected chatId
  const [modal, setModal] = useState(false)
  const [newMember, setNewMember] = useState('')
  const curr = 'lejiaz'
  const handleClickChat = (id) => {
    setSelectedChatId(id)
    getChatAllMessages(id).then((response) => {
      console.log('response')
      console.log(response)
      setSelected(response)
    })
  }

  const handleClickFilter = (classCode) => {
    setFilter(classCode)
  }

  const handleAddNewMember = async () => {
    if (!newMember) {
      console.log('no new member typed')
      return
    }
    // ${config.server_host}:${config.server_port}
    const { data } = await axios.post(`http://localhost:8080/chats/${selectedChatId}/add`, {
      newMember,
    }, { withCredentials: true })
    if (data === 'success') {
      // setNewMsg(messageContent)
      setNewMember('')
    } else {
      console.log(data)
    }
  }
  const handleSendMessage = async () => {
    if (!messageContent || !selectedChatId) {
      console.log('no message typed or no selected chat')
      return
    }
    // ${config.server_host}:${config.server_port}
    const { data } = await axios.post(`http://localhost:8080/chats/${selectedChatId}`, { // TOOD: get chatid from props?
      messageContent,
    }, { withCredentials: true })
    if (data === 'success') {
      setNewMsg(messageContent)
      setMessageContent('')
    } else {
      console.log(data)
    }
  }

  useEffect(() => {
    getUserAllCourses('lejiaz').then((response) => {
      setStudentCourses(response)
    })
  }, [])

  useEffect(() => {
    if (filter === '') {
      getUserAllChats('lejiaz').then((response) => {
        setChats(response)
      })
    } else {
      getUserFilteredChats('lejiaz', filter).then((response) => {
        setChats(response)
      })
    }
  }, [filter])

  useEffect(() => {
    getChatAllMessages(selectedChatId).then((response) => {
      console.log('response')
      console.log(response)
      setSelected(response)
    })
  }, [newMsg])

  return (
    <Box
      className="container w-screen mx-auto min-w-full bg-white min-h-screen"
    >
      <Stack direction="column" className="flex flex-row min-h-screen">
        <Header />
        {/* flex-1 fixes overflow problem with header and footer? */}
        <Stack direction="row" spacing={1} className="flex-1 w-screen h-screen">
          <Stack direction="column">
            <Drawer
              variant="permanent"
              sx={{
                width: drawerWidth,
                height: 100,
                flexShrink: 0,
                '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
              }}
            >
              <Typography variant="h-4" className="pt-20 pl-5 pb-2 text-xl font-bold"> Filter by Class</Typography>
              <List sx={{ paddingLeft: '5px' }}>
                <Divider />
                {studentCourses.map((course) => (
                  <ListItem key={course.classCode} disablePadding className={course.classCode === filter ? 'bg-skybluelight' : ''}>
                    <ListItemButton sx={{ '&& .Mui-selected': { backgroundColor: 'blue' } }} onClick={() => handleClickFilter(course.classCode)}>
                      <ListItemText primary={course.classCode} />
                    </ListItemButton>
                    <Divider id="divy" />
                  </ListItem>

                ))}
              </List>
            </Drawer>
          </Stack>
          <Stack sx={{ borderRight: 1, borderColor: '#DFE0DF' }} direction="column" className="w-1/3 font-sans sticky top-0">
            <Typography variant="h-4" className="pt-4 pl-5 pb-2 text-xl font-bold"> Chats </Typography>
            <List>
              <Divider />
              {chats.map((chat) => (
                <ListItem key={chat.chatId} className={chat.chatId === selectedChatId ? 'border-b bg-skybluelight border-gray' : 'border-b border-gray'} disablePadding>
                  <ListItemButton sx={{ '&& .Mui-selected': { backgroundColor: 'red' } }} onClick={() => handleClickChat(chat.chatId)}>
                    <ListItemText primary={chat.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Stack>
          <Stack direction="column" className="w-screen p-0">
            <div className="block">
              <Button className="mt-4 mr-4 float-right" onClick={() => setModal(true)}>
                <PersonAddAltOutlinedIcon fontSize="large" />
              </Button>
            </div>
            <Box className="mt-20 p-5">
              {selected.map((m) => (
                <Stack direction="column" className="py-2">
                  <div id="msg">
                    <Typography className={m.sender === curr ? 'bg-skyblue text-white rounded-lg p-2 float-right' : 'border border-skyblue rounded-lg p-2 float-left'} variant="h8" gutterBottom>
                      {m.content}
                    </Typography>
                  </div>
                  <div id="caption">
                    <Typography className={m.sender === curr ? 'float-right' : 'float-left'} variant="caption" gutterBottom>
                      {m.sender}
                    </Typography>
                  </div>
                </Stack>
              ))}
            </Box>
            {/* mt-auto is like a footer ;) */}
            <div className="row justify-content-center d-flex justify-content-center mt-auto px-5">
              <Divider />
              <Stack direction="row" className="py-5">
                {/* flex-1 worked for input */}
                <input style={{ borderColor: 'skyblue', borderRadius: '25px' }} className="px-5 flex-1  border-skyblue" placeholder="Type a message..." value={messageContent} onInput={(e) => setMessageContent(e.target.value)} />
                <div className="ml-4 chat-col col-1 text-white bg-skyblue rounded-lg">
                  <Button className="bg-skyblue" variant="primary" type="submit" onClick={handleSendMessage}>Send</Button>
                </div>
              </Stack>
            </div>
          </Stack>
        </Stack>
      </Stack>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: 'flex', justifyContent: 'center', backgroundColor: '#FFFFFF', marginTop: '200px', marginBottom: '350px', marginLeft: '400px', marginRight: '400px',
        }}
        // sx={{ border: 4, borderColor: 'black', borderRadius: 4 }}
      >
        <Stack spacing={4} fullWidth className="inline-block bg-white p-5 rounded-xl">
          <Typography fullWidth variant="h8">
            Add People
          </Typography>
          <input value={newMember} onInput={(e) => setNewMember(e.target.value)} className="mx-5" placeholder="Enter username or email" />
          <Stack direction="row" alignItems="center" justifyContent="right">
            <Button onClick={() => setModal(false)} variant="filled" className="text-black"> Close </Button>
            <Button onClick={handleAddNewMember} variant="filled"> Add </Button>
          </Stack>
        </Stack>
      </Modal>
    </Box>
  )
}

export default ChatPage
