import { useState, useEffect } from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { getUserAllChats } from '../infoHelpers'

const drawerWidth = 240

function ChatSideBar(props) {
  const [chats, setChats] = useState([])
  const { passToParent } = props
  useEffect(() => {
    getUserAllChats('lejiaz').then((response) => {
      console.log('response')
      console.log(response)
      setChats(response)
    })
  }, [])
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {chats.map((chat) => (
            <ListItem key={chat.chatId} disablePadding>
              <ListItemButton onClick={passToParent(chat.chatId)}>
                <ListItemText primary={chat.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>

  )
}

export default ChatSideBar
