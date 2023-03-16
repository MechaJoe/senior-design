import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import {
  Stack,
} from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import SelectedChat from '../components/SelectedChat'
// import ChatSideBar from '../components/ChatSideBar'
import Header from '../components/Header'
import { getUserAllChats } from '../infoHelpers'

const drawerWidth = 240

function ChatPage() {
  const [chats, setChats] = useState([])
  // pass selected to Selected Chat
  const [selected, setSelected] = useState()

  useEffect(() => {
    getUserAllChats('lejiaz').then((response) => {
      setChats(response)
    })
  }, [])
  return (
    <Stack direction="column">
      <Header />
      <Stack direction="row" spacing={1}>
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
            <Toolbar>
              <h2 className="pt-6 text-3xl font-bold"> Chats</h2>
            </Toolbar>
            <Divider />
            <Box sx={{ overflow: 'auto' }}>
              <List>
                {chats.map((chat) => (
                  <ListItem key={chat.chatId} disablePadding>
                    <ListItemButton onClick={() => setSelected(chat.chatId)}>
                      <ListItemText primary={chat.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        </Stack>
        <Stack direction="column">
          <Toolbar />
          <SelectedChat selected={selected} />
        </Stack>
      </Stack>
    </Stack>

  // <Box sx={{ display: 'flex' }}>
  //   <CssBaseline />
  //   <Header />
  //   <ChatSideBar passToParent={handleSelect} />
  //   <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
  //     <Toolbar />
  //     <SelectedChat selected={selected} />
  //   </Box>
  // </Box>
  )
}

export default ChatPage
