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
import {
  Stack, TextField, Typography,
} from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
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

  const handleSendMessage = async () => {
    // ${config.server_host}:${config.server_port}
    const { data } = await axios.post(`http://localhost:8080/chats/${selectedChatId}`, { // TOOD: get chatid from props?
      messageContent,
    }, { withCredentials: true })
    if (data === 'success') {
      setNewMsg(messageContent)
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
  }, [filter, newMsg])
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
              <Toolbar />
              {/* <Toolbar /> */}
              <Toolbar>
                <h2 className="pt-6 text-xl font-bold"> Filter by Class</h2>
              </Toolbar>
              <Divider />
              {/* <Box sx={{ overflow: 'auto' }}> */}
              <List>
                {studentCourses.map((course) => (
                  <ListItem key={course.classCode} disablePadding>
                    <ListItemButton sx={{ '&& .Mui-selected': { backgroundColor: 'blue' } }} onClick={() => handleClickFilter(course.classCode)}>
                      <ListItemText primary={course.classCode} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              {/* </Box> */}
            </Drawer>
          </Stack>
          <Stack direction="column" className="w-1/3 font-sans bg-slate-100 sticky top-0">
            <List>
              <h2 className="pt-6 pl-3 text-3xl font-bold"> Chats</h2>
              <Divider />
              {chats.map((chat) => (
                <ListItem key={chat.chatId} disablePadding>
                  <ListItemButton sx={{ '&& .Mui-selected': { backgroundColor: 'red' } }} onClick={() => handleClickChat(chat.chatId)}>
                    <ListItemText primary={chat.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Stack>
          <Stack direction="column" className="w-screen p-0">
            <Box className="mt-20 p-5">
              {selected.map((m) => (
                <Stack direction="column" className="py-2">
                  {/* <div style={{ textAlign: m.sender === curr ? 'left' : 'left' }} className="py-2"> */}
                  <Typography className={m.sender === curr ? 'bubble-r border p-5' : 'bubble-l border rounded-full p-2'} variant="h8" gutterBottom>
                    {m.content}
                  </Typography>
                  <Typography className={m.sender === curr ? 'bubble-r' : 'bubble-l'} variant="h8" gutterBottom>
                    {m.sender}
                  </Typography>
                  {/* </div> */}
                </Stack>
              ))}
            </Box>
            {/* mt-auto is like a footer ;) */}
            <div className="row justify-content-center d-flex justify-content-center mt-auto p-5">
              <Divider />
              <Stack direction="row">
                <input style={{ color: 'gray', borderRadius: '25px' }} className="float-left border-skyblue" placeholder="Type a message" value={messageContent} onInput={(e) => setMessageContent(e.target.value)} />
                <div className="chat-col col-1">
                  <Button className="float-right chat-btn" size="lg" variant="primary" type="submit" onClick={handleSendMessage}>Send</Button>
                </div>
              </Stack>
            </div>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export default ChatPage
