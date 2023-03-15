import { useState, useEffect } from 'react'
import {
  ButtonBase, Card, CardContent, Box,
} from '@mui/material'
import { getCourseName } from '../infoHelpers'

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
        width: 350, height: 200, display: 'flex', justifyContent: 'center', backgroundColor: '#E6DCC740', border: 6, borderColor: '#212D3B', borderRadius: 8, margin: '30px',
      }}
    >
      <Box sx={{ justifyContent: 'left' }}>
        <ButtonBase onClick={() => EnterCourse(courseId)}>
          <CardContent sx={{ width: 350, height: 200 }}>
            <div>
              <h1 className="font-bold font-sans text-3xl p-4" style={{ display: 'inline-block' }}>
                {/* span className="px-12 font-sans font-bold" style={{ fontSize: '28px' }}>
              {courseId}</span> */}
                {courseId}
                {'\n'}
              </h1>
            </div>
            <div>
              <h2 className="font-sans text-xl p-4" style={{ display: 'inline-block' }}>
                {!isNameLoading
                && (<span className="font-sans">{courseName}</span>)}
              </h2>
            </div>
          </CardContent>
        </ButtonBase>
      </Box>
    </Card>
  )
}
