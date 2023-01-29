import { useState, useEffect } from 'react'
import {
  ButtonBase, Card, CardContent, Typography, Box,
} from '@mui/material'
import { getCourseName } from './infoHelpers'

export default function courseCard(props) {
  const { courseId } = props
  const [courseName, setCourseName] = useState('')

  const [isNameLoading, setIsNameLoading] = useState(true)

  // take in id later
  const EnterCourse = () => {
    window.location.href = '/'
  }

  useEffect(() => {
    getCourseName(courseId)
      .then((response) => {
        setCourseName(response[0].className)
        setIsNameLoading(false)
      })
  }, [])

  return (
    <Card sx={{ width: 600, display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ justifyContent: 'left' }}>
        <ButtonBase onClick={() => EnterCourse(courseId)}>
          <CardContent sx={{ width: 500 }}>
            <Typography gutterBottom variant="h5" component="div">
              <span style={{ fontSize: '28px' }}>{courseId}</span>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {!isNameLoading
                && (<span>{courseName}</span>)}
            </Typography>
          </CardContent>
        </ButtonBase>
      </Box>
    </Card>
  )
}
