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
    window.location.href = `/courses/${courseId}/assignments`
  }

  useEffect(() => {
    getCourseName(courseId)
      .then((response) => {
        setCourseName(response[0].className)
        setIsNameLoading(false)
      })
  }, [])

  return (
    <Card
      sx={{
        width: 250, display: 'flex', justifyContent: 'center',
      }}
    >
      <Box sx={{ justifyContent: 'center' }}>
        <ButtonBase onClick={() => EnterCourse(courseId)}>
          <CardContent sx={{ width: 250 }}>
            <Typography gutterBottom variant="h4" component="div">
              <span className="font-sans font-bold" style={{ fontSize: '28px' }}>{courseId}</span>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {!isNameLoading
                && (<span className="font-sans">{courseName}</span>)}
            </Typography>
          </CardContent>
        </ButtonBase>
      </Box>
    </Card>
  )
}
