/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import {
  Stack, TextField, Typography, Modal,
} from '@mui/material'
// import Toolbar from '@mui/material/Toolbar'
// import SelectedChat from '../components/SelectedChat'
// import ChatSideBar from '../components/ChatSideBar'
import Header from '../components/Header'
import {
  getUserAllChats, checkUserLoggedIn, getChatAllMessages, getUserFilteredChats, getChatAllMembers, getLoggedInUserAllCourses, changeChatName,
} from '../infoHelpers'

const drawerWidth = 240

function ChatPage() {
  const [chats, setChats] = useState([])
  // pass selected to Selected Chat
  const [selected, setSelected] = useState([])
  const [messageContent, setMessageContent] = useState('')
  const [studentCourses, setStudentCourses] = useState([])
  // const [newMsg, setNewMsg] = useState('')
  const [filter, setFilter] = useState('')
  const [selectedChatId, setSelectedChatId] = useState('') // selected chatId
  const [selectedChatName, setSelectedChatName] = useState('') // selected chatId
  const [modal, setModal] = useState(false)
  const [renameModal, setRenameModal] = useState(false)
  const [newMember, setNewMember] = useState('')
  const [newName, setNewName] = useState('')
  const { initialChatId } = useParams()

  const [chatMembers, setChatMembers] = useState([])
  const [curr, setCurr] = useState('')

  useEffect(() => {
    checkUserLoggedIn()
      .then((user) => {
        setCurr(user)
      })
  }, [])

  const updateChatMembers = (id) => {
    getChatAllMembers(id).then((response) => {
      console.log('response')
      console.log(response)
      const usernames = response.map((r) => r.username)
      console.log(usernames)
      setChatMembers(usernames)
    })
  }

  const updateChats = () => {
    getUserAllChats(curr).then((response) => {
      console.log('response')
      console.log(response)
      setChats(response)
    })
  }

  const handleClickChat = (id, name) => {
    updateChats()
    setSelectedChatId(id)
    setSelectedChatName(name)
    console.log(`chat id is ${id}`)
    getChatAllMessages(id).then((response) => {
      console.log('response')
      console.log(response)
      setSelected(response)
    })
    updateChatMembers(id)
  }

  const handleClickFilter = (classCode) => {
    if (!filter) {
      setFilter(classCode)
    } else {
      setFilter('')
    }
  }

  const handleAddNewMember = async () => {
    if (!newMember) {
      console.log('no new member typed')
      return
    }
    // ${config.server_host}:${config.server_port}
    const { error, results } = await axios.post(`http://localhost:8080/chats/${selectedChatId}/add`, {
      newMember,
    }, { withCredentials: true })
    if (error) {
      // setNewMsg(messageContent)
      alert(`User ${newMember} not found`)
    } else {
      setNewMember('')
      updateChatMembers(selectedChatId)
    }
  }

  const handleChangeChatName = async () => {
    if (!newName) {
      console.log('no new name typed')
      setRenameModal(false)
      return
    }
    setNewName('')
    const { error, results } = await changeChatName(selectedChatId, newName)
    if (!error) {
      setSelectedChatName(newName)
    } else {
      console.log(results)
      updateChats()
    }
    setRenameModal(false)
  }

  const handleSendMessage = async () => {
    console.log(selectedChatId)
    if (!messageContent || !selectedChatId) {
      console.log('no message typed or no selected chat')
      return
    }
    // ${config.server_host}:${config.server_port}
    const { error, results } = await axios.post(`http://localhost:8080/chats/${selectedChatId}`, { // TOOD: get chatid from props?
      messageContent,
    }, { withCredentials: true })
    if (error) {
      console.log(error)
    } else {
      setMessageContent('')
    }
  }

  // useEffect(() => {

  // }, [])

  useEffect(() => {
    getLoggedInUserAllCourses().then((response) => {
      setStudentCourses(response)
    })
    handleClickChat(initialChatId)
  }, [])

  useEffect(() => {
    const intervalID = setInterval(async () => {
      getChatAllMessages(selectedChatId).then((response) => {
        setSelected(response)
      })
    }, 500)
    return () => clearInterval(intervalID)
  }, [selectedChatId])

  useEffect(() => {
    if (filter === '') {
      getUserAllChats().then((response) => {
        setChats(response)
      })
    } else {
      getUserFilteredChats(filter).then((response) => {
        setChats(response)
      })
    }
  }, [filter])

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
                    <ListItemButton onClick={() => handleClickFilter(course.classCode)}>
                      <ListItemText primary={course.classCode} />
                    </ListItemButton>
                    <Divider id="divy" />
                  </ListItem>

                ))}
              </List>
            </Drawer>
          </Stack>
          <Stack sx={{ borderRight: 1, borderColor: '#DFE0DF' }} direction="column" className="w-1/3 font-sans sticky top-0">
            <Stack direction="row">
              <Typography variant="h-4" className="pt-4 pl-5 pb-2 text-xl font-bold"> Chats </Typography>
              <Button>
                <AddCircleOutlineIcon className="mt-1 float-right" style={{ color: 'black' }} />
              </Button>
            </Stack>
            <List>
              <Divider />
              {chats.map((chat) => (
                chat.chatId === selectedChatId ? (
                  <ListItem key={chat.chatId} className={chat.chatId === selectedChatId ? 'border-b bg-skybluelight border-gray' : 'border-b border-gray'} disablePadding>
                    <ListItemButton onClick={() => handleClickChat(chat.chatId, chat.name)}>
                      <ListItemText primary={selectedChatName} />
                    </ListItemButton>
                  </ListItem>
                ) : (
                  <ListItem key={chat.chatId} className={chat.chatId === selectedChatId ? 'border-b bg-skybluelight border-gray' : 'border-b border-gray'} disablePadding>
                    <ListItemButton onClick={() => handleClickChat(chat.chatId, chat.name)}>
                      <ListItemText primary={chat.name} />
                    </ListItemButton>
                  </ListItem>
                )

              ))}
            </List>
          </Stack>
          <Stack direction="column" className="w-screen p-0">
            {selectedChatName
              ? (
                <div className="block">
                  <Stack direction="row" className="mt-1" justifyContent="space-between">
                    <Stack direction="row">
                      <Typography className="pl-5 pt-5 ml-4 float-left font-bold" variant="h7">
                        {selectedChatName}
                      </Typography>
                      <Button>
                        <ModeEditOutlinedIcon className="mt-3" style={{ color: 'black' }} fontSize="small" onClick={() => setRenameModal(true)} />
                      </Button>
                    </Stack>
                    <Button className="mr-4 float-right" onClick={() => setModal(true)}>
                      <PersonAddAltOutlinedIcon fontSize="large" style={{ color: 'black' }} />
                    </Button>
                  </Stack>
                </div>
              ) : <> </>}
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
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', marginTop: '200px', marginBottom: '200px', marginLeft: '200px', marginRight: '200px',
        }}
      >
        <Stack spacing={4} className="bg-white p-5 rounded-xl">
          <Typography fullWidth variant="h8">
            Add People
          </Typography>
          <input value={newMember} onInput={(e) => setNewMember(e.target.value)} className="mx-5" placeholder="Enter username" />
          <Stack direction="row" alignItems="center" justifyContent="right">
            <Button onClick={() => setModal(false)} variant="filled" className="text-black"> Close </Button>
            <Button onClick={handleAddNewMember} variant="filled"> Add </Button>
          </Stack>
        </Stack>
      </Modal>

      <Modal
        open={renameModal}
        onClose={() => setRenameModal(false)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', marginTop: '200px', marginBottom: '200px', marginLeft: '200px', marginRight: '200px',
        }}
      >
        <Stack spacing={4} className="bg-white p-5 rounded-xl">
          <Typography fullWidth variant="h8">
            Change Chat Name
          </Typography>
          <input value={newName} onInput={(e) => setNewName(e.target.value)} className="mx-5" placeholder={selectedChatName} />
          <Stack direction="row" alignItems="center" justifyContent="right">
            <Button onClick={() => setRenameModal(false)} variant="filled" className="text-black"> Cancel </Button>
            <Button onClick={handleChangeChatName} variant="filled"> Save </Button>
          </Stack>
        </Stack>
      </Modal>
    </Box>
  )
}

export default ChatPage
