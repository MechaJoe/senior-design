import { useState, useEffect } from 'react'
import {
  Button, Card, CardContent, Typography, Box, Stack, Chip,
} from '@mui/material'
import { getUser } from './infoHelpers'

export default function requestCard(props) {
  const { sender } = props
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [year, setYear] = useState('')
  const [majors, setMajors] = useState('')
  const [schools, setSchools] = useState('')

  useEffect(() => {
    getUser(sender)
      .then((response) => {
        setFirstName(response[0].firstName)
        setLastName(response[0].lastName)
        setYear(response[0].year)
        setMajors(response[0].majors)
        setSchools(response[0].schools)
      })
  }, [])

  return (
    <Card sx={{ width: 600, display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ justifyContent: 'left' }}>
        <CardContent sx={{ width: 500 }}>
          <Stack direction="row" spacing={2}>
            <Chip label={`${firstName} ${lastName}`} />
            <Chip label= />
            <Item>Item 3</Item>
          </Stack>
        </CardContent>
      </Box>
    </Card>
  )
}
